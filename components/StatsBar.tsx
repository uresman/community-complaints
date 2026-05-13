interface StatsBarProps {
  stats: {
    total: number
    pending: number
    in_review: number
    resolved: number
  }
}

export default function StatsBar({ stats }: StatsBarProps) {
  const items = [
    { label: 'Total Complaints', value: stats.total, color: 'text-ink' },
    { label: 'Pending Review', value: stats.pending, color: 'text-amber' },
    { label: 'Under Review', value: stats.in_review, color: 'text-slate' },
    { label: 'Resolved', value: stats.resolved, color: 'text-sage' },
  ]

  return (
    <div className="border-b-2 border-ink bg-cream">
      <div className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map(item => (
          <div key={item.label} className="text-center">
            <div className={`font-display font-bold text-4xl ${item.color}`}>
              {item.value}
            </div>
            <div className="font-mono text-xs uppercase tracking-widest text-ink/50 mt-1">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
