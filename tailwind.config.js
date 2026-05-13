/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        ink: '#0D0D0D',
        paper: '#F5F0E8',
        cream: '#EDE8DC',
        amber: '#C8860A',
        rust: '#B84A2E',
        sage: '#4A6741',
        slate: '#3D4F5C',
        mist: '#8A9BA8',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
        'stamp': 'stamp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        stamp: { from: { opacity: '0', transform: 'scale(1.4) rotate(-8deg)' }, to: { opacity: '1', transform: 'scale(1) rotate(-3deg)' } },
      }
    },
  },
  plugins: [],
}
