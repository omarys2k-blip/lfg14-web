import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Flame, Zap, Target, Wind, CheckCircle2, Undo2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { HOME_WORKOUTS } from '../data/homeWorkoutPlan'

const GLASS = 'bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl'
const PURPLE = '#9333ea'

function sectionIcon(name) {
  if (name === 'Warm Up') return <Flame size={14} style={{ color: PURPLE }} />
  if (name === 'Finisher') return <Zap size={14} style={{ color: PURPLE }} />
  if (name.startsWith('Station')) return <Target size={14} style={{ color: PURPLE }} />
  return <Wind size={14} style={{ color: PURPLE }} />
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function HomeWorkoutDetailPage() {
  const { workoutId } = useParams()
  const navigate = useNavigate()
  const { session } = useAuth()

  const workout = HOME_WORKOUTS.find(w => w.id === workoutId)

  // sessions[week] = home_session row | null
  const [sessions, setSessions] = useState({ 1: null, 2: null })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState({ 1: false, 2: false })

  const loadData = useCallback(async () => {
    if (!session || !workout) return
    const { data } = await supabase
      .from('home_sessions')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('workout_label', workout.title)

    const map = { 1: null, 2: null }
    for (const s of data || []) map[s.week] = s
    setSessions(map)
    setLoading(false)
  }, [session, workout])

  useEffect(() => { loadData() }, [loadData])

  async function handleMarkDone(week) {
    if (!session || !workout || saving[week]) return
    setSaving(prev => ({ ...prev, [week]: true }))
    const today = new Date().toISOString().split('T')[0]
    const { data, error } = await supabase
      .from('home_sessions')
      .insert({ user_id: session.user.id, date: today, workout_label: workout.title, week, completed: true })
      .select()
      .single()

    if (error || !data) {
      console.error('Failed to save home workout completion', error)
    } else {
      setSessions(prev => ({ ...prev, [week]: data }))
    }
    setSaving(prev => ({ ...prev, [week]: false }))
  }

  async function handleUndo(week) {
    const sess = sessions[week]
    if (!sess || saving[week]) return
    setSaving(prev => ({ ...prev, [week]: true }))
    const { error } = await supabase.from('home_sessions').delete().eq('id', sess.id)

    if (error) {
      console.error('Failed to undo home workout completion', error)
    } else {
      setSessions(prev => ({ ...prev, [week]: null }))
    }
    setSaving(prev => ({ ...prev, [week]: false }))
  }

  if (!workout) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-red-400 text-sm">Workout not found.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black" style={{ paddingBottom: '160px' }}>
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 pt-6 pb-4">
        <button
          onClick={() => navigate('/home-workout')}
          className="text-[#9C9C9C] hover:text-white transition-colors p-1 -ml-1"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-white font-bold text-lg leading-tight">{workout.title}</h1>
          <p className="text-[#9C9C9C] text-xs">{workout.subtitle}</p>
        </div>
      </div>

      {/* Sections */}
      <div className="flex flex-col gap-3 px-4">
        {workout.sections.map((section, idx) => (
          <div key={idx} className={`${GLASS} overflow-hidden`}>
            {/* Section header */}
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ background: 'rgba(147,51,234,0.06)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(147,51,234,0.18)' }}
                >
                  {sectionIcon(section.name)}
                </div>
                <span className="text-white font-semibold text-sm">{section.name}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(147,51,234,0.15)', color: PURPLE, border: '1px solid rgba(147,51,234,0.25)' }}
                >
                  {section.format}
                </span>
                {section.rest && (
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.05)', color: '#9C9C9C', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    {section.rest}
                  </span>
                )}
              </div>
            </div>

            {/* Exercise list */}
            <div className="px-4 py-3 flex flex-col gap-2">
              {section.exercises.map((ex, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div
                    className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                    style={{ background: PURPLE }}
                  />
                  <div>
                    <span className="text-white text-sm font-medium">{ex.name}</span>
                    <span className="text-[#9C9C9C] text-xs"> — {ex.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Pinned bottom: Week 1 / Week 2 completion */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-safe"
        style={{
          background: 'rgba(0,0,0,0.92)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(20px)',
          paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 72px)',
          paddingTop: '16px',
        }}
      >
        <div className="flex gap-3">
          {[1, 2].map(week => {
            const sess = sessions[week]
            const done = !!sess
            const busy = saving[week] || loading

            return (
              <div
                key={week}
                className="flex-1 rounded-2xl p-3 flex flex-col gap-2"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <p className="text-[#9C9C9C] text-xs font-semibold uppercase tracking-widest">Week {week}</p>
                {done ? (
                  <>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 size={14} style={{ color: PURPLE }} />
                      <span className="text-white text-xs font-semibold">Done</span>
                      <span className="text-[#9C9C9C] text-[10px]">· {formatDate(sess.date)}</span>
                    </div>
                    <button
                      onClick={() => handleUndo(week)}
                      disabled={busy}
                      className="flex items-center justify-center gap-1.5 w-full py-1.5 rounded-xl text-xs font-semibold transition-opacity disabled:opacity-40"
                      style={{ background: 'rgba(255,255,255,0.06)', color: '#9C9C9C', border: '1px solid rgba(255,255,255,0.1)' }}
                    >
                      <Undo2 size={11} />
                      Undo
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleMarkDone(week)}
                    disabled={busy}
                    className="w-full py-2.5 rounded-xl font-bold text-xs tracking-widest uppercase text-white transition-opacity disabled:opacity-50"
                    style={{ background: PURPLE }}
                  >
                    {busy ? '…' : 'Mark Done'}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
