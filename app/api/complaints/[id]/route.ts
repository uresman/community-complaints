import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { ComplaintStatus, Complaint } from '@/types'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('complaints')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    return NextResponse.json(
      { error: 'Not found' },
      { status: 404 }
    )
  }

  return NextResponse.json(data)
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json()

  const allowedFields = [
    'status',
    'priority',
    'admin_notes',
  ]

  const updateData: Partial<Complaint> = {}

  for (const field of allowedFields) {
    if (field in body) {
      ;(updateData as any)[field] = body[field]
    }
  }

  if (body.status === 'resolved') {
    updateData.resolved_at = new Date().toISOString()
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json(
      { error: 'No valid fields to update' },
      { status: 400 }
    )
  }

  const validStatuses: ComplaintStatus[] = [
    'pending',
    'in_review',
    'resolved',
    'dismissed',
  ]

  if (
    updateData.status &&
    !validStatuses.includes(updateData.status)
  ) {
    return NextResponse.json(
      { error: 'Invalid status' },
      { status: 400 }
    )
  }

  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('complaints')
    .update(updateData as never)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json(data)
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const supabase = createAdminClient()

  const { error } = await supabase
    .from('complaints')
    .delete()
    .eq('id', id)

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true })
}