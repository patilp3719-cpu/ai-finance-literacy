import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../utils/api'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import ReactMarkdown from 'react-markdown'

const CATEGORIES = ['Food','Transport','Education','Rent','Entertainment','Medical','Clothing','Other']
const CAT_COLORS  = { Food:'#3b82f6', Transport:'#059669', Education:'#f59e0b', Rent:'#8b5cf6', Entertainment:'#ef4444', Medical:'#06b6d4', Clothing:'#ec4899', Other:'#94a3b8' }
const CAT_ICONS   = { Food:'🍕', Transport:'🚌', Education:'📚', Rent:'🏠', Entertainment:'🎮', Medical:'💊', Clothing:'👕', Other:'📦' }

export default function ExpenseAnalyzer() {
  const { user }   = useAuth()
  const navigate   = useNavigate()
  const [expenses, setExpenses]     = useState([])
  const [summary,  setSummary]      = useState({})
  const [total,    setTotal]        = useState(0)
  const [aiResp,   setAiResp]       = useState('')
  const [aiLoad,   setAiLoad]       = useState(false)
  const [addLoad,  setAddLoad]      = useState(false)
  const [form, setForm]             = useState({ amount: '', category: 'Food', description: '' })
  const [activeTab, setActiveTab]   = useState('pie')

  const loadData = async () => {
    if (!user) return
    const [expData, sumData] = await Promise.all([
      api.get(`/expenses/list/${user.id}`),
      api.get(`/expenses/summary/${user.id}`),
    ])
    setExpenses(expData)
    setSummary(sumData.summary)
    setTotal(sumData.total)
  }

  useEffect(() => { loadData() }, [user])

  const addExpense = async (e) => {
    e.preventDefault()
    if (!form.amount || parseFloat(form.amount) <= 0) return
    setAddLoad(true)
    try {
      await api.post('/expenses/add', { ...form, user_id: user.id, amount: parseFloat(form.amount) })
      setForm({ amount: '', category: 'Food', description: '' })
      await loadData()
    } finally {
      setAddLoad(false)
    }
  }

  const deleteExpense = async (id) => {
    await api.delete(`/expenses/delete/${id}`)
    await loadData()
  }

  const askAI = async () => {
    setAiLoad(true); setAiResp('')
    try {
      const { response } = await api.post('/expenses/ask-ai', { user_id: user.id })
      setAiResp(response)
    } finally {
      setAiLoad(false)
    }
  }

  const pieData  = Object.entries(summary).map(([name, value]) => ({ name, value }))
  const barData  = Object.entries(summary).map(([name, value]) => ({ name: name.slice(0, 4), value }))
  const budget   = user?.monthly_budget || 5000
  const pctUsed  = Math.min(100, Math.round((total / budget) * 100))

  return (
    <div className="page">
      {/* TOPBAR */}
      <header className="topbar">
        <div className="flex-gap">
          <button className="btn btn-icon" onClick={() => navigate('/dashboard')}>←</button>
          <span style={{ fontSize: 22 }}>📊</span>
          <h1 style={{ fontSize: 18, fontWeight: 700 }}>Expense Analyzer</h1>
        </div>
        <button className="btn btn-primary btn-sm" onClick={askAI} disabled={aiLoad || !expenses.length}>
          {aiLoad ? <><span className="spinner" /> Analyzing…</> : '🤖 Ask AI'}
        </button>
      </header>

      <div className="page-content">
        <div className="grid-2">
          {/* ── LEFT: Add Expense + List ── */}
          <div className="stack">
            {/* Add form */}
            <div className="card anim-fade-up">
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 18 }}>➕ Add Expense</h3>
              <form onSubmit={addExpense} className="stack" style={{ gap: 12 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label>Amount (₹)</label>
                    <input type="number" placeholder="500" min="1" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                      {CATEGORIES.map(c => <option key={c}>{CAT_ICONS[c]} {c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Description (optional)</label>
                  <input placeholder="e.g. Zomato, Bus pass…" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                </div>
                <button type="submit" className="btn btn-primary btn-full" disabled={addLoad}>
                  {addLoad ? <><span className="spinner" /> Adding…</> : 'Add Expense'}
                </button>
              </form>
            </div>

            {/* Budget meter */}
            <div className="card-flat anim-fade-up delay-1">
              <div className="flex-between" style={{ marginBottom: 10 }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>Monthly Budget Usage</span>
                <span style={{ fontWeight: 700, color: pctUsed > 85 ? 'var(--danger-light)' : pctUsed > 60 ? 'var(--warning)' : 'var(--secondary)' }}>
                  {pctUsed}%
                </span>
              </div>
              <div style={{ height: 10, background: 'var(--border)', borderRadius: 8, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pctUsed}%`, borderRadius: 8, transition: 'width 0.8s ease', background: pctUsed > 85 ? 'var(--danger)' : pctUsed > 60 ? 'var(--warning)' : 'var(--secondary)' }} />
              </div>
              <div className="flex-between" style={{ marginTop: 8 }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Spent: ₹{total.toLocaleString('en-IN')}</span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Budget: ₹{budget.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Expense list */}
            <div className="card anim-fade-up delay-2">
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>📋 Recent Expenses</h3>
              {expenses.length === 0 ? (
                <div className="empty-state">
                  <div className="icon">📭</div>
                  <p>No expenses yet. Add your first one!</p>
                </div>
              ) : (
                <div className="stack" style={{ gap: 10, maxHeight: 320, overflowY: 'auto' }}>
                  {expenses.map(exp => (
                    <div key={exp.id} className="flex-between" style={{ padding: '10px 14px', background: 'var(--bg)', borderRadius: 10, border: '1px solid var(--border)' }}>
                      <div className="flex-gap">
                        <span style={{ fontSize: 20 }}>{CAT_ICONS[exp.category] || '📦'}</span>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600 }}>{exp.description || exp.category}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-faint)' }}>{exp.category} · {exp.date}</div>
                        </div>
                      </div>
                      <div className="flex-gap">
                        <span style={{ fontWeight: 700, color: CAT_COLORS[exp.category] || '#94a3b8' }}>₹{exp.amount.toLocaleString('en-IN')}</span>
                        <button className="btn btn-icon" style={{ width: 28, height: 28, fontSize: 12 }} onClick={() => deleteExpense(exp.id)}>✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT: Charts + AI ── */}
          <div className="stack">
            {/* Chart tabs */}
            <div className="card anim-fade-up">
              <div className="flex-between" style={{ marginBottom: 20 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700 }}>📈 Spending Breakdown</h3>
                <div className="flex-gap" style={{ gap: 8 }}>
                  {['pie','bar'].map(t => (
                    <button key={t} className={`btn btn-sm ${activeTab === t ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab(t)}>
                      {t === 'pie' ? '🥧 Pie' : '📊 Bar'}
                    </button>
                  ))}
                </div>
              </div>

              {pieData.length === 0 ? (
                <div className="empty-state" style={{ padding: '32px 0' }}>
                  <div className="icon">📊</div>
                  <p>Add expenses to see charts</p>
                </div>
              ) : activeTab === 'pie' ? (
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                      {pieData.map((entry, i) => <Cell key={i} fill={CAT_COLORS[entry.name] || '#94a3b8'} />)}
                    </Pie>
                    <Tooltip formatter={(v) => `₹${v.toLocaleString('en-IN')}`} contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10 }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={barData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                    <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                    <Tooltip formatter={(v) => `₹${v.toLocaleString('en-IN')}`} contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10 }} />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {barData.map((entry, i) => <Cell key={i} fill={CAT_COLORS[Object.keys(CAT_COLORS)[i % 8]]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}

              {/* Category legend */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
                {Object.entries(summary).sort((a, b) => b[1] - a[1]).map(([cat, amt]) => (
                  <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'var(--bg)', padding: '4px 10px', borderRadius: 20, fontSize: 12 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: CAT_COLORS[cat] || '#94a3b8', flexShrink: 0 }} />
                    <span style={{ color: 'var(--text-muted)' }}>{cat}</span>
                    <span style={{ fontWeight: 700 }}>₹{amt.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Response */}
            {(aiResp || aiLoad) && (
              <div className="anim-fade-up">
                <div className="flex-gap" style={{ marginBottom: 12 }}>
                  <span style={{ fontSize: 22 }}>🤖</span>
                  <h3 style={{ fontSize: 15, fontWeight: 700 }}>AI Financial Insights</h3>
                </div>
                {aiLoad ? (
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 20, background: 'var(--card)', borderRadius: 'var(--radius)' }}>
                    <span className="spinner" />
                    <span style={{ color: 'var(--text-muted)' }}>Analyzing your spending patterns…</span>
                  </div>
                ) : (
                  <div className="ai-box">
                    <ReactMarkdown>{aiResp}</ReactMarkdown>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
