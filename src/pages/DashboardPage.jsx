import { useEffect, useState, useCallback, useRef } from 'react'
import { generateAndDownloadCsv } from '../lib/exportCsv'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Pencil, Plus, Trash2, Download, SlidersHorizontal } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import EntryModal from '../components/EntryModal'
import PersonalizeModal from '../components/PersonalizeModal'
import {
  getCohortDay, getCohortWeek,
  getDayDateKey, getDayShort, getDayLetter, getDayFull,
} from '../lib/cohortClock'

const GLASS = 'bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4'
const currentDay = getCohortDay()
const currentWeek = getCohortWeek(currentDay)

// Build a map of dateKey -> { gym: bool, home: bool } from session arrays
function buildWorkoutMap(gymSessions, homeSessions) {
  const map = {}
  for (const s of gymSessions) {
    if (s.completed) {
      if (!map[s.date]) map[s.date] = { gym: false, home: false }
      map[s.date].gym = true
    }
  }
  for (const s of homeSessions) {
    if (s.completed) {
      if (!map[s.date]) map[s.date] = { gym: false, home: false }
      map[s.date].home = true
    }
  }
  return map
}

// Build a map of dateKey -> entry object
function buildEntryMap(entries) {
  const map = {}
  for (const e of entries) map[e.date] = e
  return map
}

function avg(values) {
  const nums = values.filter(v => v != null)
  if (!nums.length) return null
  return nums.reduce((a, b) => a + b, 0) / nums.length
}

// ── Header ────────────────────────────────────────────────────────────────────
function Header({ profile, onPersonalize }) {
  const hasStarted = currentDay != null
  const dayName = hasStarted ? getDayFull(currentDay) : null
  const weekNum = hasStarted ? currentWeek : null
  const hasPersonalized = !!profile?.goal

  const goalLabels = {
    muscle_building: 'Muscle Building',
    fat_loss: 'Fat Loss',
    maintain: 'Maintain',
  }

  return (
    <div className="px-4 pt-6 pb-2">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="LFG" className="w-10 h-10 object-contain rounded-full" />
          <div>
            <h1 className="text-white font-bold text-xl leading-tight">
              Welcome, {profile?.name || 'Athlete'}!
            </h1>
            {hasStarted ? (
              <p className="font-mono text-xs mt-0.5" style={{ color: '#999966' }}>
                Day {currentDay} of 14 · {dayName} · Week {weekNum}
              </p>
            ) : (
              <p className="text-[#9C9C9C] text-xs mt-0.5">Challenge starts 1 July 2026</p>
            )}
          </div>
        </div>

        {/* Personalize button */}
        <button
          onClick={onPersonalize}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all"
          style={hasPersonalized
            ? { background: 'rgba(153,153,102,0.15)', color: '#999966', border: '1px solid rgba(153,153,102,0.35)' }
            : { background: 'rgba(255,255,255,0.07)', color: '#9C9C9C', border: '1px solid rgba(255,255,255,0.1)' }
          }
        >
          <SlidersHorizontal size={13} />
          {hasPersonalized ? goalLabels[profile.goal] : 'Personalize'}
        </button>
      </div>

      {/* Macro targets summary strip */}
      {hasPersonalized && (
        <div
          className="flex items-center gap-2 flex-wrap px-1 pb-2"
        >
          {[
            { label: 'Kcal', value: profile.target_kcal, color: '#f97316' },
            { label: 'P',    value: `${profile.target_protein}g`, color: '#22d3ee' },
            { label: 'C',    value: `${profile.target_carbs}g`,   color: '#22c55e' },
            { label: 'F',    value: `${profile.target_fat}g`,     color: '#eab308' },
          ].map(m => (
            <div
              key={m.label}
              className="flex items-center gap-1 px-2 py-1 rounded-lg"
              style={{ background: `${m.color}15`, border: `1px solid ${m.color}30` }}
            >
              <span className="text-[10px] font-bold" style={{ color: m.color }}>{m.label}</span>
              <span className="text-white text-[10px] font-mono font-semibold">{m.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Workouts This Week ────────────────────────────────────────────────────────
function WorkoutsCard({ gymSessions, homeSessions }) {
  const week = currentWeek || 1
  const gymThisWeek = gymSessions.filter(s => s.week === week && s.completed)
  const homeThisWeek = homeSessions.filter(s => s.week === week && s.completed)

  // 4 gym slots (gym_day_index 1-4); fill by index
  const gymByIndex = {}
  for (const s of gymThisWeek) gymByIndex[s.gym_day_index] = true

  const totalDone = gymThisWeek.length + homeThisWeek.length
  const totalSlots = 4

  const motivations = [
    'Keep pushing — every rep counts.',
    'Consistency is your superpower.',
    'Show up. Every. Single. Day.',
    'Beast mode activated.',
  ]
  const sub = motivations[Math.min(totalDone, motivations.length - 1)]

  return (
    <div className={GLASS}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-white font-semibold text-sm">Workouts This Week</span>
        <span className="font-mono text-sm font-bold" style={{ color: '#999966' }}>
          {totalDone} of {totalSlots}
        </span>
      </div>

      {/* Four-segment bar */}
      <div className="flex gap-1.5 mb-3">
        {[1, 2, 3, 4].map(i => {
          const filled = i <= totalDone
          return (
            <div
              key={i}
              className="flex-1 h-2 rounded-full transition-all"
              style={{ background: filled ? '#999966' : 'rgba(255,255,255,0.1)' }}
            />
          )
        })}
      </div>

      <p className="text-[#9C9C9C] text-xs">{sub}</p>
    </div>
  )
}

// ── 14-Day Calendar ───────────────────────────────────────────────────────────
function CalendarCard({ gymSessions, homeSessions }) {
  const workoutMap = buildWorkoutMap(gymSessions, homeSessions)

  function DayCell({ dayIndex }) {
    const dateKey = getDayDateKey(dayIndex)
    const info = workoutMap[dateKey] || { gym: false, home: false }
    const isCurrent = dayIndex === currentDay
    const isFuture = currentDay != null && dayIndex > currentDay
    const isPast = currentDay == null || dayIndex < currentDay

    return (
      <div
        className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl transition-all ${
          isFuture ? 'opacity-30' : ''
        }`}
        style={isCurrent ? { border: '1.5px solid #999966', borderRadius: '12px' } : {}}
      >
        <span className="text-[#9C9C9C] text-[9px] uppercase">{getDayLetter(dayIndex)}</span>
        <span className="text-white text-xs font-semibold">{dayIndex}</span>
        <div className="flex gap-0.5 mt-0.5 h-2 items-center">
          {info.gym && (
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#999966' }} />
          )}
          {info.home && (
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#9333ea' }} />
          )}
          {!info.gym && !info.home && <div className="w-1.5 h-1.5" />}
        </div>
      </div>
    )
  }

  return (
    <div className={GLASS}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-white font-semibold text-sm">14-Day Calendar</span>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mb-3">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ background: '#999966' }} />
          <span className="text-[#9C9C9C] text-xs">Gym</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ background: '#9333ea' }} />
          <span className="text-[#9C9C9C] text-xs">Home</span>
        </div>
      </div>

      {/* Week 1 */}
      <p className="text-[#9C9C9C] text-[10px] uppercase tracking-widest mb-1.5">Week 1</p>
      <div className="grid grid-cols-7 gap-0.5 mb-3">
        {[1,2,3,4,5,6,7].map(d => <DayCell key={d} dayIndex={d} />)}
      </div>

      {/* Week 2 */}
      <p className="text-[#9C9C9C] text-[10px] uppercase tracking-widest mb-1.5">Week 2</p>
      <div className="grid grid-cols-7 gap-0.5">
        {[8,9,10,11,12,13,14].map(d => <DayCell key={d} dayIndex={d} />)}
      </div>
    </div>
  )
}

// ── Weight Card ───────────────────────────────────────────────────────────────
function WeightCard({ weightEntries, onOpenModal, onDelete }) {
  const entryMap = buildEntryMap(weightEntries)

  // Chart data: 14 days
  const chartData = Array.from({ length: 14 }, (_, i) => {
    const key = getDayDateKey(i + 1)
    const entry = entryMap[key]
    return { day: i + 1, weight: entry ? entry.weight_kg : null }
  })

  // Trend
  const withData = weightEntries.filter(e => e.weight_kg != null).sort((a, b) => a.date.localeCompare(b.date))
  let trend = null
  if (withData.length >= 2) {
    const change = withData[withData.length - 1].weight_kg - withData[0].weight_kg
    trend = `${change >= 0 ? '+' : ''}${change.toFixed(1)} kg`
  }

  // Weekly averages
  const w1vals = [1,2,3,4,5,6,7].map(d => entryMap[getDayDateKey(d)]?.weight_kg ?? null)
  const w2vals = [8,9,10,11,12,13,14].map(d => entryMap[getDayDateKey(d)]?.weight_kg ?? null)
  const w1avg = avg(w1vals)
  const w2avg = avg(w2vals)

  function WeekRows({ days, weekNum }) {
    const weekAvg = weekNum === 1 ? w1avg : w2avg
    return (
      <>
        <div className="flex items-center justify-between mb-1 mt-3">
          <span className="text-[#9C9C9C] text-[10px] uppercase tracking-widest">Week {weekNum}</span>
          {weekAvg != null && (
            <span className="text-[#9C9C9C] text-[10px]">avg {weekAvg.toFixed(1)} kg</span>
          )}
        </div>
        {days.map(d => {
          const key = getDayDateKey(d)
          const entry = entryMap[key]
          const isFuture = currentDay != null && d > currentDay
          return (
            <div
              key={d}
              className={`flex items-center justify-between py-2.5 border-b last:border-b-0 ${
                isFuture ? 'opacity-30 pointer-events-none' : 'cursor-pointer active:opacity-70'
              }`}
              style={{ borderColor: 'rgba(255,255,255,0.06)' }}
              onClick={() => !isFuture && onOpenModal('weight', d, entry?.weight_kg ?? null, entry?.id ?? null)}
            >
              <span className="text-[#9C9C9C] text-xs">
                D{d} · {getDayShort(d)}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-white text-sm font-mono">
                  {entry ? `${entry.weight_kg} kg` : '—'}
                </span>
                {entry ? (
                  <div className="flex items-center gap-2">
                    <Pencil size={13} className="text-[#999966]" />
                    <button
                      onClick={e => { e.stopPropagation(); onDelete('weight', entry.id) }}
                      className="text-[#9C9C9C] hover:text-red-400 transition-colors p-0.5"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ) : (
                  <Plus size={13} className="text-[#9C9C9C]" />
                )}
              </div>
            </div>
          )
        })}
      </>
    )
  }

  return (
    <div className={GLASS}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-white font-semibold text-sm">Weight</span>
        {trend && (
          <span
            className="text-xs font-mono font-bold"
            style={{ color: trend.startsWith('+') ? '#ef4444' : '#22c55e' }}
          >
            {trend}
          </span>
        )}
      </div>

      {/* Bar Chart */}
      <div className="h-36 -mx-2 mb-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
            <XAxis
              dataKey="day"
              tick={{ fill: '#9C9C9C', fontSize: 9 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fill: '#9C9C9C', fontSize: 9 }}
              tickLine={false}
              axisLine={false}
              domain={['auto', 'auto']}
            />
            <Tooltip
              contentStyle={{
                background: '#111',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#fff',
              }}
              formatter={v => v != null ? [`${v} kg`, 'Weight'] : ['—', 'Weight']}
              labelFormatter={l => `Day ${l}`}
            />
            <Bar dataKey="weight" radius={[3, 3, 0, 0]} maxBarSize={20}>
              {chartData.map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry.weight != null ? '#999966' : 'rgba(255,255,255,0.08)'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      <WeekRows days={[1,2,3,4,5,6,7]} weekNum={1} />
      <WeekRows days={[8,9,10,11,12,13,14]} weekNum={2} />
    </div>
  )
}

// ── Steps Card ────────────────────────────────────────────────────────────────
function StepsCard({ stepEntries, onOpenModal, onDelete }) {
  const entryMap = buildEntryMap(stepEntries)

  const w1vals = [1,2,3,4,5,6,7].map(d => entryMap[getDayDateKey(d)]?.steps ?? null)
  const w2vals = [8,9,10,11,12,13,14].map(d => entryMap[getDayDateKey(d)]?.steps ?? null)
  const w1total = w1vals.filter(Boolean).reduce((a, b) => a + b, 0)
  const w2total = w2vals.filter(Boolean).reduce((a, b) => a + b, 0)
  const w1avg = avg(w1vals)
  const w2avg = avg(w2vals)

  function WeekRows({ days, weekNum }) {
    const total = weekNum === 1 ? w1total : w2total
    const weekAvg = weekNum === 1 ? w1avg : w2avg
    return (
      <>
        <div className="flex items-center justify-between mb-1 mt-3">
          <span className="text-[#9C9C9C] text-[10px] uppercase tracking-widest">Week {weekNum}</span>
          <div className="flex gap-3">
            {weekAvg != null && (
              <span className="text-[#9C9C9C] text-[10px]">avg {Math.round(weekAvg).toLocaleString()}</span>
            )}
            {total > 0 && (
              <span className="text-[#9C9C9C] text-[10px]">total {total.toLocaleString()}</span>
            )}
          </div>
        </div>
        {days.map(d => {
          const key = getDayDateKey(d)
          const entry = entryMap[key]
          const isFuture = currentDay != null && d > currentDay
          return (
            <div
              key={d}
              className={`flex items-center justify-between py-2.5 border-b last:border-b-0 ${
                isFuture ? 'opacity-30 pointer-events-none' : 'cursor-pointer active:opacity-70'
              }`}
              style={{ borderColor: 'rgba(255,255,255,0.06)' }}
              onClick={() => !isFuture && onOpenModal('steps', d, entry?.steps ?? null, entry?.id ?? null)}
            >
              <span className="text-[#9C9C9C] text-xs">
                D{d} · {getDayShort(d)}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-white text-sm font-mono">
                  {entry ? entry.steps.toLocaleString() : '—'}
                </span>
                {entry ? (
                  <div className="flex items-center gap-2">
                    <Pencil size={13} className="text-[#999966]" />
                    <button
                      onClick={e => { e.stopPropagation(); onDelete('steps', entry.id) }}
                      className="text-[#9C9C9C] hover:text-red-400 transition-colors p-0.5"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ) : (
                  <Plus size={13} className="text-[#9C9C9C]" />
                )}
              </div>
            </div>
          )
        })}
      </>
    )
  }

  return (
    <div className={GLASS}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-white font-semibold text-sm">Steps</span>
      </div>
      <WeekRows days={[1,2,3,4,5,6,7]} weekNum={1} />
      <WeekRows days={[8,9,10,11,12,13,14]} weekNum={2} />
    </div>
  )
}

// ── Export Card ───────────────────────────────────────────────────────────────
function ExportCard({ session, profile }) {
  const [exporting, setExporting] = useState(false)
  const [done, setDone] = useState(false)

  async function handleExport() {
    if (exporting) return
    setExporting(true)
    setDone(false)
    try {
      await generateAndDownloadCsv(session, profile, supabase)
      setDone(true)
      setTimeout(() => setDone(false), 3000)
    } catch (e) {
      console.error('Export failed', e)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className={GLASS}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white font-semibold text-sm">Export Your Results</p>
          <p className="text-[#9C9C9C] text-xs mt-0.5">
            {done ? '✓ File ready — check your downloads' : 'Download your full 14-day data as CSV'}
          </p>
        </div>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold tracking-widest uppercase text-white transition-opacity disabled:opacity-50"
          style={{ background: done ? '#22c55e' : '#999966' }}
        >
          <Download size={13} />
          {exporting ? '…' : done ? 'Done' : 'CSV'}
        </button>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { session, profile, fetchProfile } = useAuth()
  const [gymSessions, setGymSessions]     = useState([])
  const [homeSessions, setHomeSessions]   = useState([])
  const [weightEntries, setWeightEntries] = useState([])
  const [stepEntries, setStepEntries]     = useState([])
  const [loading, setLoading]             = useState(true)
  const [modal, setModal]                 = useState(null)
  const [showPersonalize, setShowPersonalize] = useState(false)
  // modal = { type: 'weight'|'steps', dayIndex, existingValue, entryId }

  const loadData = useCallback(async () => {
    if (!session) return
    const uid = session.user.id
    const [gym, home, weight, steps] = await Promise.all([
      supabase.from('gym_sessions').select('*').eq('user_id', uid),
      supabase.from('home_sessions').select('*').eq('user_id', uid),
      supabase.from('weight_entries').select('*').eq('user_id', uid).order('date'),
      supabase.from('step_entries').select('*').eq('user_id', uid).order('date'),
    ])
    setGymSessions(gym.data || [])
    setHomeSessions(home.data || [])
    setWeightEntries(weight.data || [])
    setStepEntries(steps.data || [])
    setLoading(false)
  }, [session])

  useEffect(() => { loadData() }, [loadData])

  function openModal(type, dayIndex, existingValue, entryId) {
    setModal({ type, dayIndex, existingValue, entryId })
  }

  async function handleSave(dayIndex, value) {
    const uid = session.user.id
    const dateKey = getDayDateKey(dayIndex)

    if (modal.type === 'weight') {
      if (modal.entryId) {
        await supabase.from('weight_entries').update({ weight_kg: value }).eq('id', modal.entryId)
      } else {
        await supabase.from('weight_entries').upsert({ user_id: uid, date: dateKey, weight_kg: value }, { onConflict: 'user_id,date' })
      }
    } else {
      if (modal.entryId) {
        await supabase.from('step_entries').update({ steps: Math.round(value) }).eq('id', modal.entryId)
      } else {
        await supabase.from('step_entries').upsert({ user_id: uid, date: dateKey, steps: Math.round(value) }, { onConflict: 'user_id,date' })
      }
    }
    await loadData()
  }

  async function handleDelete(type, entryId) {
    const table = type === 'weight' ? 'weight_entries' : 'step_entries'
    await supabase.from(table).delete().eq('id', entryId)
    await loadData()
  }

  async function handleSavePersonalize(data) {
    await supabase.from('profiles').update(data).eq('id', session.user.id)
    await fetchProfile(session.user.id)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-[#9C9C9C] text-sm tracking-widest uppercase">Loading…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <Header profile={profile} onPersonalize={() => setShowPersonalize(true)} />

      <div className="flex flex-col gap-4 px-4 pb-8">
        <WorkoutsCard gymSessions={gymSessions} homeSessions={homeSessions} />
        <CalendarCard gymSessions={gymSessions} homeSessions={homeSessions} />
        <WeightCard
          weightEntries={weightEntries}
          onOpenModal={openModal}
          onDelete={handleDelete}
        />
        <StepsCard
          stepEntries={stepEntries}
          onOpenModal={openModal}
          onDelete={handleDelete}
        />
        <ExportCard session={session} profile={profile} />
      </div>

      {modal && (
        <EntryModal
          type={modal.type}
          dayIndex={modal.dayIndex}
          existingValue={modal.existingValue}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}

      {showPersonalize && (
        <PersonalizeModal
          profile={profile}
          onSave={handleSavePersonalize}
          onClose={() => setShowPersonalize(false)}
        />
      )}
    </div>
  )
}
