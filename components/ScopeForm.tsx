"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  type FullFormData,
} from "@/lib/validations"
import { COPY } from "@/lib/copy"
import { submitScopeForm } from "@/lib/actions"

const SESSION_KEY = "flowa_scope_form"

const FEATURE_KEYS = COPY.features.map((f) => f.key)

type FeatureKey = (typeof FEATURE_KEYS)[number]

const defaultValues: FullFormData = {
  // Step 1
  firstName: "",
  lastName: "",
  workEmail: "",
  mobile: "",
  companyLegalName: "",
  companyTradingName: "",
  roleTitle: "",
  companyWebsite: "",
  preferredContact: "whatsapp",
  // Step 2
  industry: "retail",
  employeeBand: "1-10",
  currentWhatsappUse: "not_using",
  existingWaba: "unsure",
  // Step 3
  features: {
    customer_service: false,
    marketing_broadcasts: false,
    ai_chatbot: false,
    multi_language: false,
    ecommerce_integration: false,
    crm_integration: false,
    payment_integration: false,
    otp_authentication: false,
    appointment_booking: false,
    lead_capture: false,
    multi_team_inbox: false,
    reporting_analytics: false,
    green_tick: false,
    custom_development: false,
  },
  // Step 4
  monthlyConversationBand: "under_1000",
  userSeatsNeeded: 1,
  timeline: "1_3_months",
  budgetBand: "unsure",
}

const stepSchemas = [step1Schema, step2Schema, step3Schema, step4Schema]

// Styles
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  fontSize: "15px",
  border: "1px solid #D0D5DD",
  borderRadius: "8px",
  outline: "none",
  color: "#1F2937",
  backgroundColor: "#FFFFFF",
  minHeight: "44px",
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "13px",
  fontWeight: 600,
  color: "#1F2A44",
  marginBottom: "6px",
}

const errorStyle: React.CSSProperties = {
  fontSize: "12px",
  color: "#D92D20",
  marginTop: "4px",
}

const sectionHeadStyle: React.CSSProperties = {
  fontSize: "22px",
  fontWeight: 700,
  color: "#1F2A44",
  marginBottom: "6px",
}

const sectionSubStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#667085",
  marginBottom: "28px",
}

function FieldWrap({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <label style={labelStyle}>{label}</label>
      {children}
      {error && <p style={errorStyle}>{error}</p>}
    </div>
  )
}

function RadioCard({
  selected,
  onClick,
  children,
}: {
  selected: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "12px 16px",
        borderRadius: "10px",
        border: `2px solid ${selected ? "#1FAD5A" : "#D0D5DD"}`,
        backgroundColor: selected ? "rgba(31,173,90,0.06)" : "#FFFFFF",
        cursor: "pointer",
        textAlign: "left",
        minHeight: "44px",
        width: "100%",
        transition: "border-color 0.15s, background-color 0.15s",
      }}
    >
      <span
        style={{
          width: "18px",
          height: "18px",
          borderRadius: "50%",
          border: `2px solid ${selected ? "#1FAD5A" : "#D0D5DD"}`,
          backgroundColor: selected ? "#1FAD5A" : "transparent",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {selected && (
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor: "#FFFFFF",
            }}
          />
        )}
      </span>
      <span style={{ fontSize: "14px", color: "#1F2937", fontWeight: selected ? 600 : 400 }}>
        {children}
      </span>
    </button>
  )
}

function SegmentButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        flex: 1,
        padding: "10px 8px",
        fontSize: "13px",
        fontWeight: selected ? 700 : 500,
        color: selected ? "#FFFFFF" : "#667085",
        backgroundColor: selected ? "#1FAD5A" : "#FFFFFF",
        border: `1px solid ${selected ? "#1FAD5A" : "#D0D5DD"}`,
        cursor: "pointer",
        minHeight: "44px",
        transition: "all 0.15s",
      }}
    >
      {children}
    </button>
  )
}

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      style={{
        position: "relative",
        width: "44px",
        height: "24px",
        borderRadius: "12px",
        backgroundColor: checked ? "#1FAD5A" : "#D0D5DD",
        border: "none",
        cursor: "pointer",
        flexShrink: 0,
        transition: "background-color 0.2s",
        padding: 0,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: "3px",
          left: checked ? "23px" : "3px",
          width: "18px",
          height: "18px",
          borderRadius: "50%",
          backgroundColor: "#FFFFFF",
          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
          transition: "left 0.2s",
        }}
      />
    </button>
  )
}

// Step components
function Step1({ form }: { form: ReturnType<typeof useForm<FullFormData>> }) {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = form
  const preferredContact = watch("preferredContact")

  return (
    <div>
      <h2 style={sectionHeadStyle}>About you</h2>
      <p style={sectionSubStyle}>
        We&apos;ll use these details to personalise your demo and send a calendar invite.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <FieldWrap label="First name *" error={errors.firstName?.message}>
          <input style={inputStyle} {...register("firstName")} placeholder="Thabo" />
        </FieldWrap>
        <FieldWrap label="Last name *" error={errors.lastName?.message}>
          <input style={inputStyle} {...register("lastName")} placeholder="Mokoena" />
        </FieldWrap>
      </div>

      <FieldWrap label="Work email *" error={errors.workEmail?.message}>
        <input
          style={inputStyle}
          {...register("workEmail")}
          type="email"
          placeholder="thabo@company.co.za"
        />
      </FieldWrap>

      <FieldWrap label="Mobile number *" error={errors.mobile?.message}>
        <input
          style={inputStyle}
          {...register("mobile")}
          type="tel"
          placeholder="+27 82 000 0000"
        />
      </FieldWrap>

      <FieldWrap label="Company legal name *" error={errors.companyLegalName?.message}>
        <input
          style={inputStyle}
          {...register("companyLegalName")}
          placeholder="Acme (Pty) Ltd"
        />
      </FieldWrap>

      <FieldWrap label="Trading name (if different)" error={errors.companyTradingName?.message}>
        <input style={inputStyle} {...register("companyTradingName")} placeholder="Acme" />
      </FieldWrap>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <FieldWrap label="Your role / title" error={errors.roleTitle?.message}>
          <input style={inputStyle} {...register("roleTitle")} placeholder="Head of Marketing" />
        </FieldWrap>
        <FieldWrap label="Company website" error={errors.companyWebsite?.message}>
          <input
            style={inputStyle}
            {...register("companyWebsite")}
            placeholder="https://company.co.za"
          />
        </FieldWrap>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <label style={labelStyle}>Preferred contact method</label>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {(
            [
              { value: "whatsapp", label: "WhatsApp" },
              { value: "email", label: "Email" },
              { value: "either", label: "Either is fine" },
            ] as const
          ).map((opt) => (
            <RadioCard
              key={opt.value}
              selected={preferredContact === opt.value}
              onClick={() => setValue("preferredContact", opt.value)}
            >
              {opt.label}
            </RadioCard>
          ))}
        </div>
      </div>
    </div>
  )
}

function Step2({ form }: { form: ReturnType<typeof useForm<FullFormData>> }) {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = form
  const employeeBand = watch("employeeBand")
  const currentWhatsappUse = watch("currentWhatsappUse")
  const existingWaba = watch("existingWaba")

  return (
    <div>
      <h2 style={sectionHeadStyle}>Your business</h2>
      <p style={sectionSubStyle}>
        This helps us match you with the right Flowa features and implementation plan.
      </p>

      <FieldWrap label="Industry *" error={errors.industry?.message}>
        <select style={{ ...inputStyle, appearance: "none" }} {...register("industry")}>
          {Object.entries(COPY.industries).map(([val, label]) => (
            <option key={val} value={val}>
              {label}
            </option>
          ))}
        </select>
      </FieldWrap>

      <div style={{ marginBottom: "16px" }}>
        <label style={labelStyle}>Number of employees *</label>
        <div
          style={{
            display: "flex",
            borderRadius: "8px",
            overflow: "hidden",
            border: "1px solid #D0D5DD",
          }}
        >
          {COPY.employeeBands.map((band) => (
            <SegmentButton
              key={band}
              selected={employeeBand === band}
              onClick={() => setValue("employeeBand", band)}
            >
              {band}
            </SegmentButton>
          ))}
        </div>
        {errors.employeeBand && <p style={errorStyle}>{errors.employeeBand.message}</p>}
      </div>

      <div style={{ marginBottom: "16px" }}>
        <label style={labelStyle}>Current WhatsApp usage *</label>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {(
            Object.entries(COPY.whatsappUse) as [
              keyof typeof COPY.whatsappUse,
              string,
            ][]
          ).map(([val, label]) => (
            <RadioCard
              key={val}
              selected={currentWhatsappUse === val}
              onClick={() => setValue("currentWhatsappUse", val)}
            >
              {label}
            </RadioCard>
          ))}
        </div>
        {errors.currentWhatsappUse && (
          <p style={errorStyle}>{errors.currentWhatsappUse.message}</p>
        )}
      </div>

      <div style={{ marginBottom: "16px" }}>
        <label style={labelStyle}>Do you have an existing WhatsApp Business Account (WABA)? *</label>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {(
            [
              { value: "yes", label: "Yes, we have one" },
              { value: "no", label: "No, we don't" },
              { value: "unsure", label: "Not sure" },
            ] as const
          ).map((opt) => (
            <RadioCard
              key={opt.value}
              selected={existingWaba === opt.value}
              onClick={() => setValue("existingWaba", opt.value)}
            >
              {opt.label}
            </RadioCard>
          ))}
        </div>
        {errors.existingWaba && <p style={errorStyle}>{errors.existingWaba.message}</p>}
      </div>
    </div>
  )
}

function Step3({ form }: { form: ReturnType<typeof useForm<FullFormData>> }) {
  const { watch, setValue } = form
  const features = watch("features")

  return (
    <div>
      <h2 style={sectionHeadStyle}>Features you need</h2>
      <p style={sectionSubStyle}>
        Select everything that applies — we&apos;ll scope the right solution for you.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "12px",
        }}
      >
        {COPY.features.map((feature) => {
          const key = feature.key as FeatureKey
          const checked = features[key] ?? false
          return (
            <div
              key={key}
              onClick={() => setValue(`features.${key}`, !checked)}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
                padding: "16px",
                borderRadius: "10px",
                border: `2px solid ${checked ? "#1FAD5A" : "#D0D5DD"}`,
                backgroundColor: checked ? "rgba(31,173,90,0.05)" : "#FFFFFF",
                cursor: "pointer",
                transition: "border-color 0.15s, background-color 0.15s",
              }}
            >
              <div style={{ flexShrink: 0, paddingTop: "2px" }}>
                <ToggleSwitch
                  checked={checked}
                  onChange={() => setValue(`features.${key}`, !checked)}
                />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                  <span style={{ fontSize: "16px" }}>{feature.icon}</span>
                  <span style={{ fontSize: "14px", fontWeight: 600, color: "#1F2A44" }}>
                    {feature.label}
                  </span>
                </div>
                <p style={{ fontSize: "12px", color: "#667085", lineHeight: 1.5, margin: 0 }}>
                  {feature.desc}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Step4({ form }: { form: ReturnType<typeof useForm<FullFormData>> }) {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = form
  const monthlyConversationBand = watch("monthlyConversationBand")
  const timeline = watch("timeline")
  const budgetBand = watch("budgetBand")
  const userSeatsNeeded = watch("userSeatsNeeded")

  const quickSeats = [1, 5, 10, 25, 50]

  return (
    <div>
      <h2 style={sectionHeadStyle}>Scale &amp; timing</h2>
      <p style={sectionSubStyle}>
        Help us understand your volume so we can recommend the right plan.
      </p>

      <div style={{ marginBottom: "20px" }}>
        <label style={labelStyle}>Monthly conversation volume *</label>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          {(
            Object.entries(COPY.conversationBands) as [
              keyof typeof COPY.conversationBands,
              string,
            ][]
          ).map(([val, label]) => (
            <button
              key={val}
              type="button"
              onClick={() => setValue("monthlyConversationBand", val)}
              style={{
                padding: "8px 16px",
                fontSize: "13px",
                fontWeight: monthlyConversationBand === val ? 700 : 500,
                color: monthlyConversationBand === val ? "#FFFFFF" : "#667085",
                backgroundColor: monthlyConversationBand === val ? "#1FAD5A" : "#FFFFFF",
                border: `1px solid ${monthlyConversationBand === val ? "#1FAD5A" : "#D0D5DD"}`,
                borderRadius: "100px",
                cursor: "pointer",
                minHeight: "44px",
                transition: "all 0.15s",
              }}
            >
              {label}
            </button>
          ))}
        </div>
        {errors.monthlyConversationBand && (
          <p style={errorStyle}>{errors.monthlyConversationBand.message}</p>
        )}
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label style={labelStyle}>How many user seats do you need? *</label>
        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
          <input
            style={{ ...inputStyle, width: "100px" }}
            type="number"
            min={1}
            max={10000}
            {...register("userSeatsNeeded", { valueAsNumber: true })}
          />
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {quickSeats.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setValue("userSeatsNeeded", n)}
                style={{
                  padding: "8px 14px",
                  fontSize: "13px",
                  fontWeight: userSeatsNeeded === n ? 700 : 500,
                  color: userSeatsNeeded === n ? "#FFFFFF" : "#667085",
                  backgroundColor: userSeatsNeeded === n ? "#1FAD5A" : "#FFFFFF",
                  border: `1px solid ${userSeatsNeeded === n ? "#1FAD5A" : "#D0D5DD"}`,
                  borderRadius: "8px",
                  cursor: "pointer",
                  minHeight: "44px",
                }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
        {errors.userSeatsNeeded && <p style={errorStyle}>{errors.userSeatsNeeded.message}</p>}
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label style={labelStyle}>When do you want to go live? *</label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          {(Object.entries(COPY.timelines) as [keyof typeof COPY.timelines, string][]).map(
            ([val, label]) => (
              <RadioCard
                key={val}
                selected={timeline === val}
                onClick={() => setValue("timeline", val)}
              >
                {label}
              </RadioCard>
            )
          )}
        </div>
        {errors.timeline && <p style={errorStyle}>{errors.timeline.message}</p>}
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label style={labelStyle}>Monthly budget range *</label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          {(Object.entries(COPY.budgetBands) as [keyof typeof COPY.budgetBands, string][]).map(
            ([val, label]) => (
              <RadioCard
                key={val}
                selected={budgetBand === val}
                onClick={() => setValue("budgetBand", val)}
              >
                {label}
              </RadioCard>
            )
          )}
        </div>
        {errors.budgetBand && <p style={errorStyle}>{errors.budgetBand.message}</p>}
      </div>
    </div>
  )
}

function Step5({
  form,
  isSubmitting,
  submitError,
  popiaConsent,
  setPopiaConsent,
  marketingOptIn,
  setMarketingOptIn,
}: {
  form: ReturnType<typeof useForm<FullFormData>>
  isSubmitting: boolean
  submitError: string
  popiaConsent: boolean
  setPopiaConsent: (v: boolean) => void
  marketingOptIn: boolean
  setMarketingOptIn: (v: boolean) => void
}) {
  return (
    <div>
      <h2 style={sectionHeadStyle}>Book your demo</h2>
      <p style={sectionSubStyle}>
        Pick a time and we&apos;ll send a tailored prep pack before the call.
      </p>

      {/* Cal.com placeholder */}
      <div
        style={{
          border: "2px dashed #D0D5DD",
          borderRadius: "12px",
          padding: "40px 24px",
          textAlign: "center",
          backgroundColor: "#FAFAFA",
          marginBottom: "28px",
        }}
      >
        <div style={{ fontSize: "32px", marginBottom: "12px" }}>📅</div>
        <p style={{ fontSize: "15px", fontWeight: 600, color: "#1F2A44", marginBottom: "8px" }}>
          Calendar booking coming soon
        </p>
        <p style={{ fontSize: "13px", color: "#667085", lineHeight: 1.6 }}>
          Set up your Cal.com account and add{" "}
          <code
            style={{
              backgroundColor: "#F2F4F7",
              padding: "2px 6px",
              borderRadius: "4px",
              fontSize: "12px",
            }}
          >
            NEXT_PUBLIC_CAL_USERNAME
          </code>{" "}
          to{" "}
          <code
            style={{
              backgroundColor: "#F2F4F7",
              padding: "2px 6px",
              borderRadius: "4px",
              fontSize: "12px",
            }}
          >
            .env.local
          </code>{" "}
          to enable live booking. Your details will still be submitted below.
        </p>
      </div>

      {/* POPIA consent */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #D0D5DD",
          borderRadius: "10px",
          padding: "20px",
          marginBottom: "16px",
        }}
      >
        <label
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "12px",
            cursor: "pointer",
            marginBottom: "16px",
          }}
        >
          <input
            type="checkbox"
            checked={popiaConsent}
            onChange={(e) => setPopiaConsent(e.target.checked)}
            style={{
              width: "18px",
              height: "18px",
              marginTop: "2px",
              flexShrink: 0,
              accentColor: "#1FAD5A",
              cursor: "pointer",
            }}
          />
          <span style={{ fontSize: "13px", color: "#1F2937", lineHeight: 1.6 }}>
            <strong>POPIA consent (required)</strong> — I consent to Flowa (Pty) Ltd processing my
            personal information to respond to this enquiry and to contact me about my demo booking.
            I have read and understood the{" "}
            <a
              href="/privacy"
              target="_blank"
              style={{ color: "#1FAD5A", textDecoration: "underline" }}
            >
              Privacy Notice
            </a>
            .
          </span>
        </label>

        <label
          style={{ display: "flex", alignItems: "flex-start", gap: "12px", cursor: "pointer" }}
        >
          <input
            type="checkbox"
            checked={marketingOptIn}
            onChange={(e) => setMarketingOptIn(e.target.checked)}
            style={{
              width: "18px",
              height: "18px",
              marginTop: "2px",
              flexShrink: 0,
              accentColor: "#1FAD5A",
              cursor: "pointer",
            }}
          />
          <span style={{ fontSize: "13px", color: "#667085", lineHeight: 1.6 }}>
            <strong>Marketing opt-in (optional)</strong> — I&apos;d like to receive product updates,
            WhatsApp marketing tips, and Flowa news. I can unsubscribe at any time.
          </span>
        </label>
      </div>

      {submitError && (
        <div
          style={{
            backgroundColor: "#FEF3F2",
            border: "1px solid #FECDCA",
            borderRadius: "8px",
            padding: "12px 16px",
            fontSize: "14px",
            color: "#D92D20",
            marginBottom: "16px",
          }}
        >
          {submitError}
        </div>
      )}

      <button
        type="submit"
        disabled={!popiaConsent || isSubmitting}
        style={{
          width: "100%",
          padding: "16px",
          fontSize: "16px",
          fontWeight: 700,
          color: "#FFFFFF",
          backgroundColor: !popiaConsent || isSubmitting ? "#A0D4B5" : "#1FAD5A",
          border: "none",
          borderRadius: "10px",
          cursor: !popiaConsent || isSubmitting ? "not-allowed" : "pointer",
          minHeight: "52px",
          transition: "background-color 0.15s",
        }}
      >
        {isSubmitting ? "Submitting…" : "Book my demo"}
      </button>

      <p style={{ fontSize: "12px", color: "#667085", textAlign: "center", marginTop: "12px" }}>
        POPIA Information Officer: Tshepo Motaung · info@flowa.co.za · Flowa (Pty) Ltd
      </p>
    </div>
  )
}

export default function ScopeForm() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [popiaConsent, setPopiaConsent] = useState(false)
  const [marketingOptIn, setMarketingOptIn] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  const form = useForm<FullFormData>({
    defaultValues,
    mode: "onTouched",
  })

  const { watch, getValues, trigger, handleSubmit } = form

  // Hydrate from sessionStorage
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<FullFormData & { _step: number }>
        const { _step, ...formData } = parsed
        Object.entries(formData).forEach(([key, value]) => {
          form.setValue(key as keyof FullFormData, value as never)
        })
        if (_step && _step >= 1 && _step <= 5) setStep(_step)
      }
    } catch {
      // ignore
    }
    setHydrated(true)
  }, [form])

  // Persist to sessionStorage on form change
  const persistForm = useCallback(() => {
    try {
      const values = getValues()
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ ...values, _step: step }))
    } catch {
      // ignore
    }
  }, [getValues, step])

  useEffect(() => {
    if (!hydrated) return
    const subscription = watch(() => persistForm())
    return () => subscription.unsubscribe()
  }, [watch, persistForm, hydrated])

  useEffect(() => {
    if (hydrated) persistForm()
  }, [step, hydrated, persistForm])

  const stepFields: (keyof FullFormData)[][] = [
    [
      "firstName",
      "lastName",
      "workEmail",
      "mobile",
      "companyLegalName",
      "companyTradingName",
      "roleTitle",
      "companyWebsite",
      "preferredContact",
    ],
    ["industry", "employeeBand", "currentWhatsappUse", "existingWaba"],
    ["features"],
    ["monthlyConversationBand", "userSeatsNeeded", "timeline", "budgetBand"],
  ]

  async function handleNext() {
    const fields = stepFields[step - 1]
    const schema = stepSchemas[step - 1]
    const values = getValues()

    // Validate only current step fields
    const stepValues: Record<string, unknown> = {}
    fields.forEach((f) => {
      stepValues[f] = values[f]
    })

    const result = schema.safeParse(stepValues)
    if (!result.success) {
      await trigger(fields)
      return
    }

    setStep((s) => s + 1)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  function handleBack() {
    setStep((s) => s - 1)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  async function onSubmit(data: FullFormData) {
    if (!popiaConsent) return
    setIsSubmitting(true)
    setSubmitError("")

    // Collect UTM params from URL
    const urlParams = new URLSearchParams(window.location.search)
    const utmParams: Record<string, string> = {}
    ;["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].forEach((key) => {
      const val = urlParams.get(key)
      if (val) utmParams[key] = val
    })

    const result = await submitScopeForm(
      { ...data, features: { ...data.features } },
      Object.keys(utmParams).length ? utmParams : undefined
    )

    setIsSubmitting(false)

    if (result.success) {
      try {
        sessionStorage.removeItem(SESSION_KEY)
      } catch {
        // ignore
      }
      router.push(`/confirm/${result.id}`)
    } else {
      setSubmitError(result.error)
    }
  }

  if (!hydrated) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px 24px",
        }}
      >
        <div style={{ fontSize: "14px", color: "#667085" }}>Loading…</div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: "680px", margin: "0 auto", padding: "24px 16px 64px" }}>
      {/* Logo */}
      <div style={{ marginBottom: "32px", textAlign: "center" }}>
        <a
          href="/"
          style={{
            color: "#1FAD5A",
            fontWeight: 700,
            fontSize: "24px",
            textDecoration: "none",
            letterSpacing: "-0.5px",
          }}
        >
          FLOWA
        </a>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: "32px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            marginBottom: "12px",
          }}
        >
          {COPY.steps.map((label, i) => {
            const stepNum = i + 1
            const active = stepNum === step
            const done = stepNum < step
            return (
              <div key={label} style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    border: `2px solid ${done || active ? "#1FAD5A" : "#D0D5DD"}`,
                    backgroundColor: done ? "#1FAD5A" : active ? "rgba(31,173,90,0.1)" : "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    fontWeight: 700,
                    color: done ? "#FFFFFF" : active ? "#1FAD5A" : "#667085",
                    flexShrink: 0,
                    transition: "all 0.2s",
                  }}
                >
                  {done ? "✓" : stepNum}
                </div>
                {i < COPY.steps.length - 1 && (
                  <div
                    style={{
                      width: "32px",
                      height: "2px",
                      backgroundColor: done ? "#1FAD5A" : "#D0D5DD",
                      margin: "0 4px",
                      transition: "background-color 0.2s",
                    }}
                  />
                )}
              </div>
            )
          })}
        </div>
        <p style={{ textAlign: "center", fontSize: "13px", color: "#667085", margin: 0 }}>
          Step {step} of {COPY.steps.length} — {COPY.steps[step - 1]}
        </p>
      </div>

      {/* Form card */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #D0D5DD",
          borderRadius: "16px",
          padding: "clamp(20px, 4vw, 40px)",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {step === 1 && <Step1 form={form} />}
          {step === 2 && <Step2 form={form} />}
          {step === 3 && <Step3 form={form} />}
          {step === 4 && <Step4 form={form} />}
          {step === 5 && (
            <Step5
              form={form}
              isSubmitting={isSubmitting}
              submitError={submitError}
              popiaConsent={popiaConsent}
              setPopiaConsent={setPopiaConsent}
              marketingOptIn={marketingOptIn}
              setMarketingOptIn={setMarketingOptIn}
            />
          )}

          {/* Navigation */}
          {step < 5 && (
            <div
              style={{
                display: "flex",
                justifyContent: step === 1 ? "flex-end" : "space-between",
                marginTop: "28px",
                gap: "12px",
              }}
            >
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  style={{
                    padding: "12px 24px",
                    fontSize: "15px",
                    fontWeight: 600,
                    color: "#1F2A44",
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #D0D5DD",
                    borderRadius: "10px",
                    cursor: "pointer",
                    minHeight: "44px",
                  }}
                >
                  ← Back
                </button>
              )}
              <button
                type="button"
                onClick={handleNext}
                style={{
                  padding: "12px 32px",
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "#FFFFFF",
                  backgroundColor: "#1FAD5A",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                  minHeight: "44px",
                  transition: "opacity 0.15s",
                }}
              >
                Next →
              </button>
            </div>
          )}

          {step === 5 && step > 1 && (
            <div style={{ marginTop: "16px" }}>
              <button
                type="button"
                onClick={handleBack}
                style={{
                  padding: "10px 20px",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#667085",
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                ← Back
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
