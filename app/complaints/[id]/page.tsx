import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Complaint } from '@/types'
import { categoryLabels, categoryIcons, statusColors, statusLabels, formatDateTime, priorityColors, priorityLabels } from '@/lib/utils'
import Navbar from '@/components/Navbar'
import UpvoteButton from '@/components/UpvoteButton'

async function getComplaint(id: string): Promise<Complaint | null> {
  const supabase = await createClient()
  const { data } = await supabase.from('complaints').select('*').eq('id', id).single()
  return data
}

export default async function ComplaintDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ submitted?: string }>
}) {
  const { id } = await params
  const { submitted } = await searchParams
  const complaint = await getComplaint(id)

  if (!complaint) notFound()

  const statusStep: Record<string, number> = {
    pending: 0, in_review: 1, resolved: 2, dismissed: 2
  }
  const currentStep = statusStep[complaint.status]

  return (
    <div className="min-h-screen bg-paper paper-texture">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Success banner */}
        {submitted && (
          <div className="border-2 border-sage bg-sage/10 px-6 py-4 mb-8 flex items-center gap-3 animate-slide-up">
            <span className="text-2xl">✅</span>
            <div>
              <div className="font-display font-bold text-sage">Complaint Submitted Successfully!</div>
              <div className="font-mono text-sm text-sage/80">
                Your tracking ID is <strong>{complaint.tracking_id}</strong>. Save it to check status later.
              </div>
            </div>
          </div>
        )}

        {/* Back */}
        <Link href="/complaints" className="inline-flex items-center gap-2 text-ink/50 hover:text-ink font-mono text-sm mb-8 transition-colors">
          ← Back to Complaints
        </Link>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Header */}
            <div className="card-paper p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="text-4xl">{categoryIcons[complaint.category]}</div>
                <div className="flex flex-wrap gap-2">
                  <span className={`text-xs px-3 py-1 border font-mono uppercase tracking-wide ${statusColors[complaint.status]}`}>
                    {statusLabels[complaint.status]}
                  </span>
                  <span className={`text-xs px-3 py-1 font-mono ${priorityColors[complaint.priority]}`}>
                    {priorityLabels[complaint.priority]} Priority
                  </span>
                </div>
              </div>

              <h1 className="font-display text-3xl font-bold text-ink mb-3">{complaint.title}</h1>

              <div className="flex flex-wrap gap-4 text-xs font-mono text-ink/50 border-t border-ink/10 pt-4">
                <span>🏷 {categoryLabels[complaint.category]}</span>
                <span>📍 {complaint.location}</span>
                <span>📅 {formatDateTime(complaint.created_at)}</span>
                <span>🆔 {complaint.tracking_id}</span>
              </div>
            </div>

            {/* Description */}
            <div className="card-paper p-6">
              <h2 className="font-display font-bold text-lg mb-4 border-b border-ink/10 pb-3">Description</h2>
              <p className="font-body text-ink/80 leading-relaxed whitespace-pre-wrap">{complaint.description}</p>
            </div>

            {/* Admin Notes */}
            {complaint.admin_notes && (
              <div className="card-paper p-6 border-l-4 border-slate">
                <h2 className="font-display font-bold text-lg mb-3 text-slate">Official Response</h2>
                <p className="font-body text-ink/80 leading-relaxed whitespace-pre-wrap">{complaint.admin_notes}</p>
                {complaint.resolved_at && (
                  <div className="mt-3 text-xs font-mono text-ink/40">
                    Resolved on {formatDateTime(complaint.resolved_at)}
                  </div>
                )}
              </div>
            )}

            {/* Status Timeline */}
            <div className="card-paper p-6">
              <h2 className="font-display font-bold text-lg mb-6">Progress</h2>
              <div className="relative">
                {/* Line */}
                <div className="absolute top-4 left-4 right-4 h-0.5 bg-ink/10" />
                <div
                  className="absolute top-4 left-4 h-0.5 bg-ink transition-all duration-500"
                  style={{ width: complaint.status === 'dismissed' ? '100%' : `${currentStep * 50}%` }}
                />
                <div className="relative flex justify-between">
                  {['Submitted', 'Under Review', complaint.status === 'dismissed' ? 'Dismissed' : 'Resolved'].map((label, i) => (
                    <div key={i} className="flex flex-col items-center gap-2">
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-mono z-10 ${
                        i <= currentStep ? 'bg-ink border-ink text-paper' : 'bg-paper border-ink/30 text-ink/30'
                      }`}>
                        {i <= currentStep ? '✓' : i + 1}
                      </div>
                      <span className={`text-xs font-mono uppercase tracking-wide text-center ${i <= currentStep ? 'text-ink' : 'text-ink/30'}`}>
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Upvote */}
            <div className="card-paper p-5 text-center">
              <div className="font-mono text-xs uppercase tracking-widest text-ink/50 mb-3">Community Support</div>
              <UpvoteButton complaintId={complaint.id} initialUpvotes={complaint.upvotes} />
              <div className="text-xs font-mono text-ink/40 mt-3">
                {complaint.upvotes} community member{complaint.upvotes !== 1 ? 's' : ''} support this
              </div>
            </div>

            {/* Submitter Info */}
            <div className="card-paper p-5">
              <div className="font-mono text-xs uppercase tracking-widest text-ink/50 mb-3">Filed By</div>
              <div className="font-display font-bold text-ink">
                {complaint.is_anonymous ? 'Anonymous Resident' : complaint.submitter_name}
              </div>
              <div className="text-xs font-mono text-ink/40 mt-1">{formatDateTime(complaint.created_at)}</div>
            </div>

            {/* Tracking ID */}
            <div className="card-paper p-5 bg-ink text-paper">
              <div className="font-mono text-xs uppercase tracking-widest text-paper/50 mb-2">Tracking ID</div>
              <div className="font-mono text-xl font-bold text-amber">{complaint.tracking_id}</div>
              <div className="text-xs text-paper/40 mt-2">Use this ID to track your complaint status</div>
            </div>

            {/* Share */}
            <div className="card-paper p-5">
              <div className="font-mono text-xs uppercase tracking-widest text-ink/50 mb-3">Actions</div>
              <Link href="/track" className="block text-sm font-mono text-amber hover:underline mb-2">
                → Track another complaint
              </Link>
              <Link href="/complaints/new" className="block text-sm font-mono text-amber hover:underline">
                → File a new complaint
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
