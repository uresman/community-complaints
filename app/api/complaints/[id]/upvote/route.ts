import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const headersList = await headers()

  // Create a fingerprint from IP + user agent
  const ip =
    headersList.get('x-forwarded-for') ||
    headersList.get('x-real-ip') ||
    'unknown'

  const ua = headersList.get('user-agent') || 'unknown'

  const fingerprint = Buffer.from(
    `${ip}-${ua}-${id}`
  )
    .toString('base64')
    .slice(0, 64)

  const supabase = createAdminClient()

  // Check if already voted
  const { data: existing } = await supabase
    .from('complaint_upvotes')
    .select('id')
    .eq('complaint_id', id)
    .eq('voter_fingerprint', fingerprint)
    .single()

  if (existing) {
    return NextResponse.json(
      { error: 'Already voted' },
      { status: 409 }
    )
  }

  // Record vote
  const { error: voteError } = await supabase
    .from('complaint_upvotes')
    .insert(
      [
        {
          complaint_id: id,
          voter_fingerprint: fingerprint,
        },
      ] as never
    )

  if (voteError) {
    return NextResponse.json(
      { error: 'Failed to record vote' },
      { status: 500 }
    )
  }

  // Increment upvote count
 const { error } = await (supabase.rpc as any)(
  'increment_upvotes',
  {
    complaint_id: id,
  }
)

  // Fallback if RPC doesn't exist
  if (error) {
    const { data: current } = await supabase
      .from('complaints')
      .select('upvotes')
      .eq('id', id)
      .single()

    await supabase
  .from('complaints')
  .update({
    upvotes: ((current as any)?.upvotes || 0) + 1,
  } as never)
  .eq('id', id)
  }

  return NextResponse.json({ success: true })
}