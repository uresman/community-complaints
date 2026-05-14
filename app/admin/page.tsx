export const dynamic = 'force-dynamic'

import { createAdminClient } from '@/lib/supabase/server'
import { Complaint } from '@/types'
import Navbar from '@/components/Navbar'
import AdminComplaintCard from '@/components/AdminComplaintCard'
import LogoutButton from '@/components/LogoutButton'
import AdminAutoRefresh from '@/components/AdminAutoRefresh'
import Link from 'next/link'

async function getAdminData() {
  const supabase = createAdminClient()

  const { data: complaints } = await supabase
    .from('complaints')
    .select('*')
    .order('created_at', { ascending: false })

  const all: Complaint[] = complaints || []

  return {
    complaints: all,
    stats: {
      total: all.length,

      pending: all.filter(
        (c: Complaint) => c.status === 'pending'
      ).length,

      in_review: all.filter(
        (c: Complaint) => c.status === 'in_review'
      ).length,

      resolved: all.filter(
        (c: Complaint) => c.status === 'resolved'
      ).length,

      dismissed: all.filter(
        (c: Complaint) => c.status === 'dismissed'
      ).length,
    },
  }
}

export default async function AdminPage() {
  const { complaints, stats } = await getAdminData()

  return (
    <div className="min-h-screen bg-paper paper-texture">
      <AdminAutoRefresh />

      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-10 flex items-baseline justify-between">
          <div>
            <div className="inline-block stamp-border border-rust text-rust px-3 py-1 text-xs font-mono uppercase tracking-widest mb-3">
              Admin Panel
            </div>

            <h1 className="font-display text-4xl font-bold text-ink">
              Complaints Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <LogoutButton />

            <Link
              href="/"
              className="font-mono text-sm text-ink/50 hover:text-ink"
            >
              ← Public View
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          {[
            {
              label: 'Total',
              value: stats.total,
              color: 'bg-ink text-paper',
            },

            {
              label: 'Pending',
              value: stats.pending,
              color: 'bg-amber text-ink',
            },

            {
              label: 'In Review',
              value: stats.in_review,
              color: 'bg-slate text-paper',
            },

            {
              label: 'Resolved',
              value: stats.resolved,
              color: 'bg-sage text-paper',
            },

            {
              label: 'Dismissed',
              value: stats.dismissed,
              color: 'bg-mist text-ink',
            },
          ].map((s) => (
            <div
              key={s.label}
              className={`p-5 text-center ${s.color} border-2 border-ink/10`}
            >
              <div className="font-display text-4xl font-bold">
                {s.value}
              </div>

              <div className="font-mono text-xs uppercase tracking-widest opacity-70 mt-1">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Complaints Table */}
        <div className="card-paper overflow-hidden">
          <div className="px-6 py-4 border-b border-ink/10 flex items-center justify-between">
            <h2 className="font-display text-xl font-bold">
              All Complaints
            </h2>

            <span className="font-mono text-sm text-ink/50">
              {complaints.length} records
            </span>
          </div>

          {complaints.length === 0 ? (
            <div className="text-center py-20 text-ink/40 font-mono">
              No complaints yet
            </div>
          ) : (
            <div className="divide-y divide-ink/10">
              {complaints.map((complaint: Complaint) => (
                <AdminComplaintCard
                  key={complaint.id}
                  complaint={complaint}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}