import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, CheckCircle2, Circle, ChevronDown, ChevronUp, TrendingUp, ArrowRight } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { HOME_WORKOUTS, PROGRESSION_GUIDE } from '../data/homeWorkoutPlan'

const GLASS = 'bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl'
const PURPLE = '#9333ea'

// ── Progress Guide ─────────────────────────────────────────────────────────────
function ProgressionGuide() {
  const [open, setOpen] = useState(false)

  return (
    <div className={GLASS}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between p-4"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: 'rgba(147,51,234,0.15)', border: '1px solid rgba(147,51,234,0.3)' }}
          >
            <TrendingUp size={15} style={{ color: PURPLE }} />
          </div>
          <span className="text-white font-semibold text-sm">Learn How to Progress</span>
        </div>
        {open ? <ChevronUp size={16} className="text-[#9C9C9C]" /> : <ChevronDown size={16} className="text-[#9C9C9C]" />}
      </button>

      {open && (
        <div className="px-4 pb-5 flex flex-col gap-5" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>

          {/* Tempo */}
          <div className="pt-4">
            <p className="text-white font-semibold text-xs uppercase tracking-widest mb-3" style={{ color: PURPLE }}>
              Tempo Progression (Weeks 1–4)
            </p>
            <div className="flex flex-col gap-2">
              {PROGRESSION_GUIDE.tempo.map(t => (
                <div key={t.week} className="flex items-start gap-3">
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded-md shrink-0 mt-0.5"
                    style={{ background: 'rgba(147,51,234,0.15)', color: PURPLE }}
                  >
                    Wk{t.week}
                  </span>
                  <span className="text-[#9C9C9C] text-xs leading-relaxed">{t.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Rep progression */}
          <div>
            <p className="text-white font-semibold text-xs uppercase tracking-widest mb-2" style={{ color: PURPLE }}>
              Rep Progression
            </p>
            <p className="text-[#9C9C9C] text-xs leading-relaxed">{PROGRESSION_GUIDE.reps}</p>
          </div>

          {/* Harder variations */}
          <div>
            <p className="text-white font-semibold text-xs uppercase tracking-widest mb-3" style={{ color: PURPLE }}>
              Harder Variations
            </p>
            <div className="flex flex-col gap-3">
              {PROGRESSION_GUIDE.variations.map(v => (
                <div key={v.category}>
                  <p className="text-white text-xs font-semibold mb-1">{v.category}</p>
                  <div className="flex flex-wrap items-center gap-1">
                    {v.chain.split(' → ').map((step, i, arr) => (
                      <span key={i} className="flex items-center gap-1">
                        <span
                          className="text-[10px] px-2 py-0.5 rounded-full"
                          style={{ background: 'rgba(255,255,255,0.06)', color: '#9C9C9C' }}
                        >
                          {step}
                        </span>
                        {i < arr.length - 1 && <ArrowRight size={10} className="text-[#9C9C9C]" />}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Density */}
          <div>
            <p className="text-white font-semibold text-xs uppercase tracking-widest mb-2" style={{ color: PURPLE }}>
              Density
            </p>
            <p className="text-[#9C9C9C] text-xs leading-relaxed">{PROGRESSION_GUIDE.density}</p>
          </div>

          {/* Intensity */}
          <div>
            <p className="text-white font-semibold text-xs uppercase tracking-widest mb-3" style={{ color: PURPLE }}>
              Intensity Progression
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              {PROGRESSION_GUIDE.intensity.map((step, i, arr) => (
                <span key={i} className="flex items-center gap-2">
                  <span
                    className="text-[10px] px-2 py-1 rounded-lg font-mono"
                    style={{ background: 'rgba(147,51,234,0.12)', color: PURPLE, border: '1px solid rgba(147,51,234,0.25)' }}
                  >
                    {step}
                  </span>
                  {i < arr.length - 1 && <ArrowRight size={10} className="text-[#9C9C9C]" />}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function HomeWorkoutPage() {
  const { session } = useAuth()
  const navigate = useNavigate()
  const [homeSessions, setHomeSessions] = useState([])

  useEffect(() => {
    if (!session) return
    supabase
      .from('home_sessions')
      .select('workout_label, week, completed')
      .eq('user_id', session.user.id)
      .then(({ data }) => setHomeSessions(data || []))
  }, [session])

  function getWeekSession(workoutTitle, week) {
    return homeSessions.find(s => s.workout_label === workoutTitle && s.week === week)
  }

  return (
    <div className="min-h-screen bg-black px-4 pt-6 pb-8">
      <h1 className="text-white font-bold text-xl mb-1">Home Workouts</h1>
      <p className="text-[#9C9C9C] text-xs mb-5">3 workouts · bodyweight · no equipment</p>

      <div className="flex flex-col gap-3">
        {HOME_WORKOUTS.map(workout => {
          const w1 = getWeekSession(workout.title, 1)
          const w2 = getWeekSession(workout.title, 2)

          return (
            <button
              key={workout.id}
              onClick={() => navigate(`/home-workout/${workout.id}`)}
              className={`${GLASS} p-4 w-full text-left flex items-center gap-4 active:opacity-70 transition-opacity`}
            >
              {/* Letter badge */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-base"
                style={{ background: 'rgba(147,51,234,0.15)', color: PURPLE, border: '1px solid rgba(147,51,234,0.3)' }}
              >
                {workout.id}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm">{workout.title}</p>
                <p className="text-[#9C9C9C] text-xs mt-0.5 truncate">{workout.subtitle}</p>
                <div className="flex gap-2 mt-2">
                  {[1, 2].map(week => {
                    const sess = week === 1 ? w1 : w2
                    const done = sess?.completed
                    return (
                      <div
                        key={week}
                        className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                        style={{
                          background: done ? 'rgba(147,51,234,0.2)' : 'rgba(255,255,255,0.04)',
                          border: done ? '1px solid rgba(147,51,234,0.4)' : '1px solid rgba(255,255,255,0.08)',
                          color: done ? PURPLE : '#9C9C9C',
                        }}
                      >
                        {done ? <CheckCircle2 size={10} /> : <Circle size={10} />}
                        <span className="ml-0.5">W{week}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <ChevronRight size={18} className="text-[#9C9C9C] shrink-0" />
            </button>
          )
        })}

        <ProgressionGuide />
      </div>
    </div>
  )
}
