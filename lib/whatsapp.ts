const WA_API_URL = process.env.FLOWA_WA_API_URL ?? ""
const WA_API_KEY = process.env.FLOWA_WA_API_KEY ?? ""
const NAMESPACE = process.env.FLOWA_WA_TEMPLATE_NAMESPACE ?? ""

interface TemplateParams {
  to: string          // E.164 mobile
  template: string    // template name
  components: Array<{
    type: "body" | "header" | "button"
    parameters: Array<{ type: "text"; text: string }>
  }>
}

export async function sendWhatsAppTemplate(params: TemplateParams): Promise<void> {
  if (!WA_API_URL || !WA_API_KEY) {
    console.warn("WhatsApp API not configured — skipping WA send")
    return
  }
  const res = await fetch(WA_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${WA_API_KEY}`,
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: params.to,
      type: "template",
      template: {
        name: params.template,
        namespace: NAMESPACE,
        language: { code: "en" },
        components: params.components,
      },
    }),
  })
  if (!res.ok) {
    const body = await res.text().catch(() => "")
    console.error(`WhatsApp send failed: ${res.status}`, body)
  }
}

// Named helpers for each template
export async function sendDemoConfirmedWA(mobile: string, firstName: string, demoAt: Date, rescheduleUrl: string) {
  const dateStr = demoAt.toLocaleString("en-ZA", { dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Johannesburg" })
  await sendWhatsAppTemplate({
    to: mobile,
    template: "flowa_demo_confirmed",
    components: [{ type: "body", parameters: [{ type: "text", text: firstName }, { type: "text", text: dateStr }] }],
  })
  void rescheduleUrl
}

export async function sendDemo48hWA(mobile: string, firstName: string, demoAt: Date, rescheduleUrl: string) {
  const dateStr = demoAt.toLocaleString("en-ZA", { dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Johannesburg" })
  await sendWhatsAppTemplate({
    to: mobile,
    template: "flowa_demo_48h",
    components: [{ type: "body", parameters: [{ type: "text", text: firstName }, { type: "text", text: dateStr }, { type: "text", text: rescheduleUrl }] }],
  })
}

export async function sendDemo24hWA(mobile: string, firstName: string, demoAt: Date) {
  const dateStr = demoAt.toLocaleString("en-ZA", { dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Johannesburg" })
  await sendWhatsAppTemplate({
    to: mobile,
    template: "flowa_demo_24h",
    components: [{ type: "body", parameters: [{ type: "text", text: firstName }, { type: "text", text: dateStr }] }],
  })
}

export async function sendDemo1hWA(mobile: string, firstName: string, joinUrl: string) {
  await sendWhatsAppTemplate({
    to: mobile,
    template: "flowa_demo_1h",
    components: [{ type: "body", parameters: [{ type: "text", text: firstName }, { type: "text", text: joinUrl }] }],
  })
}

export async function sendThankYouWA(mobile: string, firstName: string, nextStepsUrl: string) {
  await sendWhatsAppTemplate({
    to: mobile,
    template: "flowa_thank_you",
    components: [{ type: "body", parameters: [{ type: "text", text: firstName }, { type: "text", text: nextStepsUrl }] }],
  })
}

export async function sendNoShowWA(mobile: string, firstName: string, rescheduleUrl: string) {
  await sendWhatsAppTemplate({
    to: mobile,
    template: "flowa_no_show",
    components: [{ type: "body", parameters: [{ type: "text", text: firstName }, { type: "text", text: rescheduleUrl }] }],
  })
}
