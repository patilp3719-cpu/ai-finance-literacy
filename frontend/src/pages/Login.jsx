import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../utils/api'

export default function Login() {
  const [step,    setStep]    = useState('email')  // 'email' | 'otp'
  const [email,   setEmail]   = useState('')
  const [name,    setName]    = useState('')
  const [otp,     setOtp]     = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const { login } = useAuth()
  const navigate  = useNavigate()

  const sendOtp = async (e) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      await api.post('/auth/send-otp', { email, name })
      setStep('otp')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const verifyOtp = async (e) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      const data = await api.post('/auth/verify-otp', { email, otp })
      login(data.user, data.access_token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-center" style={{ minHeight: '100vh', padding: 24, background: 'radial-gradient(ellipse 70% 60% at 50% 20%, rgba(26,86,219,0.14) 0%, transparent 65%)' }}>
      <div className="card anim-pop-in" style={{ width: '100%', maxWidth: 420 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div className="anim-float" style={{ fontSize: 52, marginBottom: 14 }}>🏦</div>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>
            {step === 'email' ? 'Welcome!' : 'Verify OTP'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
            {step === 'email'
              ? 'AI Financial Literacy for Indian Students 🇮🇳'
              : `Check your inbox — we sent a code to ${email}`}
          </p>
        </div>

        {/* Google Login (UI only — wire up with Google Identity Services) */}
        {step === 'email' && (
          <>
            <button
                  className="btn btn-secondary btn-full"
                  style={{ marginBottom: 20, gap: 10, opacity: 0.6, cursor: 'not-allowed' }}
                  disabled
                  title="Google login coming soon"
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width={18} alt="" />
                  Continue with Google (Coming Soon)
                </button>

            <div className="divider" style={{ marginBottom: 20 }}>or use email OTP</div>
          </>
        )}

        {/* Email form */}
        {step === 'email' ? (
          <form onSubmit={sendOtp} className="stack" style={{ gap: 14 }}>
            <div className="form-group">
              <label>Your Name</label>
              <input
                placeholder="Rahul Sharma"
                value={name}
                onChange={e => setName(e.target.value)}
                autoComplete="name"
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="you@gmail.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            {error && <p style={{ color: 'var(--danger-light)', fontSize: 13 }}>⚠️ {error}</p>}
            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? <><span className="spinner" /> Sending…</> : 'Send OTP →'}
            </button>
          </form>
        ) : (
          /* OTP form */
          <form onSubmit={verifyOtp} className="stack" style={{ gap: 14 }}>
            <div className="form-group">
              <label style={{ textAlign: 'center' }}>Enter 6-digit OTP</label>
              <input
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                placeholder="● ● ● ● ● ●"
                required
                style={{ textAlign: 'center', fontSize: 26, letterSpacing: 10, fontWeight: 700 }}
                autoFocus
              />
            </div>
            {error && <p style={{ color: 'var(--danger-light)', fontSize: 13 }}>⚠️ {error}</p>}
            <button type="submit" className="btn btn-primary btn-full" disabled={loading || otp.length < 6}>
              {loading ? <><span className="spinner" /> Verifying…</> : 'Verify & Login ✓'}
            </button>
            <button type="button" className="btn btn-ghost btn-full" onClick={() => { setStep('email'); setOtp(''); setError('') }}>
              ← Back to email
            </button>
            <p style={{ textAlign: 'center', color: 'var(--text-faint)', fontSize: 12 }}>
              Didn't receive it? Check spam, or{' '}
              <span style={{ color: 'var(--primary-light)', cursor: 'pointer' }} onClick={() => { setStep('email'); setOtp('') }}>
                resend OTP
              </span>
            </p>
          </form>
        )}

        <p style={{ textAlign: 'center', color: 'var(--text-faint)', fontSize: 12, marginTop: 24 }}>
          🔒 Your data is encrypted and never shared
        </p>
      </div>
    </div>
  )
}
