import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function OnboardingPage() {
  const { session, fetchProfile } = useAuth()
  const [name, setName] = useState('')
  const [gender, setGender] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!gender) { setError('Please select your gender'); return }
    setError('')
    setLoading(true)

    const { error } = await supabase
      .from('profiles')
      .update({ name, gender, has_completed_onboarding: true })
      .eq('id', session.user.id)

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      await fetchProfile(session.user.id)
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
      <div className="mb-8 text-center">
        <div className="text-white font-black text-5xl tracking-tight">LFG</div>
        <div className="text-[#9C9C9C] text-xs tracking-[0.3em] mt-1 uppercase">Welcome</div>
      </div>

      <div
        className="w-full max-w-sm rounded-2xl p-8"
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <h2 className="text-white font-bold text-lg mb-1">Let's set up your profile</h2>
        <p className="text-[#9C9C9C] text-sm mb-6">This only takes a second.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="text-[#9C9C9C] text-xs uppercase tracking-widest mb-2 block">
              Your Name
            </label>
            <input
              type="text"
              placeholder="First name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="w-full rounded-xl px-4 py-3 text-white text-sm outline-none focus:ring-1 focus:ring-[#999966]"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
            />
          </div>

          <div>
            <label className="text-[#9C9C9C] text-xs uppercase tracking-widest mb-2 block">
              Gender
            </label>
            <div className="flex gap-3">
              {['Male', 'Female'].map(g => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all"
                  style={{
                    background: gender === g ? '#9333ea' : 'rgba(255,255,255,0.08)',
                    border: gender === g ? '1px solid #9333ea' : '1px solid rgba(255,255,255,0.12)',
                    color: '#ffffff',
                  }}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-red-400 text-xs text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl py-3 font-bold text-sm tracking-widest uppercase text-white mt-1 transition-opacity disabled:opacity-50"
            style={{ background: '#999966' }}
          >
            {loading ? 'Saving…' : "Let's Go"}
          </button>
        </form>
      </div>
    </div>
  )
}
