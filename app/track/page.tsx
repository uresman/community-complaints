'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { Complaint } from '@/types'
import { statusColors, statusLabels, categoryLabels, categoryIcons, formatDateTime, priorityLabels, priorityColors } from '@/lib/utils'

export default function TrackPage() {
  const [trackingId, setTrackingId] = useState('')
  const [email, setEmail] = useState('')
  const [complaint, setComplaint] = useState<Complaint | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleTrack(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setComplaint(null)
    setLoading(true)

    try {
      const params = new URLSearchParams({ tracking_id: trackingId, email })
      const res = await fetch(`/api/complaints/track?${params}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Not found')
      setComplaint(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Complaint not found')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-paper paper-texture">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="mb-10 text-center">
          <div className="inline-block stamp-border border-amber text-amber px-3 py-1 text-xs font-mono uppercase tracking-widest mb-4">
            Complaint Tracker
          </div>
          <h1 className="font-display text-4xl font-bold text-ink mb-3">Track Your Complaint</h1>
          <p className="text-ink/60 font-body">
            Enter your tracking ID and email address to view the current status of your complaint.
          </p>
        </div>

        <form onSubmit={handleTrack} className="card-paper p-8 space-y-5">
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-ink/60 mb-2">
              Tracking ID *
            </label>
            <input
              type="text"
              value={trackingId}
              onChange={e => setTrackingId(e.target.value.toUpperCase())}
              placeholder="CC-XXXXXXXX"
              className="input-field font-mono"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-ink/60 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="The email used when filing"
              className="input-field"
              required
            />
          </div>

          {error && (
            <div className="border-2 border-rust text-rust px-4 py-3 font-mono text-sm">
              ⚠ {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-lg">
            {loading ? 'Searching...' : 'Track Complaint →'}
          </button>
        </form>

        {/* Result */}
        {complaint && (
          <div className="mt-8 card-paper p-6 animate-slide-up">
            <div className="flex items-start gap-4 mb-5">
              <div className="text-4xl">{categoryIcons[complaint.category]}</div>
              <div className="flex-1">
                <h2 className="font-display text-2xl font-bold text-ink mb-2">{complaint.title}</h2>
                <div className="flex flex-wrap gap-2">
                  <span className={`text-xs px-2 py-1 border font-mono uppercase ${statusColors[complaint.status]}`}>
                    {statusLabels[complaint.status]}
                  </span>
                  <span className={`text-xs px-2 py-1 font-mono ${priorityColors[complaint.priority]}`}>
                    {priorityLabels[complaint.priority]}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-sm font-mono border-t border-ink/10 pt-4">
              <div className="flex justify-between">
                <span className="text-ink/50">Category</span>
                <span>{categoryLabels[complaint.category]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink/50">Location</span>
                <span>{complaint.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink/50">Submitted</span>
                <span>{formatDateTime(complaint.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink/50">Last Updated</span>
                <span>{formatDateTime(complaint.updated_at)}</span>
              </div>
              {complaint.resolved_at && (
                <div className="flex justify-between">
                  <span className="text-ink/50">Resolved On</span>
                  <span>{formatDateTime(complaint.resolved_at)}</span>
                </div>
              )}
            </div>

            {complaint.admin_notes && (
              <div className="mt-4 p-4 bg-slate/10 border-l-4 border-slate">
                <div className="font-mono text-xs uppercase tracking-widest text-slate mb-2">Official Response</div>
                <p className="font-body text-sm text-ink/80">{complaint.admin_notes}</p>
              </div>
            )}

            <div className="mt-4 text-center">
              <Link href={`/complaints/${complaint.id}`} className="font-mono text-sm text-amber hover:underline">
                View full complaint →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
