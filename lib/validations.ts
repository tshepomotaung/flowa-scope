import { z } from "zod"

// Step 1
export const step1Schema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  workEmail: z.string().email("Valid email required"),
  mobile: z.string().regex(/^\+?[0-9\s\-]{8,15}$/, "Valid mobile number required"),
  companyLegalName: z.string().min(1, "Required"),
  companyTradingName: z.string().optional(),
  roleTitle: z.string().optional(),
  companyWebsite: z.string().url("Valid URL required").optional().or(z.literal("")),
  preferredContact: z.enum(["whatsapp", "email", "either"]).default("whatsapp"),
})
export type Step1Data = z.infer<typeof step1Schema>

// Step 2
export const step2Schema = z.object({
  industry: z.enum([
    "broadcasting_media",
    "financial_services",
    "insurance",
    "retail",
    "fmcg",
    "public_sector",
    "seta",
    "healthcare",
    "education",
    "logistics",
    "hospitality",
    "professional_services",
    "other",
  ]),
  employeeBand: z.enum(["1-10", "11-50", "51-200", "201-500", "500+"]),
  currentWhatsappUse: z.enum([
    "not_using",
    "whatsapp_business_app",
    "whatsapp_business_api",
    "unsure",
  ]),
  existingWaba: z.enum(["yes", "no", "unsure"]),
})
export type Step2Data = z.infer<typeof step2Schema>

// Step 3 — all 14 features as booleans
export const step3Schema = z.object({
  features: z.object({
    customer_service: z.boolean().default(false),
    marketing_broadcasts: z.boolean().default(false),
    ai_chatbot: z.boolean().default(false),
    multi_language: z.boolean().default(false),
    ecommerce_integration: z.boolean().default(false),
    crm_integration: z.boolean().default(false),
    payment_integration: z.boolean().default(false),
    otp_authentication: z.boolean().default(false),
    appointment_booking: z.boolean().default(false),
    lead_capture: z.boolean().default(false),
    multi_team_inbox: z.boolean().default(false),
    reporting_analytics: z.boolean().default(false),
    green_tick: z.boolean().default(false),
    custom_development: z.boolean().default(false),
  }),
})
export type Step3Data = z.infer<typeof step3Schema>

// Step 4
export const step4Schema = z.object({
  monthlyConversationBand: z.enum([
    "under_1000",
    "1000_5000",
    "5000_25000",
    "25000_100000",
    "over_100000",
  ]),
  userSeatsNeeded: z.number().int().min(1).max(10000),
  timeline: z.enum(["this_month", "1_3_months", "3_6_months", "exploring"]),
  budgetBand: z.enum(["under_2k", "2k_5k", "5k_15k", "15k_50k", "over_50k", "unsure"]),
})
export type Step4Data = z.infer<typeof step4Schema>

// Full form schema
export const fullFormSchema = step1Schema
  .merge(step2Schema)
  .merge(step3Schema)
  .merge(step4Schema)
export type FullFormData = z.infer<typeof fullFormSchema>
