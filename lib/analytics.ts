import { captureEvent } from "./posthog"

export const Analytics = {
  formStepViewed: (step: number) => captureEvent("form_step_viewed", { step }),
  formStepCompleted: (step: number) => captureEvent("form_step_completed", { step }),
  formSubmitted: (tier: string) => captureEvent("form_submitted", { tier }),
  formSubmitFailed: (error: string) => captureEvent("form_submit_failed", { error }),
  demoBooked: () => captureEvent("demo_booked"),
}
