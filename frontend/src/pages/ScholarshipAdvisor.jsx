import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../utils/api'
import ReactMarkdown from 'react-markdown'

const STATES = ['Andhra Pradesh','Assam','Bihar','Delhi','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Odisha','Punjab','Rajasthan','Tamil Nadu','Telangana','Uttar Pradesh','Uttarakhand','West Bengal']
const COURSES = ['Engineering/B.Tech','Medical/MBBS','Science (B.Sc)','Commerce (B.Com)','Arts/Humanities (B.A)','MBA/Management','Law (LLB)','Polytechnic/Diploma','ITI','Other']
const CATEGORIES = ['General','OBC','SC','ST','EWS','Minority']

export default function ScholarshipAdvisor() {
  const { user }  = useAuth()
  const navigate  = useNavigate()
  const [form, setForm] = useState({
    college:       user?.college || '',
    course:        'Engineering/B.Tech',
    family_income: '',
    category:      'General',
    state:         'Maharashtra',
    score:         '',
  })
  const [result,  setResult]  = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [submitted, setSubmitted] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError(''); setLoading(true); setResult(''); setSubmitted(false)
    try {
      const payload = {
        ...form,
        family_income: parseFloat(form.family_income) || 400000,
        score: form.score || '75',
      }
      const data = await api.post('/scholarship/advise', payload)
      setResult(data.advice)
      setSubmitted(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const f = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  return (
    <div className="page">
      {/* TOPBAR */}
      <header className="topbar">
        <div className="flex-gap">
          <button className="btn btn-icon" onClick={() => navigate('/dashboard')}>←</button>
          <span style={{ fontSize: 22 }}>🎓</span>
          <h1 style={{ fontSize: 18, fontWeight: 700 }}>Scholarship & Loan Advisor</h1>
        </div>
        <span className="badge badge-yellow">AI Powered</span>
      </header>

      <div className="page-content" style={{ maxWidth: 760 }}>
        <div className="grid-2">
          {/* ── FORM ── */}
          <div className="anim-fade-up">
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>🎓 Find Your Scholarships</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Fill in your profile and AI will match you with scholarships and loan options specific to India.</p>
            </div>

            <form onSubmit={submit} className="stack" style={{ gap: 14 }}>
              <div className="form-group">
                <label>College / University Name</label>
                <input placeholder="e.g. VNIT Nagpur, Mumbai University…" value={form.college} onChange={f('college')} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label>Course / Stream</label>
                  <select value={form.course} onChange={f('course')}>
                    {COURSES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select value={form.category} onChange={f('category')}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label>Annual Family Income (₹)</label>
                  <input type="number" placeholder="e.g. 400000" value={form.family_income} onChange={f('family_income')} min="0" />
                </div>
                <div className="form-group">
                  <label>Academic Score (%)</label>
                  <input type="number" placeholder="e.g. 78" value={form.score} onChange={f('score')} min="0" max="100" />
                </div>
              </div>

              <div className="form-group">
                <label>State</label>
                <select value={form.state} onChange={f('state')}>
                  {STATES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>

              {error && <p style={{ color: 'var(--danger-light)', fontSize: 13 }}>⚠️ {error}</p>}

              <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                {loading ? <><span className="spinner" /> Finding scholarships…</> : '🎓 Find My Scholarships →'}
              </button>
            </form>

            {/* Info cards */}
            <div style={{ marginTop: 24, display: 'grid', gap: 10 }}>
              {[
                { icon: '🏛️', title: 'National Scholarship Portal', desc: 'scholarships.gov.in', color: '#3b82f6' },
                { icon: '💼', title: 'PSB Loans to Scholars',       desc: '75 banks, concessional rates', color: '#059669' },
                { icon: '📱', title: 'Vidyasaarathi Platform',      desc: 'vidyasaarathi.co.in', color: '#f59e0b' },
              ].map((item, i) => (
                <div key={i} className="card-flat" style={{ borderLeft: `3px solid ${item.color}`, display: 'flex', gap: 12, alignItems: 'center', padding: '12px 16px' }}>
                  <span style={{ fontSize: 24 }}>{item.icon}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{item.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-faint)' }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RESULT ── */}
          <div className="anim-fade-up delay-2">
            {loading && (
              <div className="card flex-center" style={{ minHeight: 320, flexDirection: 'column', gap: 16 }}>
                <span className="spinner" style={{ width: 40, height: 40 }} />
                <p style={{ color: 'var(--text-muted)' }}>AI is searching thousands of scholarships…</p>
                <p style={{ color: 'var(--text-faint)', fontSize: 13 }}>This may take 10–20 seconds</p>
              </div>
            )}

            {!loading && !submitted && (
              <div className="card empty-state" style={{ minHeight: 320 }}>
                <div className="icon">🎓</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Your results will appear here</h3>
                <p style={{ fontSize: 14 }}>Fill in your profile and click "Find My Scholarships" to get personalized scholarship & loan recommendations.</p>
              </div>
            )}

            {result && (
              <div className="anim-pop-in">
                <div className="flex-gap" style={{ marginBottom: 14 }}>
                  <span style={{ fontSize: 22 }}>🤖</span>
                  <h3 style={{ fontSize: 15, fontWeight: 700 }}>AI Scholarship Report</h3>
                </div>
                <div className="ai-box" style={{ maxHeight: 560, overflowY: 'auto' }}>
                  <ReactMarkdown>{result}</ReactMarkdown>
                </div>
                <button className="btn btn-secondary btn-full" style={{ marginTop: 16 }} onClick={() => { setResult(''); setSubmitted(false) }}>
                  🔄 Search Again with Different Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
