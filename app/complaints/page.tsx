import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Complaint, ComplaintCategory, ComplaintStatus } from '@/types'
import { categoryLabels, categoryIcons, statusColors, statusLabels, formatDate, priorityColors, priorityLabels } from '@/lib/utils'
import Navbar from '@/components/Navbar'

interface SearchParams {
  category?: ComplaintCategory
  status?: ComplaintStatus
  search?: string
  sort?: string
}

async function getComplaints(params: SearchParams): Promise<Complaint[]> {
  const supabase = await createClient()
  let query = supabase.from('complaints').select('*')

  if (params.category) query = query.eq('category', params.category)
  if (params.status) query = query.eq('status', params.status)
  if (params.search) query = query.ilike('title', `%${params.search}%`)

  if (params.sort === 'upvotes') {
    query = query.order('upvotes', { ascending: false })
  } else if (params.sort === 'oldest') {
    query = query.order('created_at', { ascending: true })
  } else {
    query = query.order('created_at', { ascending: false })
  }

  const { data } = await query.limit(50)
  return data || []
}

export default async function ComplaintsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const complaints = await getComplaints(params)

  const categories: ComplaintCategory[] = ['infrastructure', 'noise', 'safety', 'sanitation', 'environment', 'other']
  const statuses: ComplaintStatus[] = ['pending', 'in_review', 'resolved', 'dismissed']

  return (
    <div className="min-h-screen bg-paper paper-texture">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-10">
          <div className="flex items-baseline justify-between mb-2">
            <h1 className="font-display text-4xl font-bold text-ink">Community Complaints</h1>
            <Link href="/complaints/new" className="btn-primary text-sm px-4 py-2">
              + File New
            </Link>
          </div>
          <p className="text-ink/60 font-body">{complaints.length} issue{complaints.length !== 1 ? 's' : ''} found</p>
        </div>

        {/* Filters */}
        <form className="card-paper p-5 mb-8 flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-48">
            <label className="block text-xs font-mono uppercase tracking-widest text-ink/50 mb-2">Search</label>
            <input
              name="search"
              type="text"
              defaultValue={params.search}
              placeholder="Search complaints..."
              className="input-field text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-ink/50 mb-2">Category</label>
            <select name="category" defaultValue={params.category || ''} className="input-field text-sm pr-8">
              <option value="">All Categories</option>
              {categories.map(c => (
                <option key={c} value={c}>{categoryIcons[c]} {categoryLabels[c]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-ink/50 mb-2">Status</label>
            <select name="status" defaultValue={params.status || ''} className="input-field text-sm pr-8">
              <option value="">All Statuses</option>
              {statuses.map(s => (
                <option key={s} value={s}>{statusLabels[s]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-ink/50 mb-2">Sort By</label>
            <select name="sort" defaultValue={params.sort || 'newest'} className="input-field text-sm pr-8">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="upvotes">Most Upvoted</option>
            </select>
          </div>
          <button type="submit" className="btn-primary text-sm px-5 py-3">
            Filter
          </button>
          {(params.category || params.status || params.search) && (
            <Link href="/complaints" className="btn-secondary text-sm px-5 py-3">
              Clear
            </Link>
          )}
        </form>

        {/* Results */}
        {complaints.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-ink/20">
            <div className="text-4xl mb-4">🔍</div>
            <p className="font-display text-xl text-ink/60">No complaints found</p>
            <p className="text-ink/40 mt-2">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="space-y-4">
            {complaints.map((complaint) => (
              <Link
                key={complaint.id}
                href={`/complaints/${complaint.id}`}
                className="card-paper p-5 flex gap-5 group hover:border-amber/40 transition-colors block"
              >
                <div className="text-3xl shrink-0">{categoryIcons[complaint.category]}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h2 className="font-display font-bold text-lg text-ink group-hover:text-amber transition-colors truncate">
                      {complaint.title}
                    </h2>
                    <span className={`shrink-0 text-xs px-2 py-0.5 border font-mono uppercase ${statusColors[complaint.status]}`}>
                      {statusLabels[complaint.status]}
                    </span>
                    <span className={`shrink-0 text-xs px-2 py-0.5 font-mono ${priorityColors[complaint.priority]}`}>
                      {priorityLabels[complaint.priority]}
                    </span>
                  </div>
                  <p className="text-ink/60 text-sm line-clamp-2 mb-3 font-body">{complaint.description}</p>
                  <div className="flex flex-wrap gap-4 text-xs font-mono text-ink/40">
                    <span>📍 {complaint.location}</span>
                    <span>🏷 {categoryLabels[complaint.category]}</span>
                    <span>📅 {formatDate(complaint.created_at)}</span>
                    <span>▲ {complaint.upvotes} votes</span>
                    <span className="font-mono text-ink/30">{complaint.tracking_id}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
