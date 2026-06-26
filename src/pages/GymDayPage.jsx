import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, X, ChevronUp, ChevronDown } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { GYM_PLAN } from '../data/gymPlan'

const GLASS = 'bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl'

// ── Helpers ───────────────────────────────────────────────────────────────────
function calcVolume(sets) {
  return sets.reduce((sum, s) => {
    const w = parseFloat(s.weight) || 0
    const r = parseInt(s.reps) || 0
    return sum + w * r
  }, 0)
}

// ── Exercise Card ─────────────────────────────────────────────────────────────
function ExerciseCard({ exercise, planEx, setLogs, inputValues, onChange, onClear, w1SetLogs, w1Inputs }) {
  const sets = setLogs.sort((a, b) => a.set_number - b.set_number)
  const totalVol = calcVolume(sets.map(sl => inputValues[sl.id] || { weight: '0', reps: '0' }))

  // W1 reference: find matching set by set_number
  const showRef = w1SetLogs && w1SetLogs.length > 0

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}
    >
      {/* Exercise header */}
      <div
        className="px-3 py-2.5 flex items-center justify-between"
        style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div>
          <p className="text-white font-semibold text-sm leading-tight">{exercise.exercise_name}</p>
          <p className="text-[#9C9C9C] text-[11px] mt-0.5">
            {planEx?.sets ?? 3} sets · {planEx?.reps} reps · {planEx?.rest}s rest
          </p>
        </div>
        {totalVol > 0 && (
          <div className="text-right">
            <p className="text-[10px] text-[#9C9C9C]">Volume</p>
            <p className="font-mono font-bold text-sm" style={{ color: '#999966' }}>{totalVol} kg</p>
          </div>
        )}
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-[40px_1fr_1fr_1fr] gap-2 px-3 py-1.5"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <p className="text-[10px] text-[#9C9C9C] font-semibold uppercase tracking-wide"></p>
        <p className="text-[10px] text-[#9C9C9C] font-semibold uppercase tracking-wide text-center">Weight (kg)</p>
        <p className="text-[10px] text-[#9C9C9C] font-semibold uppercase tracking-wide text-center">Reps</p>
        <p className="text-[10px] text-[#9C9C9C] font-semibold uppercase tracking-wide text-center">Vol</p>
      </div>

      {/* Set rows */}
      <div className="px-3 py-1">
        {sets.map((sl, i) => {
          const vals = inputValues[sl.id] || { weight: '0', reps: '0' }
          const w = parseFloat(vals.weight) || 0
          const r = parseInt(vals.reps) || 0
          const hasData = w > 0 || r > 0
          const setVol = w * r

          // W1 reference for this set number
          const w1Sl = showRef ? w1SetLogs.find(s => s.set_number === sl.set_number) : null
          const w1Vals = w1Sl ? (w1Inputs?.[w1Sl.id] || { weight: '0', reps: '0' }) : null
          const w1W = w1Vals ? parseFloat(w1Vals.weight) || 0 : 0
          const w1R = w1Vals ? parseInt(w1Vals.reps) || 0 : 0

          return (
            <div key={sl.id}>
              {/* W1 reference row */}
              {showRef && (
                <div className="grid grid-cols-[40px_1fr_1fr_1fr] gap-2 items-center py-0.5">
                  <p className="text-[9px] font-semibold" style={{ color: 'rgba(153,153,102,0.55)' }}>W1</p>
                  <p className="text-[10px] font-mono text-center" style={{ color: 'rgba(153,153,102,0.55)' }}>
                    {w1W > 0 ? w1W : '—'}
                  </p>
                  <p className="text-[10px] font-mono text-center" style={{ color: 'rgba(153,153,102,0.55)' }}>
                    {w1R > 0 ? w1R : '—'}
                  </p>
                  <p className="text-[10px] font-mono text-center" style={{ color: 'rgba(153,153,102,0.55)' }}>
                    {w1W * w1R > 0 ? w1W * w1R : '—'}
                  </p>
                </div>
              )}

              {/* Input row */}
              <div className="grid grid-cols-[40px_1fr_1fr_1fr] gap-2 items-center py-1.5"
                style={{ borderBottom: i < sets.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                {/* Set label + clear */}
                <div className="flex items-center gap-1">
                  <span
                    className="text-xs font-bold w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(153,153,102,0.15)', color: '#999966' }}
                  >
                    {i + 1}
                  </span>
                  {hasData && (
                    <button
                      onClick={() => onClear(sl.id)}
                      className="text-[#9C9C9C] hover:text-red-400 transition-colors"
                    >
                      <X size={10} />
                    </button>
                  )}
                </div>

                {/* Weight input */}
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.5"
                  value={w || ''}
                  placeholder="0"
                  onChange={e => onChange(sl.id, 'weight', e.target.value)}
                  className="w-full h-9 rounded-lg text-center text-white text-sm font-mono outline-none focus:ring-1 focus:ring-[#999966]"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
                />

                {/* Reps input */}
                <input
                  type="number"
                  inputMode="numeric"
                  min="0"
                  value={r || ''}
                  placeholder="0"
                  onChange={e => onChange(sl.id, 'reps', e.target.value)}
                  className="w-full h-9 rounded-lg text-center text-white text-sm font-mono outline-none focus:ring-1 focus:ring-[#999966]"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
                />

                {/* Set volume */}
                <p className="text-center font-mono text-xs" style={{ color: setVol > 0 ? '#999966' : '#9C9C9C' }}>
                  {setVol > 0 ? setVol : '—'}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Progress Review Panel ─────────────────────────────────────────────────────
function ProgressReview({ w1Logs, w1Inputs, w2Logs, w2Inputs }) {
  if (!w1Logs || w1Logs.length === 0) return null

  function getExVol(exLog, inputs) {
    const sets = exLog.set_logs.map(sl => inputs?.[sl.id] || { weight: '0', reps: '0' })
    return calcVolume(sets)
  }

  const exercises = w1Logs.map(w1Ex => {
    const w2Ex = w2Logs?.find(e => e.exercise_name === w1Ex.exercise_name)
    const v1 = getExVol(w1Ex, w1Inputs)
    const v2 = w2Ex ? getExVol(w2Ex, w2Inputs) : 0

    let verdict, chip, chipStyle
    if (v2 === 0) {
      verdict = 'No data'; chip = '— No data'
      chipStyle = { background: 'rgba(255,255,255,0.06)', color: '#9C9C9C' }
    } else if (v2 > v1) {
      verdict = 'Improved'; chip = '↑ Improved'
      chipStyle = { background: 'rgba(34,197,94,0.15)', color: '#22c55e' }
    } else if (v2 === v1) {
      verdict = 'Maintained'; chip = '→ Maintained'
      chipStyle = { background: 'rgba(234,179,8,0.15)', color: '#eab308' }
    } else {
      verdict = 'Declined'; chip = '↓ Declined'
      chipStyle = { background: 'rgba(239,68,68,0.15)', color: '#ef4444' }
    }

    return { name: w1Ex.exercise_name, v1, v2, verdict, chip, chipStyle }
  })

  const w2Total = w2Logs
    ? w2Logs.reduce((sum, ex) => sum + getExVol(ex, w2Inputs), 0)
    : 0
  const isComplete = w2Total > 0

  const counts = {
    improved: exercises.filter(e => e.verdict === 'Improved').length,
    maintained: exercises.filter(e => e.verdict === 'Maintained').length,
    declined: exercises.filter(e => e.verdict === 'Declined').length,
  }

  return (
    <div className={`${GLASS} p-4`}>
      <h3 className="text-white font-bold text-sm mb-3">Progress Review</h3>

      {!isComplete ? (
        <p className="text-[#9C9C9C] text-xs leading-relaxed">
          Progression results will be displayed after tracking ALL Week 2 workouts!
        </p>
      ) : (
        <>
          {/* Summary chips */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>
              {counts.improved} Improved
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(234,179,8,0.15)', color: '#eab308' }}>
              {counts.maintained} Maintained
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>
              {counts.declined} Declined
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.05)', color: '#9C9C9C' }}>
              of {exercises.length} exercises
            </span>
          </div>

          {counts.improved > 0 && (
            <p className="text-white text-xs mb-4 leading-relaxed">
              Congrats! You progressively overloaded in:{' '}
              <span style={{ color: '#999966' }}>
                {exercises.filter(e => e.verdict === 'Improved').map(e => e.name).join(', ')}
              </span>. Your total training volume increased from last week!
            </p>
          )}

          <div className="flex flex-col gap-0">
            {exercises.map((ex, i) => (
              <div
                key={ex.name}
                className="flex items-center justify-between gap-3 py-2.5"
                style={{ borderBottom: i < exercises.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}
              >
                <span className="text-white text-xs flex-1 min-w-0 truncate">{ex.name}</span>
                <span className="text-[#9C9C9C] text-xs font-mono whitespace-nowrap shrink-0">
                  {ex.v1} → {ex.v2} kg
                </span>
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap shrink-0"
                  style={ex.chipStyle}
                >
                  {ex.chip}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ── Week Block ────────────────────────────────────────────────────────────────
function WeekBlock({ week, session, exerciseLogs, inputValues, onChange, onClear, onStart, onToggleComplete, starting, w1Logs, w1Inputs, planExercises }) {
  const started = !!session
  const completed = session?.completed ?? false
  const [expanded, setExpanded] = useState(true)

  return (
    <div className={`${GLASS} p-4`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-bold text-base">Week {week}</h2>
        <div className="flex items-center gap-2">
          {started && (
            <button
              onClick={onToggleComplete}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
              style={completed
                ? { background: 'rgba(153,153,102,0.2)', color: '#999966', border: '1px solid rgba(153,153,102,0.4)' }
                : { background: 'rgba(255,255,255,0.06)', color: '#9C9C9C', border: '1px solid rgba(255,255,255,0.1)' }
              }
            >
              <CheckCircle2 size={13} />
              {completed ? '✓ Complete' : 'Mark Complete'}
            </button>
          )}
          {started && (
            <button
              onClick={() => setExpanded(e => !e)}
              className="w-8 h-8 flex items-center justify-center rounded-xl text-[#9C9C9C] hover:text-white transition-colors"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          )}
        </div>
      </div>

      {!started ? (
        <button
          onClick={onStart}
          disabled={starting}
          className="w-full py-3 rounded-xl font-bold text-sm tracking-widest uppercase text-white transition-opacity disabled:opacity-60"
          style={{ background: '#999966' }}
        >
          {starting ? 'Starting…' : `Start Week ${week}`}
        </button>
      ) : !expanded ? (
        <button
          onClick={() => setExpanded(true)}
          className="w-full py-2.5 rounded-xl text-xs font-semibold text-[#9C9C9C] flex items-center justify-center gap-2 transition-opacity active:opacity-70"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <ChevronDown size={14} />
          Tap to expand workout
        </button>
      ) : (
        <div className="flex flex-col gap-3">
          {exerciseLogs.map(ex => {
            const planEx = planExercises?.find(p => p.name === ex.exercise_name)
            // W1 set logs for reference (Week 2 only)
            const w1Ex = week === 2 && w1Logs ? w1Logs.find(e => e.exercise_name === ex.exercise_name) : null

            return (
              <ExerciseCard
                key={ex.id}
                exercise={ex}
                planEx={planEx}
                setLogs={ex.set_logs || []}
                inputValues={inputValues}
                onChange={onChange}
                onClear={onClear}
                w1SetLogs={w1Ex?.set_logs || null}
                w1Inputs={week === 2 ? w1Inputs : null}
              />
            )
          })}

          {/* Total volume footer */}
          {exerciseLogs.length > 0 && (
            <div
              className="flex items-center justify-between px-3 py-2.5 rounded-xl"
              style={{ background: 'rgba(153,153,102,0.08)', border: '1px solid rgba(153,153,102,0.2)' }}
            >
              <span className="text-[#9C9C9C] text-xs font-semibold uppercase tracking-wide">Total Volume</span>
              <span className="font-mono font-bold text-sm" style={{ color: '#999966' }}>
                {exerciseLogs.reduce((sum, ex) => {
                  const sets = (ex.set_logs || []).map(sl => inputValues[sl.id] || { weight: '0', reps: '0' })
                  return sum + calcVolume(sets)
                }, 0)} kg
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function GymDayPage() {
  const { dayIndex: dayIndexParam } = useParams()
  const dayIndex = parseInt(dayIndexParam)
  const navigate = useNavigate()
  const { session } = useAuth()

  const plan = GYM_PLAN[dayIndex - 1]

  const [sessions, setSessions] = useState({ 1: null, 2: null })
  const [exerciseLogs, setExerciseLogs] = useState({ 1: [], 2: [] })
  const [inputValues, setInputValues] = useState({ 1: {}, 2: {} })
  const [loading, setLoading] = useState(true)
  const [starting, setStarting] = useState({ 1: false, 2: false })

  const inputValuesRef = useRef({ 1: {}, 2: {} })
  const debounceTimers = useRef({})

  const loadData = useCallback(async () => {
    if (!session || !plan) return
    const uid = session.user.id

    const { data: sessRows } = await supabase
      .from('gym_sessions')
      .select('*')
      .eq('user_id', uid)
      .eq('gym_day_index', dayIndex)

    const newSessions = { 1: null, 2: null }
    const newExerciseLogs = { 1: [], 2: [] }
    const newInputValues = { 1: {}, 2: {} }

    for (const sess of sessRows || []) {
      newSessions[sess.week] = sess

      const { data: exRows } = await supabase
        .from('exercise_logs')
        .select('*, set_logs(*)')
        .eq('gym_session_id', sess.id)
        .order('order')

      for (const ex of exRows || []) {
        ex.set_logs = (ex.set_logs || []).sort((a, b) => a.set_number - b.set_number)
        for (const sl of ex.set_logs) {
          newInputValues[sess.week][sl.id] = {
            weight: String(sl.weight_kg ?? 0),
            reps: String(sl.reps ?? 0),
          }
        }
      }
      newExerciseLogs[sess.week] = exRows || []
    }

    setSessions(newSessions)
    setExerciseLogs(newExerciseLogs)
    setInputValues(newInputValues)
    inputValuesRef.current = newInputValues
    setLoading(false)
  }, [session, dayIndex, plan])

  useEffect(() => { loadData() }, [loadData])

  async function handleStart(week) {
    if (!session || !plan) return
    setStarting(prev => ({ ...prev, [week]: true }))
    const uid = session.user.id
    const today = new Date().toISOString().split('T')[0]

    const { data: gymSess } = await supabase
      .from('gym_sessions')
      .insert({ user_id: uid, date: today, day_label: plan.label, gym_day_index: dayIndex, week, completed: false })
      .select()
      .single()

    for (let i = 0; i < plan.exercises.length; i++) {
      const ex = plan.exercises[i]
      const { data: exLog } = await supabase
        .from('exercise_logs')
        .insert({ gym_session_id: gymSess.id, exercise_name: ex.name, order: i + 1 })
        .select()
        .single()

      await supabase.from('set_logs').insert([
        { exercise_log_id: exLog.id, set_number: 1, weight_kg: 0, reps: 0 },
        { exercise_log_id: exLog.id, set_number: 2, weight_kg: 0, reps: 0 },
        { exercise_log_id: exLog.id, set_number: 3, weight_kg: 0, reps: 0 },
      ])
    }

    await loadData()
    setStarting(prev => ({ ...prev, [week]: false }))
  }

  async function handleToggleComplete(week) {
    const sess = sessions[week]
    if (!sess) return
    const newVal = !sess.completed
    await supabase.from('gym_sessions').update({ completed: newVal }).eq('id', sess.id)
    setSessions(prev => ({ ...prev, [week]: { ...sess, completed: newVal } }))
  }

  function handleChange(week, setLogId, field, rawValue) {
    const updated = {
      ...inputValuesRef.current[week],
      [setLogId]: { ...(inputValuesRef.current[week][setLogId] || { weight: '0', reps: '0' }), [field]: rawValue },
    }
    inputValuesRef.current = { ...inputValuesRef.current, [week]: updated }
    setInputValues(prev => ({ ...prev, [week]: updated }))

    clearTimeout(debounceTimers.current[setLogId])
    debounceTimers.current[setLogId] = setTimeout(async () => {
      const vals = inputValuesRef.current[week][setLogId] || { weight: '0', reps: '0' }
      await supabase
        .from('set_logs')
        .update({ weight_kg: parseFloat(vals.weight) || 0, reps: parseInt(vals.reps) || 0 })
        .eq('id', setLogId)
    }, 500)
  }

  async function handleClear(week, setLogId) {
    const updated = {
      ...inputValuesRef.current[week],
      [setLogId]: { weight: '0', reps: '0' },
    }
    inputValuesRef.current = { ...inputValuesRef.current, [week]: updated }
    setInputValues(prev => ({ ...prev, [week]: updated }))
    await supabase.from('set_logs').update({ weight_kg: 0, reps: 0 }).eq('id', setLogId)
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-red-400 text-sm">Invalid day.</p>
      </div>
    )
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
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 pt-6 pb-4">
        <button onClick={() => navigate('/gym')} className="text-[#9C9C9C] hover:text-white transition-colors p-1 -ml-1">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-white font-bold text-lg leading-tight">Day {dayIndex} — {plan.label}</h1>
          <p className="text-[#9C9C9C] text-xs">{plan.exercises.length} exercises · 3 sets each</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 px-4 pb-8">
        <WeekBlock
          week={1}
          session={sessions[1]}
          exerciseLogs={exerciseLogs[1]}
          inputValues={inputValues[1]}
          onChange={(id, field, val) => handleChange(1, id, field, val)}
          onClear={id => handleClear(1, id)}
          onStart={() => handleStart(1)}
          onToggleComplete={() => handleToggleComplete(1)}
          starting={starting[1]}
          planExercises={plan.exercises}
        />

        <WeekBlock
          week={2}
          session={sessions[2]}
          exerciseLogs={exerciseLogs[2]}
          inputValues={inputValues[2]}
          onChange={(id, field, val) => handleChange(2, id, field, val)}
          onClear={id => handleClear(2, id)}
          onStart={() => handleStart(2)}
          onToggleComplete={() => handleToggleComplete(2)}
          starting={starting[2]}
          w1Logs={exerciseLogs[1]}
          w1Inputs={inputValues[1]}
          planExercises={plan.exercises}
        />

        <ProgressReview
          w1Logs={exerciseLogs[1]}
          w1Inputs={inputValues[1]}
          w2Logs={exerciseLogs[2]}
          w2Inputs={inputValues[2]}
        />
      </div>
    </div>
  )
}
