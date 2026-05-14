import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { ComplaintInsert } from '@/types'
import { generateTrackingId } from '@/lib/utils'

export async function GET(req: NextRequest) {
  const supabase = createAdminClient()

  const { searchParams } = new URL(req.url)

  const status = searchParams.get('status')
  const category = searchParams.get('category')

  let query = supabase
    .from('complaints')
    .select('*')
    .order('created_at', { ascending: false })

  if (status) query = query.eq('status', status)
  if (category) query = query.eq('category', category)

  const { data, error } = await query.limit(100)

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  try {
    const body =
      (await req.json()) as ComplaintInsert & {
        category: string
      }

    // Validation
    if (!body.title || body.title.length < 5) {
      return NextResponse.json(
        {
          error: 'Title must be at least 5 characters',
        },
        { status: 400 }
      )
    }

    if (
      !body.description ||
      body.description.length < 20
    ) {
      return NextResponse.json(
        {
          error:
            'Description must be at least 20 characters',
        },
        { status: 400 }
      )
    }

    if (!body.category) {
      return NextResponse.json(
        { error: 'Category is required' },
        { status: 400 }
      )
    }

    if (!body.location) {
      return NextResponse.json(
        { error: 'Location is required' },
        { status: 400 }
      )
    }

    if (
      !body.submitter_email ||
      !body.submitter_email.includes('@')
    ) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      )
    }

    const validCategories = [
      'infrastructure',
      'noise',
      'safety',
      'sanitation',
      'environment',
      'other',
    ]

    if (!validCategories.includes(body.category)) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    const tracking_id = generateTrackingId()

    const { data, error } = await supabase
      .from('complaints')
      .insert(
        [
          {
            title: body.title.trim(),
            description: body.description.trim(),
            category: body.category,
            priority: body.priority || 'medium',
            location: body.location.trim(),
            submitter_name: body.is_anonymous
              ? 'Anonymous'
              : (body.submitter_name || '').trim(),
            submitter_email:
              body.submitter_email
                .trim()
                .toLowerCase(),
            is_anonymous:
              body.is_anonymous || false,
            tracking_id,
            status: 'pending',
            upvotes: 0,
          },
        ] as never
      )
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data, {
      status: 201,
    })
  } catch (err: unknown) {
    console.error(
      'POST /api/complaints error:',
      err
    )

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : 'Failed to submit complaint',
      },
      { status: 500 }
    )
  }
}