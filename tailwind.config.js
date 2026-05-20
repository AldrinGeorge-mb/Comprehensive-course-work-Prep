/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0a0a1a',
        'bg-card': 'rgba(255,255,255,0.04)',
        'bg-card-hover': 'rgba(255,255,255,0.08)',
        'border-card': 'rgba(255,255,255,0.08)',
        'border-glow': 'rgba(99,102,241,0.4)',
        'text-primary': '#f1f5f9',
        'text-secondary': '#94a3b8',
        'text-muted': '#64748b',
        'accent-indigo': '#6366f1',
        'accent-violet': '#8b5cf6',
        'accent-emerald': '#10b981',
        'accent-rose': '#f43f5e',
        'accent-amber': '#f59e0b',
      },
      boxShadow: {
        'lg': '0 20px 60px rgba(0,0,0,0.5)',
        'glow': '0 0 30px rgba(99,102,241,0.15)',
      }
    },
  },
  plugins: [],
}
