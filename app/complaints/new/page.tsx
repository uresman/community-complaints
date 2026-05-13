'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { ComplaintCategory, ComplaintPriority } from '@/types'
import { categoryLabels, categoryIcons, priorityLabels } from '@/lib/utils'

const categories: ComplaintCategory[] = ['infrastructure', 'noise', 'safety', 'sanitation', 'environment', 'other']
const priorities: ComplaintPriority[] = ['low', 'medium', 'high', 'urgent']

interface FormData {
  title: string
  description: string
  category: ComplaintCategory | ''
  priority: ComplaintPriority
  location: string
  submitter_name: string
  submitter_email: string
  is_anonymous: boolean
}

export default function NewComplaintPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<FormData>({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    location: '',
    submitter_name: '',
    submitter_email: '',
    is_anonymous: false,
  })

  function update(key: keyof FormData, value: string | boolean) {
    setForm(prev => ({ ...prev, [key]: value }))
    setError('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!form.category) { setError('Please select a category.'); return }
    if (form.title.length < 5) { setError('Title must be at least 5 characters.'); return }
    if (form.description.length < 20) { setError('Description must be at least 20 characters.'); return }

    setLoading(true)
    try {
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to submit')
      router.push(`/complaints/${data.id}?submitted=true`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-paper paper-texture">
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="inline-block stamp-border border-rust text-rust px-3 py-1 text-xs font-mono uppercase tracking-widest mb-4">
            New Report
          </div>
          <h1 className="font-display text-4xl font-bold text-ink mb-2">File a Complaint</h1>
          <p className="text-ink/60 font-body">
            Report an issue affecting your community. Provide as much detail as possible 
            to help authorities respond effectively.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-ink/60 mb-3">
              Category *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {categories.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => update('category', cat)}
                  className={`p-3 border-2 text-left transition-all duration-150 ${
                    form.category === cat
                      ? 'border-ink bg-ink text-paper shadow-none translate-x-0.5 translate-y-0.5'
                      : 'border-ink/30 bg-paper hover:border-ink/60'
                  }`}
                >
                  <div className="text-xl mb-1">{categoryIcons[cat]}</div>
                  <div className="font-mono text-xs uppercase tracking-wide">{categoryLabels[cat]}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-ink/60 mb-2">
              Complaint Title *
            </label>
            <input
              type="text"
              value={form.title}
              onChange={e => update('title', e.target.value)}
              placeholder="Brief, descriptive title of the issue"
              className="input-field"
              required
              minLength={5}
              maxLength={200}
            />
            <div className="text-xs font-mono text-ink/30 mt-1 text-right">{form.title.length}/200</div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-ink/60 mb-2">
              Detailed Description *
            </label>
            <textarea
              value={form.description}
              onChange={e => update('description', e.target.value)}
              placeholder="Describe the issue in detail. When did it start? What is the impact? Any relevant history?"
              className="input-field resize-none"
              rows={5}
              required
              minLength={20}
            />
            <div className="text-xs font-mono text-ink/30 mt-1 text-right">{form.description.length} chars (min 20)</div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-ink/60 mb-2">
              Location / Address *
            </label>
            <input
              type="text"
              value={form.location}
              onChange={e => update('location', e.target.value)}
              placeholder="Street address, intersection, or landmark"
              className="input-field"
              required
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-ink/60 mb-3">
              Priority Level *
            </label>
            <div className="flex gap-3 flex-wrap">
              {priorities.map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => update('priority', p)}
                  className={`px-4 py-2 border-2 font-mono text-sm uppercase tracking-wide transition-all ${
                    form.priority === p
                      ? 'border-ink bg-ink text-paper'
                      : 'border-ink/30 hover:border-ink/60'
                  }`}
                >
                  {priorityLabels[p]}
                </button>
              ))}
            </div>
          </div>

          <hr className="section-divider border-ink/20" />

          {/* Contact Info */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-ink/60 mb-2">
              Your Name *
            </label>
            <input
              type="text"
              value={form.is_anonymous ? 'Anonymous' : form.submitter_name}
              onChange={e => update('submitter_name', e.target.value)}
              placeholder="Full name"
              className="input-field"
              required={!form.is_anonymous}
              disabled={form.is_anonymous}
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-ink/60 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              value={form.submitter_email}
              onChange={e => update('submitter_email', e.target.value)}
              placeholder="your@email.com (for tracking updates)"
              className="input-field"
              required
            />
            <p className="text-xs font-mono text-ink/40 mt-1">
              Used to track your complaint. Never shared publicly.
            </p>
          </div>

          {/* Anonymous toggle */}
          <div className="flex items-center gap-3 p-4 border border-ink/20 bg-cream">
            <button
              type="button"
              onClick={() => {
                update('is_anonymous', !form.is_anonymous)
                if (!form.is_anonymous) update('submitter_name', 'Anonymous')
              }}
              className={`w-12 h-6 relative transition-colors ${form.is_anonymous ? 'bg-ink' : 'bg-ink/20'}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 bg-paper transition-transform ${form.is_anonymous ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
            <div>
              <div className="font-mono text-sm font-bold">Submit Anonymously</div>
              <div className="text-xs text-ink/50">Your name will be hidden from the public feed</div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="border-2 border-rust text-rust px-4 py-3 font-mono text-sm">
              ⚠ {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full text-center text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
          >
            {loading ? 'Submitting...' : 'Submit Complaint →'}
          </button>

          <p className="text-center text-xs font-mono text-ink/40">
            By submitting, you confirm this is a genuine community concern.
            False reports may be subject to review.
          </p>
        </form>
      </div>
    </div>
  )
}
