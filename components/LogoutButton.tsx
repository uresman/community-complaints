'use client'

export default function LogoutButton() {
  function logout() {
    document.cookie =
      'admin-auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'

    window.location.href = '/login'
  }

  return (
    <button
      onClick={logout}
      className="border px-4 py-2 text-sm hover:bg-black hover:text-white transition-colors"
    >
      Logout
    </button>
  )
}