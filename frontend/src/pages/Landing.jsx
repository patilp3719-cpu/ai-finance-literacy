import { useNavigate } from 'react-router-dom'

const FEATURES = [
  {
    icon: '📊', title: 'Expense Analyzer',
    desc: 'Upload receipts or manually track spending. AI categorizes and gives you personalized insights.',
    color: '#3b82f6', delay: 'delay-1',
  },
  {
    icon: '💬', title: 'Can I Afford This?',
    desc: 'Chat with AI about any purchase. Get instant affordability score + savings plan.',
    color: '#059669', delay: 'delay-2',
  },
  {
    icon: '🎓', title: 'Scholarship & Loan Advisor',
    desc: 'Find scholarships, compare education loans, get step-by-step guidance specific to your profile.',
    color: '#f59e0b', delay: 'delay-3',
  },
]

const STATS = [
  { val: '10,000+', label: 'Scholarships Indexed' },
  { val: '₹5,000',  label: 'Avg Monthly Savings'  },
  { val: '3',        label: 'AI-Powered Modules'   },
  { val: '🇮🇳',      label: 'Built for India'       },
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="page" style={{ overflowX: 'hidden' }}>

      {/* ── NAV ── */}
      <nav style={{ padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 100, background: 'rgba(15,23,42,0.85)' }}>
        <div className="flex-gap">
          <span style={{ fontSize: 26 }}>🏦</span>
          <span style={{ fontWeight: 800, fontSize: 17 }}>AI Finance</span>
          <span className="badge badge-blue" style={{ fontSize: 10 }}>BETA</span>
        </div>
        <div className="flex-gap">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/login')}>Login</button>
          <button className="btn btn-primary btn-sm anim-pulse-glow" onClick={() => navigate('/login')}>Get Started →</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <div style={{ textAlign: 'center', padding: '90px 24px 72px', background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(26,86,219,0.18) 0%, transparent 70%)' }}>
        <div className="anim-float" style={{ fontSize: 72, marginBottom: 20 }}>🏦</div>

        <h1 className="anim-fade-up" style={{ fontSize: 'clamp(36px,7vw,68px)', fontWeight: 900, marginBottom: 18 }}>
          <span className="gradient-text">AI Financial Literacy</span>
        </h1>

        <p className="anim-fade-up delay-1" style={{ fontSize: 'clamp(16px,2.5vw,21px)', color: 'var(--text-muted)', maxWidth: 560, margin: '0 auto 12px' }}>
          Built exclusively for <strong style={{ color: 'var(--text)' }}>Indian college students 🇮🇳</strong>
        </p>
        <p className="anim-fade-up delay-2" style={{ color: 'var(--text-faint)', marginBottom: 44, fontSize: 15, maxWidth: 500, margin: '0 auto 44px' }}>
          Budget smarter, understand loans, find scholarships — all powered by AI. Free forever for students.
        </p>

        <div className="anim-fade-up delay-3 flex-center" style={{ gap: 16, flexWrap: 'wrap' }}>
          <button className="btn btn-primary btn-lg anim-pulse-glow" onClick={() => navigate('/login')}>
            Start for Free →
          </button>
          <button className="btn btn-secondary btn-lg" onClick={() => navigate('/login')}>
            See Demo
          </button>
        </div>
      </div>

      {/* ── STATS BAR ── */}
      <div style={{ background: 'var(--card)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '28px 24px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px,1fr))', gap: 24, textAlign: 'center' }}>
          {STATS.map(({ val, label }, i) => (
            <div key={i} className="anim-pop-in" style={{ animationDelay: `${i * 0.08}s` }}>
              <div style={{ fontSize: 28, fontWeight: 800, background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{val}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURES ── */}
      <div style={{ maxWidth: 940, margin: '0 auto', padding: '72px 24px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 'clamp(22px,4vw,36px)', fontWeight: 800, marginBottom: 12 }}>
          Everything a student needs 💡
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: 48, fontSize: 15 }}>
          Three AI-powered modules. One platform. Zero cost.
        </p>

        <div className="grid-3">
          {FEATURES.map((f, i) => (
            <div key={i} className={`card anim-fade-up ${f.delay}`} style={{ cursor: 'pointer', borderTop: `3px solid ${f.color}`, textAlign: 'center' }} onClick={() => navigate('/login')}>
              <div style={{ fontSize: 52, marginBottom: 16 }}>{f.icon}</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: f.color, marginBottom: 10 }}>{f.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.65 }}>{f.desc}</p>
              <button className="btn btn-secondary btn-sm btn-full" style={{ marginTop: 20 }}>Explore →</button>
            </div>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <div style={{ background: 'var(--card)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '64px 24px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(20px,3.5vw,32px)', fontWeight: 800, marginBottom: 40 }}>How it works</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: 32 }}>
            {[
              { step: '01', icon: '📝', text: 'Create your free account with Google or email OTP' },
              { step: '02', icon: '💸', text: 'Log your expenses or answer a few profile questions' },
              { step: '03', icon: '🤖', text: 'Get instant AI-powered insights, advice, and plans' },
              { step: '04', icon: '🎯', text: 'Take action — save more, find scholarships, avoid bad debt' },
            ].map(({ step, icon, text }, i) => (
              <div key={i} className={`anim-fade-up delay-${i + 1}`} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary-light)', letterSpacing: 2, marginBottom: 10 }}>STEP {step}</div>
                <div style={{ fontSize: 40, marginBottom: 12 }}>{icon}</div>
                <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.65 }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div style={{ textAlign: 'center', padding: '72px 24px' }}>
        <h2 style={{ fontSize: 'clamp(22px,4vw,40px)', fontWeight: 800, marginBottom: 16 }}>
          Ready to take control of your money? 🚀
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 36, fontSize: 16 }}>Join thousands of students making smarter financial decisions.</p>
        <button className="btn btn-primary btn-lg anim-pulse-glow" onClick={() => navigate('/login')}>
          Get Started Free — It's Free! →
        </button>
      </div>

      {/* ── FOOTER ── */}
      <div style={{ borderTop: '1px solid var(--border)', padding: '24px', textAlign: 'center', color: 'var(--text-faint)', fontSize: 13 }}>
        🏦 AI Finance · Built for Indian College Students · Open Source · Free Forever
      </div>
    </div>
  )
}
