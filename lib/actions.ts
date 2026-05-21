"use server"
import { createServiceClient } from "./supabase"
import { inferTier, normalisePhone } from "./utils"
import { FullFormData } from "./validations"
import { sendInternalLeadEmail } from "./email"

export type SubmitResult =
  | { success: true; id: string; tier: string }
  | { success: false; error: string }

export async function submitScopeForm(
  data: FullFormData,
  utmParams?: Record<string, string>
): Promise<SubmitResult> {
  try {
    const db = createServiceClient()
    const enabledCount = Object.values(data.features).filter(Boolean).length
    const tier = inferTier(
      enabledCount,
      data.monthlyConversationBand,
      data.employeeBand,
      data.features.custom_development,
      data.budgetBand
    )

    const { data: row, error } = await db
      .from("submissions")
      .insert({
        first_name: data.firstName,
        last_name: data.lastName,
        work_email: data.workEmail,
        mobile_e164: normalisePhone(data.mobile),
        preferred_contact: data.preferredContact,
        company_legal_name: data.companyLegalName,
        company_trading_name: data.companyTradingName || null,
        role_title: data.roleTitle || null,
        company_website: data.companyWebsite || null,
        industry: data.industry,
        employee_band: data.employeeBand,
        current_whatsapp_use: data.currentWhatsappUse,
        existing_waba:
          data.existingWaba === "yes" ? true : data.existingWaba === "no" ? false : null,
        features: data.features,
        monthly_conversation_band: data.monthlyConversationBand,
        user_seats_needed: data.userSeatsNeeded,
        timeline: data.timeline,
        budget_band: data.budgetBand,
        popia_consent: true,
        popia_consent_at: new Date().toISOString(),
        marketing_opt_in: false,
        utm: utmParams || {},
        recommended_tier: tier,
        status: "new",
        demo_status: "pending",
      })
      .select("id")
      .single()

    if (error) throw error

    // Fire internal notification (non-blocking)
    sendInternalLeadEmail({
      id: row.id,
      firstName: data.firstName,
      lastName: data.lastName,
      workEmail: data.workEmail,
      companyLegalName: data.companyLegalName,
      industry: data.industry,
      tier,
    }).catch(console.error)

    return { success: true, id: row.id, tier }
  } catch (err) {
    console.error("submitScopeForm error:", err)
    return { success: false, error: "Something went wrong. Please try again." }
  }
}
