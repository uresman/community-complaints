'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Complaint, ComplaintStatus } from '@/types'
import { categoryIcons, categoryLabels, statusColors, statusLabels, formatDateTime, priorityColors, priorityLabels } from '@/lib/utils'

const statuses: ComplaintStatus[] = ['pending', 'in_review', 'resolved', 'dismissed']

export default function AdminComplaintCard({ complaint: initial }: { complaint: Complaint }) {
  const router = useRouter()
  const [complaint, setComplaint] = useState(initial)
  const [editNotes, setEditNotes] = useState(false)
  const [notes, setNotes] = useState(complaint.admin_notes || '')
  const [saving, setSaving] = useState(false)
  const [expanded, setExpanded] = useState(false)

  async function updateStatus(status: ComplaintStatus) {
    setSaving(true)
    try {
      const res = await fetch(`/api/complaints/${complaint.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        const updated = await res.json()
        setComplaint(updated)
        router.refresh()
      }
    } finally {
      setSaving(false)
    }
  }

  async function saveNotes() {
    setSaving(true)
    try {
      const res = await fetch(`/api/complaints/${complaint.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_notes: notes }),
      })
      if (res.ok) {
        const updated = await res.json()
        setComplaint(updated)
        setEditNotes(false)
        router.refresh()
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="px-6 py-5">
      {/* Top row */}
      <div className="flex items-start gap-4">
        <div className="text-2xl shrink-0">{categoryIcons[complaint.category]}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <Link
                href={`/complaints/${complaint.id}`}
                className="font-display font-bold text-lg text-ink hover:text-amber transition-colors"
              >
                {complaint.title}
              </Link>
              <div className="flex flex-wrap gap-2 mt-1">
                <span className={`text-xs px-2 py-0.5 border font-mono uppercase ${statusColors[complaint.status]}`}>
                  {statusLabels[complaint.status]}
                </span>
                <span className={`text-xs px-2 py-0.5 font-mono ${priorityColors[complaint.priority]}`}>
                  {priorityLabels[complaint.priority]}
                </span>
                <span className="text-xs font-mono text-ink/40">{complaint.tracking_id}</span>
              </div>
            </div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="shrink-0 text-xs font-mono text-ink/40 hover:text-ink border border-ink/20 px-2 py-1"
            >
              {expanded ? '▲ Hide' : '▼ Manage'}
            </button>
          </div>
          <div className="text-xs font-mono text-ink/40 flex flex-wrap gap-3">
            <span>📍 {complaint.location}</span>
            <span>👤 {complaint.is_anonymous ? 'Anonymous' : complaint.submitter_name}</span>
            <span>📧 {complaint.submitter_email}</span>
            <span>📅 {formatDateTime(complaint.created_at)}</span>
            <span>▲ {complaint.upvotes} votes</span>
          </div>
        </div>
      </div>

      {/* Expanded management */}
      {expanded && (
        <div className="mt-4 ml-10 space-y-4 border-t border-ink/10 pt-4">
          {/* Description */}
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-ink/40 mb-2">Description</div>
            <p className="text-sm font-body text-ink/70 leading-relaxed">{complaint.description}</p>
          </div>

          {/* Change Status */}
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-ink/40 mb-2">Update Status</div>
            <div className="flex flex-wrap gap-2">
              {statuses.map(s => (
                <button
                  key={s}
                  onClick={() => updateStatus(s)}
                  disabled={saving || complaint.status === s}
                  className={`px-3 py-1.5 text-xs font-mono uppercase border transition-all ${
                    complaint.status === s
                      ? statusColors[s] + ' cursor-default'
                      : 'border-ink/30 hover:border-ink text-ink/60 hover:text-ink'
                  } disabled:opacity-50`}
                >
                  {statusLabels[s]}
                </button>
              ))}
            </div>
          </div>

          {/* Admin Notes */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-mono uppercase tracking-widest text-ink/40">Official Response / Admin Notes</div>
              {!editNotes && (
                <button onClick={() => setEditNotes(true)} className="text-xs font-mono text-amber hover:underline">
                  {complaint.admin_notes ? 'Edit' : 'Add'} Notes
                </button>
              )}
            </div>
            {editNotes ? (
              <div className="space-y-2">
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="input-field resize-none text-sm"
                  rows={3}
                  placeholder="Write an official response or internal notes..."
                />
                <div className="flex gap-2">
                  <button onClick={saveNotes} disabled={saving} className="btn-primary text-xs px-4 py-2">
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button onClick={() => { setEditNotes(false); setNotes(complaint.admin_notes || '') }} className="btn-secondary text-xs px-4 py-2">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm font-body text-ink/70 italic">
                {complaint.admin_notes || 'No official response yet.'}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
