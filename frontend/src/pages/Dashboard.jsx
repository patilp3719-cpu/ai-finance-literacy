import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const MODULES = [
  {
    icon: '📊', title: 'Expense Analyzer',
    desc: 'Track spending, get AI-powered category insights & saving tips.',
    path: '/expenses', color: '#3b82f6', badge: 'Module 1', badgeClass: 'badge-blue',
  },
  {
    icon: '💬', title: 'Can I Afford This?',
    desc: 'Chat with AI — instant affordability score for any purchase.',
    path: '/afford',   color: '#059669', badge: 'Module 2', badgeClass: 'badge-green',
  },
  {
    icon: '🎓', title: 'Scholarship Advisor',
    desc: 'Find scholarships & loans matched to your college profile.',
    path: '/scholar',  color: '#f59e0b', badge: 'Module 3', badgeClass: 'badge-yellow',
  },
]

const TIPS = [
  '50-30-20 Rule: 50% needs · 30% wants · 20% savings',
  'Apply NSP scholarships before Oct 31 every year',
  'Track every expense above ₹100 — small leaks sink big ships',
  'Emergency fund = at least 3 months of expenses',
]

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return '🌅 Good morning'
    if (h < 17) return '☀️ Good afternoon'
    return '🌙 Good evening'
  }

  return (
    <div className="page">

      {/* ── TOPBAR ── */}
      <header className="topbar">
        <div className="flex-gap">
          <span style={{ fontSize: 26 }}>🏦</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16 }}>AI Finance</div>
            <div style={{ color: 'var(--text-faint)', fontSize: 11 }}>Student Financial Literacy</div>
          </div>
        </div>
        <div className="flex-gap">
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{user?.name || 'Student'}</div>
            <div style={{ fontSize: 11, color: 'var(--text-faint)' }}>{user?.email}</div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={logout}>Logout</button>
        </div>
      </header>

      <div className="page-content">

        {/* ── WELCOME ── */}
        <div className="anim-fade-up" style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 'clamp(20px,4vw,30px)', fontWeight: 800, marginBottom: 6 }}>
            {greeting()}, {user?.name?.split(' ')[0] || 'there'}! 👋
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>
            Choose a module below to manage your finances smarter with AI.
          </p>
        </div>

        {/* ── QUICK STATS ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px,1fr))', gap: 16, marginBottom: 40 }}>
          {[
            { label: 'Monthly Budget', val: `₹${(user?.monthly_budget || 5000).toLocaleString('en-IN')}`, icon: '💰', color: '#3b82f6' },
            { label: 'Monthly Income', val: `₹${(user?.monthly_income || 8000).toLocaleString('en-IN')}`, icon: '💵', color: '#059669' },
            { label: 'Savings Goal',   val: `₹${(user?.savings_goal  || 2000).toLocaleString('en-IN')}`, icon: '🎯', color: '#f59e0b' },
          ].map((s, i) => (
            <div key={i} className={`card-flat anim-fade-up delay-${i + 1}`} style={{ borderLeft: `3px solid ${s.color}` }}>
              <div style={{ fontSize: 22 }}>{s.icon}</div>
              <div style={{ fontSize: 18, fontWeight: 800, marginTop: 6 }}>{s.val}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── MODULES ── */}
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>
          AI Modules
        </h3>
        <div className="grid-3" style={{ marginBottom: 40 }}>
          {MODULES.map((m, i) => (
            <div
              key={i}
              className={`card anim-fade-up delay-${i + 1}`}
              style={{ cursor: 'pointer', borderTop: `3px solid ${m.color}` }}
              onClick={() => navigate(m.path)}
            >
              <div className="flex-between" style={{ marginBottom: 16 }}>
                <span style={{ fontSize: 42 }}>{m.icon}</span>
                <span className={`badge ${m.badgeClass}`}>{m.badge}</span>
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: m.color, marginBottom: 8 }}>{m.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 13.5, lineHeight: 1.65, marginBottom: 20 }}>{m.desc}</p>
              <button className="btn btn-primary btn-full btn-sm" style={{ background: `linear-gradient(135deg, ${m.color}dd, ${m.color}99)` }}>
                Open Module →
              </button>
            </div>
          ))}
        </div>

        {/* ── TIPS ── */}
        <div className="anim-fade-up" style={{ background: 'linear-gradient(135deg, rgba(26,86,219,0.1), rgba(5,150,105,0.08))', border: '1px solid rgba(59,130,246,0.25)', borderRadius: 'var(--radius)', padding: '24px 28px' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>💡 Financial Tips for Indian Students</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: 12 }}>
            {TIPS.map((tip, i) => (
              <div key={i} style={{ background: 'rgba(0,0,0,0.2)', padding: '12px 16px', borderRadius: 10, fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                {tip}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
