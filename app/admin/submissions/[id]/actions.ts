"use server"
import { createServiceClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export async function updateStatus(submissionId: string, status: string) {
  const db = createServiceClient()
  await db.from("submissions").update({ status, updated_at: new Date().toISOString() }).eq("id", submissionId)
  revalidatePath(`/admin/submissions/${submissionId}`)
}

export async function updateNotes(submissionId: string, notes: string) {
  const db = createServiceClient()
  await db.from("submissions").update({ notes, updated_at: new Date().toISOString() }).eq("id", submissionId)
  revalidatePath(`/admin/submissions/${submissionId}`)
}

export async function markAttended(submissionId: string) {
  const db = createServiceClient()
  await db.from("submissions").update({ demo_status: "attended", status: "demo_done", updated_at: new Date().toISOString() }).eq("id", submissionId)
  revalidatePath(`/admin/submissions/${submissionId}`)
}

export async function markNoShow(submissionId: string) {
  const db = createServiceClient()
  await db.from("submissions").update({ demo_status: "no_show", updated_at: new Date().toISOString() }).eq("id", submissionId)
  revalidatePath(`/admin/submissions/${submissionId}`)
}
