import { useState } from 'react'
import { X, ChevronRight, Dumbbell, TrendingDown, Minus, Armchair, Footprints, Bike, Flame } from 'lucide-react'

const ACTIVITY_LEVELS = [
  {
    id: 'sedentary',
    label: 'Sedentary',
    description: 'Desk job · little movement outside the challenge',
    icon: Armchair,
    multiplier: 1.2,
  },
  {
    id: 'lightly_active',
    label: 'Lightly Active',
    description: 'Mostly sitting but walks daily · light movement',
    icon: Footprints,
    multiplier: 1.375,
  },
  {
    id: 'moderately_active',
    label: 'Moderately Active',
    description: 'On feet a lot · active lifestyle outside work',
    icon: Bike,
    multiplier: 1.55,
  },
  {
    id: 'very_active',
    label: 'Very Active',
    description: 'Physical job · very active lifestyle',
    icon: Flame,
    multiplier: 1.725,
  },
]

const GOALS = [
  {
    id: 'muscle_building',
    label: 'Muscle Building',
    description: '+250 kcal surplus · High protein',
    icon: Dumbbell,
    color: '#999966',
  },
  {
    id: 'fat_loss',
    label: 'Fat Loss',
    description: '−300 kcal deficit · Very high protein',
    icon: TrendingDown,
    color: '#9333ea',
  },
  {
    id: 'maintain',
    label: 'Maintain',
    description: 'Maintenance calories · Balanced macros',
    icon: Minus,
    color: '#22c55e',
  },
]

// Mifflin-St Jeor BMR
function calcBMR(weight, height, age, gender) {
  if (gender === 'Female') return 10 * weight + 6.25 * height - 5 * age - 161
  return 10 * weight + 6.25 * height - 5 * age + 5
}

function calcMacros(tdee, goal, weight) {
  let kcal
  if (goal === 'muscle_building') kcal = Math.round(tdee + 250)
  else if (goal === 'fat_loss')   kcal = Math.round(tdee - 300)
  else                            kcal = Math.round(tdee)

  let proteinPerKg
  if (goal === 'muscle_building') proteinPerKg = 2.0
  else if (goal === 'fat_loss')   proteinPerKg = 2.2
  else                            proteinPerKg = 1.8

  const fatPct = goal === 'maintain' ? 0.30 : 0.25

  const protein = Math.round(proteinPerKg * weight)
  const fat     = Math.round((kcal * fatPct) / 9)
  const carbs   = Math.round((kcal - protein * 4 - fat * 9) / 4)

  return { kcal, protein, carbs, fat }
}

const STEP_TITLES = { 1: 'Your Stats', 2: 'Activity Level', 3: 'Your Goal' }

export default function PersonalizeModal({ profile, onSave, onClose }) {
  const [step,     setStep]     = useState(1)
  const [weight,   setWeight]   = useState(profile?.weight_kg      ? String(profile.weight_kg)    : '')
  const [height,   setHeight]   = useState(profile?.height_cm      ? String(profile.height_cm)    : '')
  const [bodyFat,  setBodyFat]  = useState(profile?.body_fat_pct   ? String(profile.body_fat_pct) : '')
  const [age,      setAge]      = useState(profile?.age            ? String(profile.age)          : '')
  const [activity, setActivity] = useState(profile?.activity_level || '')
  const [goal,     setGoal]     = useState(profile?.goal           || '')
  const [saving,   setSaving]   = useState(false)

  const gender = profile?.gender || 'Male'
  const step1Valid = weight && height && age

  async function handleSave() {
    if (!goal || !activity) return
    setSaving(true)

    const w   = parseFloat(weight)
    const h   = parseFloat(height)
    const a   = parseInt(age)
    const multiplier = ACTIVITY_LEVELS.find(l => l.id === activity)?.multiplier ?? 1.55
    const bmr  = calcBMR(w, h, a, gender)
    const tdee = Math.round(bmr * multiplier)
    const { kcal, protein, carbs, fat } = calcMacros(tdee, goal, w)

    await onSave({
      weight_kg:      w,
      height_cm:      h,
      body_fat_pct:   bodyFat ? parseFloat(bodyFat) : null,
      age:            a,
      activity_level: activity,
      goal,
      target_kcal:    kcal,
      target_protein: protein,
      target_carbs:   carbs,
      target_fat:     fat,
    })

    setSaving(false)
    onClose()
  }

  const inputCls  = "w-full h-11 rounded-xl px-4 text-white text-sm font-mono outline-none focus:ring-1 focus:ring-[#999966]"
  const inputStyle = { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }
  const labelCls  = "text-[#9C9C9C] text-[10px] uppercase tracking-widest mb-1.5 block"

  function OptionButton({ item, selected, onSelect, color = '#999966' }) {
    const Icon = item.icon
    return (
      <button
        onClick={() => onSelect(item.id)}
        className="w-full flex items-center gap-3 p-3.5 rounded-xl text-left transition-all"
        style={{
          background: selected ? `${color}18` : 'rgba(255,255,255,0.04)',
          border: selected ? `1.5px solid ${color}` : '1.5px solid rgba(255,255,255,0.08)',
        }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: `${color}20` }}
        >
          <Icon size={15} style={{ color }} />
        </div>
        <div>
          <p className="text-white font-semibold text-sm">{item.label}</p>
          <p className="text-[#9C9C9C] text-xs mt-0.5 leading-snug">{item.description}</p>
        </div>
      </button>
    )
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="w-full max-w-sm mx-4 mb-6 sm:mb-0 rounded-2xl overflow-hidden"
        style={{ background: '#111', border: '1px solid rgba(255,255,255,0.12)' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div>
            <p className="text-[#9C9C9C] text-[10px] uppercase tracking-widest">Step {step} of 3</p>
            <h3 className="text-white font-bold text-base mt-0.5">{STEP_TITLES[step]}</h3>
          </div>
          <button onClick={onClose} className="text-[#9C9C9C] hover:text-white p-1">
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-5">

          {/* ── Step 1: Stats ── */}
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <p className="text-[#9C9C9C] text-xs">
                Gender from your profile: <span className="text-white font-semibold">{gender}</span>
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Weight (kg)</label>
                  <input type="number" inputMode="decimal" min="30" max="250" step="0.1"
                    placeholder="75" value={weight} onChange={e => setWeight(e.target.value)}
                    className={inputCls} style={inputStyle} />
                </div>
                <div>
                  <label className={labelCls}>Height (cm)</label>
                  <input type="number" inputMode="decimal" min="100" max="250"
                    placeholder="175" value={height} onChange={e => setHeight(e.target.value)}
                    className={inputCls} style={inputStyle} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Age</label>
                  <input type="number" inputMode="numeric" min="10" max="100"
                    placeholder="28" value={age} onChange={e => setAge(e.target.value)}
                    className={inputCls} style={inputStyle} />
                </div>
                <div>
                  <label className={labelCls}>Body Fat % <span className="normal-case text-[9px]">(optional)</span></label>
                  <input type="number" inputMode="decimal" min="3" max="60" step="0.1"
                    placeholder="20" value={bodyFat} onChange={e => setBodyFat(e.target.value)}
                    className={inputCls} style={inputStyle} />
                </div>
              </div>

              <button onClick={() => setStep(2)} disabled={!step1Valid}
                className="w-full py-3 rounded-xl font-bold text-sm tracking-widest uppercase text-white flex items-center justify-center gap-2 transition-opacity disabled:opacity-40 mt-1"
                style={{ background: '#999966' }}>
                Next <ChevronRight size={15} />
              </button>
            </div>
          )}

          {/* ── Step 2: Activity Level ── */}
          {step === 2 && (
            <div className="flex flex-col gap-2.5">
              <p className="text-[#9C9C9C] text-xs mb-1">How active are you on a typical day, outside this challenge?</p>

              {ACTIVITY_LEVELS.map(level => (
                <OptionButton
                  key={level.id}
                  item={level}
                  selected={activity === level.id}
                  onSelect={setActivity}
                  color="#999966"
                />
              ))}

              <div className="flex gap-2 mt-2">
                <button onClick={() => setStep(1)}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold text-[#9C9C9C]"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  Back
                </button>
                <button onClick={() => setStep(3)} disabled={!activity}
                  className="flex-1 py-3 rounded-xl font-bold text-sm tracking-widest uppercase text-white flex items-center justify-center gap-2 transition-opacity disabled:opacity-40"
                  style={{ background: '#999966' }}>
                  Next <ChevronRight size={15} />
                </button>
              </div>
            </div>
          )}

          {/* ── Step 3: Goal ── */}
          {step === 3 && (
            <div className="flex flex-col gap-2.5">
              <p className="text-[#9C9C9C] text-xs mb-1">What is your goal for this challenge?</p>

              {GOALS.map(g => (
                <OptionButton
                  key={g.id}
                  item={g}
                  selected={goal === g.id}
                  onSelect={setGoal}
                  color={g.color}
                />
              ))}

              <div className="flex gap-2 mt-2">
                <button onClick={() => setStep(2)}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold text-[#9C9C9C]"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  Back
                </button>
                <button onClick={handleSave} disabled={!goal || saving}
                  className="flex-1 py-3 rounded-xl font-bold text-sm tracking-widest uppercase text-white transition-opacity disabled:opacity-40"
                  style={{ background: '#999966' }}>
                  {saving ? 'Saving…' : 'Calculate'}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
