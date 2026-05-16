'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(
    e: React.FormEvent
  ) {
    e.preventDefault()

    if (loading) return

    setLoading(true)
    setError('')

    // simple admin login
    if (
      email === 'admin@snsukeybox.online' &&
      password === 'admin123'
    ) {
      document.cookie =
        'admin-auth=true; path=/; max-age=86400'

      router.push('/admin')
      router.refresh()

      return
    }

    setError('Invalid email or password')
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper p-6">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white border-2 border-black p-8 space-y-5"
      >
        <h1 className="text-3xl font-bold">
          Admin Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="w-full border p-3"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="w-full border p-3"
          required
        />

        {error && (
          <p className="text-red-500 text-sm">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white p-3 disabled:opacity-50"
        >
          {loading
            ? 'Logging in...'
            : 'Login'}
        </button>
      </form>
    </div>
  )
}