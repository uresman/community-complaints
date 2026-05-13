'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const links = [
    { href: '/', label: 'Home' },
    { href: '/complaints', label: 'All Complaints' },
    { href: '/complaints/new', label: 'File Complaint' },
    { href: '/track', label: 'Track' },
  ]

  return (
    <nav className="border-b-2 border-ink bg-ink text-paper">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-display font-bold text-xl tracking-tight">
          Balite<span className="text-amber">Community</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={`font-mono text-sm uppercase tracking-widest transition-colors ${
                pathname === l.href ? 'text-amber' : 'text-paper/70 hover:text-paper'
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/admin"
            className="bg-amber text-ink px-4 py-1.5 font-mono text-sm uppercase tracking-widest hover:bg-amber/90 transition-colors"
          >
            Admin
          </Link>
        </div>

        {/* Mobile */}
        <button className="md:hidden text-paper" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-paper/10 px-6 py-4 flex flex-col gap-4">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className="font-mono text-sm uppercase tracking-widest text-paper/70 hover:text-paper"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/admin"
            className="inline-block bg-amber text-ink px-4 py-2 font-mono text-sm uppercase tracking-widest w-fit"
            onClick={() => setOpen(false)}
          >
            Admin
          </Link>
        </div>
      )}
    </nav>
  )
}
