'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface UpvoteButtonProps {
  complaintId: string
  initialUpvotes: number
}

export default function UpvoteButton({ complaintId, initialUpvotes }: UpvoteButtonProps) {
  const [upvotes, setUpvotes] = useState(initialUpvotes)
  const [voted, setVoted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleUpvote() {
    if (voted || loading) return
    setLoading(true)
    try {
      const res = await fetch(`/api/complaints/${complaintId}/upvote`, { method: 'POST' })
      if (res.ok) {
        setUpvotes(prev => prev + 1)
        setVoted(true)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleUpvote}
      disabled={voted || loading}
      className={`w-full py-4 border-2 font-display font-bold text-2xl transition-all duration-150 ${
        voted
          ? 'border-sage bg-sage/10 text-sage cursor-default'
          : 'border-ink hover:bg-ink hover:text-paper active:translate-y-0.5'
      } disabled:cursor-not-allowed`}
    >
      <div className="text-3xl mb-1">{voted ? '✓' : '▲'}</div>
      <div className="font-mono text-lg">{upvotes}</div>
      <div className="font-mono text-xs uppercase tracking-wide mt-1 opacity-60">
        {voted ? 'Supported' : 'Support This'}
      </div>
    </button>
  )
}
