export const COPY = {
  steps: ["About you", "Your business", "Features", "Scale & timing", "Book demo"] as const,

  industries: {
    broadcasting_media: "Broadcasting & Media",
    financial_services: "Financial Services",
    insurance: "Insurance",
    retail: "Retail",
    fmcg: "FMCG / Consumer Goods",
    public_sector: "Public Sector",
    seta: "SETA / Training",
    healthcare: "Healthcare",
    education: "Education",
    logistics: "Logistics & Supply Chain",
    hospitality: "Hospitality & Tourism",
    professional_services: "Professional Services",
    other: "Other",
  } as const,

  employeeBands: ["1-10", "11-50", "51-200", "201-500", "500+"] as const,

  whatsappUse: {
    not_using: "Not using WhatsApp for business yet",
    whatsapp_business_app: "Using the WhatsApp Business app",
    whatsapp_business_api: "Already on the API via another provider",
    unsure: "Not sure",
  } as const,

  timelines: {
    this_month: "This month",
    "1_3_months": "1–3 months",
    "3_6_months": "3–6 months",
    exploring: "Just exploring",
  } as const,

  budgetBands: {
    under_2k: "Under R2k/mo",
    "2k_5k": "R2–5k/mo",
    "5k_15k": "R5–15k/mo",
    "15k_50k": "R15–50k/mo",
    over_50k: "R50k+/mo",
    unsure: "Not sure yet",
  } as const,

  conversationBands: {
    under_1000: "Under 1 000/mo",
    "1000_5000": "1 000–5 000/mo",
    "5000_25000": "5 000–25 000/mo",
    "25000_100000": "25 000–100 000/mo",
    over_100000: "Over 100 000/mo",
  } as const,

  features: [
    {
      key: "customer_service",
      label: "WhatsApp customer service",
      icon: "💬",
      desc: "Reply to customer questions in WhatsApp, with AI handling the easy ones.",
    },
    {
      key: "marketing_broadcasts",
      label: "Marketing broadcasts",
      icon: "📣",
      desc: "Send opt-in campaigns and offers to your contact list.",
    },
    {
      key: "ai_chatbot",
      label: "AI chatbot / virtual agent",
      icon: "🤖",
      desc: "A bot trained on your business that handles common queries 24/7.",
    },
    {
      key: "multi_language",
      label: "Multi-language support",
      icon: "🌍",
      desc: "Conversations in English, isiZulu, isiXhosa, Afrikaans, Sesotho.",
    },
    {
      key: "ecommerce_integration",
      label: "E-commerce integration",
      icon: "🛒",
      desc: "Catalogue, ordering, and payment in WhatsApp.",
    },
    {
      key: "crm_integration",
      label: "CRM integration",
      icon: "🔗",
      desc: "Sync conversations to HubSpot / Salesforce / Zoho or similar.",
    },
    {
      key: "payment_integration",
      label: "Payment integration",
      icon: "💳",
      desc: "Take payments in WhatsApp via Ozow, Peach, or Yoco.",
    },
    {
      key: "otp_authentication",
      label: "OTP and authentication",
      icon: "🔐",
      desc: "Send one-time passwords for sign-in or transactions.",
    },
    {
      key: "appointment_booking",
      label: "Appointment booking",
      icon: "📅",
      desc: "Customers book slots conversationally.",
    },
    {
      key: "lead_capture",
      label: "Lead capture",
      icon: "🎯",
      desc: "Click-to-WhatsApp ads landing in qualified pipeline.",
    },
    {
      key: "multi_team_inbox",
      label: "Multi-team inbox",
      icon: "👥",
      desc: "Multiple agents handle conversations with routing.",
    },
    {
      key: "reporting_analytics",
      label: "Reporting and analytics",
      icon: "📊",
      desc: "Dashboard of conversations, conversions, and agent performance.",
    },
    {
      key: "green_tick",
      label: "WhatsApp green tick",
      icon: "✅",
      desc: "Official business verification from Meta.",
    },
    {
      key: "custom_development",
      label: "Custom development",
      icon: "🏗️",
      desc: "Bespoke features built for your specific workflow.",
    },
  ] as const,
}
