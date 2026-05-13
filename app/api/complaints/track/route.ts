import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const tracking_id = searchParams.get('tracking_id')?.toUpperCase()
  const email = searchParams.get('email')?.toLowerCase()

  if (!tracking_id || !email) {
    return NextResponse.json({ error: 'Tracking ID and email are required' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('complaints')
    .select('*')
    .eq('tracking_id', tracking_id)
    .eq('submitter_email', email)
    .single()

  if (error || !data) {
    return NextResponse.json(
      { error: 'No complaint found with that tracking ID and email combination' },
      { status: 404 }
    )
  }

  return NextResponse.json(data)
}
