import { NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase"
import {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  Table, TableRow, TableCell, WidthType, AlignmentType,
} from "docx"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const db = createServiceClient()
  const { data: s, error } = await db.from("submissions").select("*").eq("id", id).single()
  if (error || !s) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const row = (label: string, value: string) => new TableRow({
    children: [
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, size: 20 })] })],
        width: { size: 35, type: WidthType.PERCENTAGE },
      }),
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: value || "—", size: 20 })] })],
        width: { size: 65, type: WidthType.PERCENTAGE },
      }),
    ],
  })

  const emptyRow = (label: string) => new TableRow({
    children: [
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, size: 20 })] })],
        width: { size: 35, type: WidthType.PERCENTAGE },
      }),
      new TableCell({
        children: [
          new Paragraph({ text: "" }),
          new Paragraph({ text: "" }),
          new Paragraph({ text: "" }),
        ],
        width: { size: 65, type: WidthType.PERCENTAGE },
      }),
    ],
  })

  const features = (s.features ?? {}) as Record<string, boolean>
  const enabledFeatures = Object.entries(features)
    .filter(([, v]) => v)
    .map(([k]) => k.replace(/_/g, " "))
    .join(", ") || "None selected"

  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({ text: "FLOWA (PTY) LTD", heading: HeadingLevel.TITLE, alignment: AlignmentType.CENTER }),
        new Paragraph({ text: "Scoping Brief — FLW-OPS-003", heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER }),
        new Paragraph({ text: "" }),

        new Paragraph({ text: "SECTION A — CLIENT & CONTACT", heading: HeadingLevel.HEADING_2 }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            row("Legal Entity Name", s.company_legal_name ?? ""),
            row("Trading Name", s.company_trading_name ?? ""),
            row("Contact Person", `${s.first_name ?? ""} ${s.last_name ?? ""}`.trim()),
            row("Role / Title", s.role_title ?? ""),
            row("Email", s.work_email ?? ""),
            row("Mobile", s.mobile_e164 ?? ""),
            row("Website", s.company_website ?? ""),
            row("Industry", s.industry ?? ""),
            row("Employees", s.employee_band ?? ""),
          ],
        }),
        new Paragraph({ text: "" }),

        new Paragraph({ text: "SECTION B — SCOPING DETAILS", heading: HeadingLevel.HEADING_2 }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            row("Features Required", enabledFeatures),
            row("Monthly Volume", s.monthly_conversation_band ?? ""),
            row("User Seats", String(s.user_seats_needed ?? "")),
            row("Timeline", s.timeline ?? ""),
            row("Budget Band", s.budget_band ?? ""),
            row("Recommended Tier", s.recommended_tier ?? ""),
            row("Notes", s.notes ?? ""),
          ],
        }),
        new Paragraph({ text: "" }),

        new Paragraph({ text: "SECTION C — DISCOVERY CALL NOTES", heading: HeadingLevel.HEADING_2 }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            emptyRow("Objectives"),
            emptyRow("Current challenges"),
            emptyRow("Integrations required"),
            emptyRow("Success metrics"),
            emptyRow("Agreed next step"),
          ],
        }),
        new Paragraph({ text: "" }),

        new Paragraph({ text: "SECTION D — SIGNATURES", heading: HeadingLevel.HEADING_2 }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            row("Client Signature", ""),
            row("Date", ""),
            row("Flowa Representative", ""),
            row("Date", ""),
          ],
        }),
        new Paragraph({ text: "" }),
        new Paragraph({
          children: [new TextRun({
            text: `Generated: ${new Date().toLocaleDateString("en-ZA")} | POPIA: Consent recorded ${s.popia_consent_at ? new Date(s.popia_consent_at).toLocaleDateString("en-ZA") : "—"}`,
            size: 16,
            color: "999999",
          })],
        }),
      ],
    }],
  })

  const buf = await Packer.toBuffer(doc)
  const filename = `Flowa - ${s.company_legal_name ?? id} - Scoping Brief (FLW-OPS-003).docx`
  return new NextResponse(buf as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  })
}
