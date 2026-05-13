import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Complaint } from '@/types'
import { categoryLabels, categoryIcons, statusColors, statusLabels, formatDate, priorityColors, priorityLabels } from '@/lib/utils'
import Navbar from '@/components/Navbar'
import StatsBar from '@/components/StatsBar'

async function getRecentComplaints(): Promise<Complaint[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('complaints')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(6)
  return data || []
}

async function getStats() {
  const supabase = await createClient()
  const { data } = await supabase.from('complaints').select('status, category')
  if (!data) return { total: 0, pending: 0, in_review: 0, resolved: 0 }
  return {
    total: data.length,
    pending: data.filter(d => d.status === 'pending').length,
    in_review: data.filter(d => d.status === 'in_review').length,
    resolved: data.filter(d => d.status === 'resolved').length,
  }
}

export default async function HomePage() {
  const [complaints, stats] = await Promise.all([getRecentComplaints(), getStats()])

  return (
    <div className="min-h-screen bg-paper paper-texture">
      <Navbar />

      {/* Hero */}
      <section className="border-b-2 border-ink px-6 py-16 md:py-24 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <div className="inline-block stamp-border border-rust text-rust px-3 py-1 text-xs font-mono uppercase tracking-widest mb-6">
              Community Platform
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight text-ink mb-6">
              Your Voice.<br />
              <span className="text-amber italic">Their Action.</span>
            </h1>
            <p className="font-body text-lg text-ink/70 leading-relaxed mb-8 max-w-md">
              Report community issues, track progress, and hold local authorities accountable. 
              Every complaint is recorded. Every concern deserves attention.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/complaints/new" className="btn-primary">
                File a Complaint →
              </Link>
              <Link href="/complaints" className="btn-secondary">
                Browse Issues
              </Link>
            </div>
          </div>

          {/* Decorative bulletin board */}
          <div className="hidden md:block relative">
            <div className="bg-amber/10 border-2 border-amber/30 p-6 rotate-1 shadow-lg">
              <div className="text-xs font-mono text-ink/50 uppercase tracking-widest mb-4 border-b border-ink/20 pb-2">
                Community Board — Latest
              </div>
              {complaints.slice(0, 3).map((c, i) => (
                <div key={c.id} className={`mb-3 p-3 bg-paper border border-ink/20 ${i === 1 ? '-rotate-1' : i === 2 ? 'rotate-1' : ''} shadow-sm`}>
                  <div className="text-xs font-mono text-ink/40 mb-1">{categoryIcons[c.category]} {categoryLabels[c.category]}</div>
                  <div className="font-display text-sm font-bold text-ink line-clamp-1">{c.title}</div>
                  <div className="text-xs text-ink/50 mt-1">{c.location}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <StatsBar stats={stats} />

      {/* Recent Complaints */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-baseline justify-between mb-10">
          <div>
            <h2 className="font-display text-3xl font-bold text-ink">Recent Complaints</h2>
            <p className="text-ink/60 mt-1 font-body">Latest issues submitted by the community</p>
          </div>
          <Link href="/complaints" className="text-amber font-display font-bold hover:underline">
            View all →
          </Link>
        </div>

        {complaints.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-ink/20">
            <div className="text-4xl mb-4">📋</div>
            <p className="font-display text-xl text-ink/60">No complaints yet</p>
            <p className="text-ink/40 mt-2">Be the first to report a community issue</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {complaints.map((complaint, i) => (
              <Link
                key={complaint.id}
                href={`/complaints/${complaint.id}`}
                className="card-paper p-5 block hover:translate-y-[-2px] transition-transform duration-150 group"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl">{categoryIcons[complaint.category]}</span>
                  <span className={`text-xs px-2 py-1 border font-mono uppercase tracking-wide ${statusColors[complaint.status]}`}>
                    {statusLabels[complaint.status]}
                  </span>
                </div>
                <h3 className="font-display font-bold text-ink text-lg mb-2 line-clamp-2 group-hover:text-amber transition-colors">
                  {complaint.title}
                </h3>
                <p className="text-ink/60 text-sm line-clamp-2 mb-4 font-body leading-relaxed">
                  {complaint.description}
                </p>
                <div className="border-t border-ink/10 pt-3 flex items-center justify-between">
                  <div className="text-xs text-ink/40 font-mono">
                    📍 {complaint.location}
                  </div>
                  <div className={`text-xs px-2 py-0.5 font-mono ${priorityColors[complaint.priority]}`}>
                    {priorityLabels[complaint.priority]}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-ink/40 font-mono">{formatDate(complaint.created_at)}</span>
                  <span className="text-xs text-ink/40 font-mono">▲ {complaint.upvotes}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="border-t-2 border-ink bg-ink text-paper py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-4xl font-bold mb-4">
            See a problem in your community?
          </h2>
          <p className="text-paper/70 mb-8 font-body text-lg">
            Don't wait for someone else to act. File a complaint today and 
            track its resolution every step of the way.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/complaints/new" className="bg-amber text-ink px-8 py-4 font-display font-bold text-lg border-2 border-amber hover:bg-amber/90 transition-colors">
              File a Complaint
            </Link>
            <Link href="/track" className="bg-transparent text-paper px-8 py-4 font-display font-bold text-lg border-2 border-paper/50 hover:border-paper transition-colors">
              Track My Complaint
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-ink/10 px-6 py-8 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-ink/40 text-sm font-mono">
          <div>CivicVoice © {new Date().getFullYear()} — Community Complaint System</div>
          <div className="flex gap-6">
            <Link href="/track" className="hover:text-ink transition-colors">Track Complaint</Link>
            <Link href="/admin" className="hover:text-ink transition-colors">Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
