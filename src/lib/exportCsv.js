import { GYM_PLAN } from '../data/gymPlan'
import { toLocalDateKey } from './cohortClock'

// Escape a CSV cell value
function esc(val) {
  if (val == null) return ''
  const s = String(val)
  return s.includes(',') || s.includes('"') || s.includes('\n')
    ? `"${s.replace(/"/g, '""')}"`
    : s
}

function row(...cols) {
  return cols.map(esc).join(',') + '\n'
}

function blank() {
  return '\n'
}

function setsStr(setLogs) {
  if (!setLogs || !setLogs.length) return '—'
  return setLogs.map(sl => `${sl.weight_kg}×${sl.reps}`).join(' | ')
}

function totalVol(setLogs) {
  if (!setLogs) return 0
  return setLogs.reduce((sum, sl) => sum + (sl.weight_kg || 0) * (sl.reps || 0), 0)
}

export async function generateAndDownloadCsv(session, profile, supabase) {
  const uid = session.user.id
  const today = toLocalDateKey(new Date())
  const safeName = (profile?.name || 'User').replace(/\s+/g, '_')
  const filename = `LFG14_${safeName}_${today}.csv`

  // ── Fetch all data in parallel ────────────────────────────────────────────
  const [
    { data: weightEntries },
    { data: stepEntries },
    { data: gymSessions },
    { data: homeSessions },
  ] = await Promise.all([
    supabase.from('weight_entries').select('*').eq('user_id', uid).order('date'),
    supabase.from('step_entries').select('*').eq('user_id', uid).order('date'),
    supabase.from('gym_sessions').select('*').eq('user_id', uid).order('date'),
    supabase.from('home_sessions').select('*').eq('user_id', uid),
  ])

  const gymRows   = gymSessions  || []
  const homeRows  = homeSessions || []
  const weightRows = weightEntries || []
  const stepRows  = stepEntries  || []

  // Fetch exercise logs + set logs for all gym sessions
  const exLogsBySession = {}
  if (gymRows.length > 0) {
    const { data: exLogs } = await supabase
      .from('exercise_logs')
      .select('*, set_logs(*)')
      .in('gym_session_id', gymRows.map(s => s.id))
      .order('order')

    for (const ex of exLogs || []) {
      ex.set_logs = (ex.set_logs || []).sort((a, b) => a.set_number - b.set_number)
      if (!exLogsBySession[ex.gym_session_id]) exLogsBySession[ex.gym_session_id] = []
      exLogsBySession[ex.gym_session_id].push(ex)
    }
  }

  // ── Section A values ──────────────────────────────────────────────────────
  const avgSteps = stepRows.length
    ? Math.round(stepRows.reduce((s, e) => s + e.steps, 0) / stepRows.length)
    : null

  const gymCompleted  = gymRows.filter(s => s.completed).length
  const homeCompleted = homeRows.filter(s => s.completed).length
  const totalWorkouts = gymCompleted + homeCompleted

  const startWeight  = weightRows[0]?.weight_kg ?? null
  const endWeight    = weightRows[weightRows.length - 1]?.weight_kg ?? null
  const weightChange = startWeight != null && endWeight != null
    ? (endWeight - startWeight).toFixed(1)
    : null

  // ── Section B: progressive overload per exercise ──────────────────────────
  // Build day+week session lookup
  const sessionByDayWeek = {}
  for (const s of gymRows) {
    if (!sessionByDayWeek[s.gym_day_index]) sessionByDayWeek[s.gym_day_index] = {}
    sessionByDayWeek[s.gym_day_index][s.week] = s
  }

  let totalImproved = 0
  const totalExercises = GYM_PLAN.reduce((n, d) => n + d.exercises.length, 0)

  const dayAnalysis = GYM_PLAN.map(day => {
    const w1Sess = sessionByDayWeek[day.gymDayIndex]?.[1]
    const w2Sess = sessionByDayWeek[day.gymDayIndex]?.[2]
    const w1Logs = w1Sess ? (exLogsBySession[w1Sess.id] || []) : []
    const w2Logs = w2Sess ? (exLogsBySession[w2Sess.id] || []) : []

    let dayImproved = 0

    const exercises = day.exercises.map(planEx => {
      const w1Ex = w1Logs.find(e => e.exercise_name === planEx.name)
      const w2Ex = w2Logs.find(e => e.exercise_name === planEx.name)
      const v1 = totalVol(w1Ex?.set_logs)
      const v2 = totalVol(w2Ex?.set_logs)

      let verdict
      if (!w2Ex || v2 === 0)  verdict = 'Not enough data'
      else if (v2 > v1)       { verdict = 'Improved'; dayImproved++; totalImproved++ }
      else if (v2 === v1)     verdict = 'Maintained'
      else                    verdict = 'Declined'

      return {
        name: planEx.name,
        w1Str: setsStr(w1Ex?.set_logs),
        v1: v1 || '—',
        w2Str: setsStr(w2Ex?.set_logs),
        v2: v2 || '—',
        verdict,
      }
    })

    let congrats
    if (dayImproved === day.exercises.length && dayImproved > 0)
      congrats = 'Outstanding! You improved every exercise this session.'
    else if (dayImproved > 0)
      congrats = `Well done! You improved ${dayImproved} of ${day.exercises.length} exercises.`
    else
      congrats = 'Keep pushing — progressive overload comes with consistency.'

    return { day, exercises, dayImproved, congrats }
  })

  // ── Build CSV string ──────────────────────────────────────────────────────
  let csv = ''

  // File header
  csv += row('LFG14 CHALLENGE — RESULTS EXPORT')
  csv += blank()
  csv += row('Name',        profile?.name   || '')
  csv += row('Email',       profile?.email  || session.user.email || '')
  csv += row('Gender',      profile?.gender || '')
  csv += row('Export Date', today)
  csv += blank()

  // SECTION A
  csv += row('SECTION A — SUMMARY')
  csv += blank()
  csv += row('Metric', 'Value')
  csv += row('Average Daily Steps',       avgSteps != null ? avgSteps.toLocaleString() : '—')
  csv += row('Total Workouts Completed',  totalWorkouts)
  csv += row('  Gym Sessions Completed',  gymCompleted)
  csv += row('  Home Sessions Completed', homeCompleted)
  csv += row('Start Weight (kg)',         startWeight  ?? '—')
  csv += row('End Weight (kg)',           endWeight    ?? '—')
  if (weightChange != null) {
    csv += row('Weight Change (kg)', parseFloat(weightChange) >= 0 ? `+${weightChange}` : weightChange)
  } else {
    csv += row('Weight Change (kg)', '—')
  }
  csv += blank()

  // SECTION B
  csv += row('SECTION B — PROGRESSIVE OVERLOAD ANALYSIS')
  csv += blank()
  csv += row(`Progressed in ${totalImproved} of ${totalExercises} exercises.`)
  csv += blank()

  for (const { day, exercises, congrats } of dayAnalysis) {
    csv += row(`Day ${day.gymDayIndex} — ${day.label}`)
    csv += row('Exercise', 'W1 Sets', 'W1 Volume (kg)', 'W2 Sets', 'W2 Volume (kg)', 'Verdict')
    for (const ex of exercises) {
      csv += row(ex.name, ex.w1Str, ex.v1, ex.w2Str, ex.v2, ex.verdict)
    }
    csv += row('', congrats)
    csv += blank()
  }

  // ── Trigger download ──────────────────────────────────────────────────────
  // iOS Safari doesn't support the `download` attribute, so we open a data URI
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)

  if (isIOS) {
    const dataUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv)
    window.open(dataUri, '_blank')
  } else {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
}
