import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, CheckCircle2, Circle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { GYM_PLAN } from '../data/gymPlan'

const GLASS = 'bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl'

export default function GymPage() {
  const { session } = useAuth()
  const navigate = useNavigate()
  const [gymSessions, setGymSessions] = useState([])

  useEffect(() => {
    if (!session) return
    supabase
      .from('gym_sessions')
      .select('gym_day_index, week, completed')
      .eq('user_id', session.user.id)
      .then(({ data }) => setGymSessions(data || []))
  }, [session])

  function getWeekSession(dayIndex, week) {
    const matches = gymSessions.filter(s => s.gym_day_index === dayIndex && s.week === week)
    // If duplicates ever exist, prefer a completed one so the badge never
    // under-reports progress the user has actually logged.
    return matches.find(s => s.completed) || matches[0]
  }

  return (
    <div className="min-h-screen bg-black px-4 pt-6 pb-8">
      <h1 className="text-white font-bold text-xl mb-1">Gym Workouts</h1>
      <p className="text-[#9C9C9C] text-xs mb-5">4-day split · 2 weeks</p>

      <div className="flex flex-col gap-3">
        {GYM_PLAN.map(day => {
          const w1 = getWeekSession(day.gymDayIndex, 1)
          const w2 = getWeekSession(day.gymDayIndex, 2)

          return (
            <button
              key={day.gymDayIndex}
              onClick={() => navigate(`/gym/${day.gymDayIndex}`)}
              className={`${GLASS} p-4 w-full text-left flex items-center gap-4 active:opacity-70 transition-opacity`}
            >
              {/* Day badge */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm"
                style={{ background: 'rgba(153,153,102,0.15)', color: '#999966', border: '1px solid rgba(153,153,102,0.3)' }}
              >
                D{day.gymDayIndex}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm">{day.label}</p>
                <p className="text-[#9C9C9C] text-xs mt-0.5">{day.exercises.length} exercises</p>
                <div className="flex gap-2 mt-2">
                  {[1, 2].map(week => {
                    const sess = week === 1 ? w1 : w2
                    const done = sess?.completed
                    return (
                      <div
                        key={week}
                        className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                        style={{
                          background: done ? 'rgba(153,153,102,0.2)' : 'rgba(255,255,255,0.04)',
                          border: done ? '1px solid rgba(153,153,102,0.4)' : '1px solid rgba(255,255,255,0.08)',
                          color: done ? '#999966' : '#9C9C9C',
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
      </div>
    </div>
  )
}
