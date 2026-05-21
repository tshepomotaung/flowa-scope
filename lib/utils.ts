import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function inferTier(
  featuresEnabled: number,
  conversationBand: string,
  employeeBand: string,
  customDev: boolean,
  budgetBand: string
): string {
  if (
    employeeBand === "201-500" ||
    employeeBand === "500+" ||
    conversationBand === "over_100000" ||
    (customDev && (budgetBand === "15k_50k" || budgetBand === "over_50k"))
  )
    return "Enterprise"
  if (featuresEnabled >= 7 || customDev || conversationBand === "25000_100000") return "Pro"
  if (featuresEnabled >= 4 || conversationBand === "5000_25000") return "Growth"
  return "Starter"
}

export function normalisePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "")
  if (digits.startsWith("0") && digits.length === 10) return "+27" + digits.slice(1)
  if (digits.startsWith("27") && digits.length === 11) return "+" + digits
  return raw.startsWith("+") ? raw : "+" + digits
}
