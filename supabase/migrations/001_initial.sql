-- ============================================================
-- Flowa Scope — Initial migration
-- ============================================================

-- ENUMS

CREATE TYPE submission_status AS ENUM ('new', 'in_review', 'demo_booked', 'converted', 'lost', 'disqualified');
CREATE TYPE demo_status AS ENUM ('pending', 'booked', 'rescheduled', 'completed', 'no_show', 'cancelled');
CREATE TYPE preferred_contact AS ENUM ('whatsapp', 'email', 'either');
CREATE TYPE industry AS ENUM (
  'broadcasting_media',
  'financial_services',
  'insurance',
  'retail',
  'fmcg',
  'public_sector',
  'seta',
  'healthcare',
  'education',
  'logistics',
  'hospitality',
  'professional_services',
  'other'
);
CREATE TYPE employee_band AS ENUM ('1-10', '11-50', '51-200', '201-500', '500+');
CREATE TYPE whatsapp_use AS ENUM ('not_using', 'whatsapp_business_app', 'whatsapp_business_api', 'unsure');
CREATE TYPE conversation_band AS ENUM ('under_1000', '1000_5000', '5000_25000', '25000_100000', 'over_100000');
CREATE TYPE timeline AS ENUM ('this_month', '1_3_months', '3_6_months', 'exploring');
CREATE TYPE budget_band AS ENUM ('under_2k', '2k_5k', '5k_15k', '15k_50k', 'over_50k', 'unsure');
CREATE TYPE recommended_tier AS ENUM ('Starter', 'Growth', 'Pro', 'Enterprise');
CREATE TYPE reminder_type AS ENUM ('24h_before', '1h_before', 'follow_up_24h', 'follow_up_72h', 'no_show');
CREATE TYPE reminder_channel AS ENUM ('whatsapp', 'email');
CREATE TYPE reminder_status AS ENUM ('pending', 'sent', 'failed', 'skipped');
CREATE TYPE event_type AS ENUM ('booking_created', 'booking_rescheduled', 'booking_cancelled', 'booking_completed');

-- ============================================================
-- SUBMISSIONS
-- ============================================================

CREATE TABLE submissions (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Contact
  first_name               TEXT NOT NULL,
  last_name                TEXT NOT NULL,
  work_email               TEXT NOT NULL,
  mobile_e164              TEXT NOT NULL,
  preferred_contact        preferred_contact NOT NULL DEFAULT 'whatsapp',

  -- Company
  company_legal_name       TEXT NOT NULL,
  company_trading_name     TEXT,
  role_title               TEXT,
  company_website          TEXT,

  -- Business profile
  industry                 industry NOT NULL,
  employee_band            employee_band NOT NULL,
  current_whatsapp_use     whatsapp_use NOT NULL,
  existing_waba            BOOLEAN,

  -- Features (JSONB map of feature_key -> boolean)
  features                 JSONB NOT NULL DEFAULT '{}'::jsonb,

  -- Scale & timing
  monthly_conversation_band conversation_band NOT NULL,
  user_seats_needed        INTEGER NOT NULL DEFAULT 1,
  timeline                 timeline NOT NULL,
  budget_band              budget_band NOT NULL,

  -- Consent
  popia_consent            BOOLEAN NOT NULL DEFAULT FALSE,
  popia_consent_at         TIMESTAMPTZ,
  marketing_opt_in         BOOLEAN NOT NULL DEFAULT FALSE,

  -- Attribution
  utm                      JSONB NOT NULL DEFAULT '{}'::jsonb,

  -- CRM / pipeline
  recommended_tier         recommended_tier,
  status                   submission_status NOT NULL DEFAULT 'new',
  demo_status              demo_status NOT NULL DEFAULT 'pending',
  notes                    TEXT,
  assigned_to              TEXT,

  -- Cal.com booking
  calcom_booking_uid       TEXT,
  calcom_event_type_id     INTEGER,
  demo_scheduled_at        TIMESTAMPTZ,
  demo_end_at              TIMESTAMPTZ,
  demo_location            TEXT,
  demo_meeting_url         TEXT
);

CREATE INDEX submissions_work_email_idx ON submissions (work_email);
CREATE INDEX submissions_status_idx ON submissions (status);
CREATE INDEX submissions_demo_scheduled_at_idx ON submissions (demo_scheduled_at);
CREATE INDEX submissions_created_at_idx ON submissions (created_at DESC);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER submissions_updated_at
  BEFORE UPDATE ON submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- OWNERS (Flowa team members who manage submissions)
-- ============================================================

CREATE TABLE owners (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  name        TEXT NOT NULL,
  email       TEXT NOT NULL UNIQUE,
  mobile_e164 TEXT,
  active      BOOLEAN NOT NULL DEFAULT TRUE
);

-- ============================================================
-- REMINDERS
-- ============================================================

CREATE TABLE reminders (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  submission_id  UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  type           reminder_type NOT NULL,
  channel        reminder_channel NOT NULL,
  scheduled_at   TIMESTAMPTZ NOT NULL,
  sent_at        TIMESTAMPTZ,
  status         reminder_status NOT NULL DEFAULT 'pending',
  error_message  TEXT
);

CREATE INDEX reminders_submission_id_idx ON reminders (submission_id);
CREATE INDEX reminders_scheduled_at_status_idx ON reminders (scheduled_at, status) WHERE status = 'pending';

-- ============================================================
-- EVENTS (webhook audit log from Cal.com)
-- ============================================================

CREATE TABLE events (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  submission_id  UUID REFERENCES submissions(id) ON DELETE SET NULL,
  event_type     event_type NOT NULL,
  payload        JSONB NOT NULL DEFAULT '{}'::jsonb,
  processed      BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX events_submission_id_idx ON events (submission_id);
CREATE INDEX events_processed_idx ON events (processed) WHERE processed = FALSE;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Service role can do everything (used by server actions)
CREATE POLICY "service_role_all" ON submissions FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all" ON owners FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all" ON reminders FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all" ON events FOR ALL TO service_role USING (true) WITH CHECK (true);
