import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../utils/api'
import ReactMarkdown from 'react-markdown'

const EXAMPLES = [
  { item: 'iPhone 15',     price: 79900 },
  { item: 'MacBook Air M2',price: 114900 },
  { item: 'Bike (Honda Activa)', price: 85000 },
  { item: 'Gaming PC Setup',    price: 60000 },
  { item: 'UPSC Coaching',      price: 45000 },
]

function ScoreRing({ score }) {
  const cls = score >= 65 ? 'score-high' : score >= 35 ? 'score-medium' : 'score-low'
  const label = score >= 65 ? '✅ Affordable' : score >= 35 ? '⚠️ Stretch' : '❌ Not Now'
  return (
    <div style={{ textAlign: 'center' }}>
      <div className={`score-ring anim-pop-in ${cls}`}>{score}</div>
      <div style={{ marginTop: 8, fontSize: 13, fontWeight: 600, color: score >= 65 ? 'var(--secondary)' : score >= 35 ? 'var(--warning)' : 'var(--danger)' }}>
        {label}
      </div>
    </div>
  )
}

export default function AffordabilityChat() {
  const { user }   = useAuth()
  const navigate   = useNavigate()
  const [itemName,  setItemName]  = useState('')
  const [itemPrice, setItemPrice] = useState('')
  const [result,    setResult]    = useState(null)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')

  const check = async (e) => {
    e.preventDefault()
    setError(''); setLoading(true); setResult(null)
    try {
      const data = await api.post('/afford/check', {
        user_id:    user?.id || null,
        item_name:  itemName,
        item_price: parseFloat(itemPrice),
      })
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fillExample = (ex) => { setItemName(ex.item); setItemPrice(String(ex.price)); setResult(null) }

  return (
    <div className="page">
      {/* TOPBAR */}
      <header className="topbar">
        <div className="flex-gap">
          <button className="btn btn-icon" onClick={() => navigate('/dashboard')}>←</button>
          <span style={{ fontSize: 22 }}>💬</span>
          <h1 style={{ fontSize: 18, fontWeight: 700 }}>Can I Afford This?</h1>
        </div>
        <span className="badge badge-green">AI Powered</span>
      </header>

      <div className="page-content" style={{ maxWidth: 680 }}>

        {/* Intro */}
        <div className="anim-fade-up" style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>💬</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>AI Affordability Check</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>
            Tell me what you want to buy and I'll tell you if you can afford it — with a savings plan if needed.
          </p>
        </div>

        {/* Quick examples */}
        <div className="anim-fade-up delay-1" style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 12, color: 'var(--text-faint)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>Quick examples</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {EXAMPLES.map((ex, i) => (
              <button key={i} className="btn btn-secondary btn-sm" onClick={() => fillExample(ex)} style={{ fontSize: 12 }}>
                {ex.item} · ₹{ex.price.toLocaleString('en-IN')}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={check} className="card anim-fade-up delay-2" style={{ marginBottom: 28 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div className="form-group">
              <label>What do you want to buy?</label>
              <input
                placeholder="e.g. iPhone 15, Bike, Laptop…"
                value={itemName}
                onChange={e => setItemName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Price (₹)</label>
              <input
                type="number"
                placeholder="e.g. 79900"
                value={itemPrice}
                onChange={e => setItemPrice(e.target.value)}
                required
                min="1"
              />
            </div>
          </div>
          {error && <p style={{ color: 'var(--danger-light)', fontSize: 13, marginBottom: 12 }}>⚠️ {error}</p>}
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? <><span className="spinner" /> AI is thinking…</> : '🤖 Check Affordability →'}
          </button>
        </form>

        {/* Result */}
        {result && (
          <div className="anim-pop-in">
            {/* Score + stats row */}
            <div className="card" style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
                <ScoreRing score={result.affordability_score} />
                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px,1fr))', gap: 16 }}>
                  {[
                    { label: 'Item Cost',        val: `₹${parseFloat(itemPrice).toLocaleString('en-IN')}`, color: 'var(--text)' },
                    { label: 'Available Budget', val: `₹${result.available_budget.toLocaleString('en-IN')}`, color: result.available_budget >= parseFloat(itemPrice) ? 'var(--secondary)' : 'var(--danger-light)' },
                    { label: 'Months to Save',   val: result.months_to_save ? `${result.months_to_save} mo` : '< 1 month', color: 'var(--warning)' },
                  ].map((s, i) => (
                    <div key={i} style={{ background: 'var(--bg)', padding: '12px 16px', borderRadius: 10 }}>
                      <div style={{ fontSize: 11, color: 'var(--text-faint)', marginBottom: 4 }}>{s.label}</div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: s.color }}>{s.val}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI advice */}
            <div className="flex-gap" style={{ marginBottom: 12 }}>
              <span style={{ fontSize: 22 }}>🤖</span>
              <h3 style={{ fontSize: 15, fontWeight: 700 }}>AI Advisor says…</h3>
            </div>
            <div className="ai-box">
              <ReactMarkdown>{result.ai_response}</ReactMarkdown>
            </div>

            {/* Try again */}
            <button className="btn btn-secondary btn-full" style={{ marginTop: 20 }} onClick={() => { setResult(null); setItemName(''); setItemPrice('') }}>
              Check Another Item →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
