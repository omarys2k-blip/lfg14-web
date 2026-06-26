import { useState } from 'react'
import { Sun, UtensilsCrossed, Moon, Apple, ChevronDown, ChevronUp, Info, Plus, Check } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const GLASS = 'bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl'

const MACRO_STYLES = {
  kcal: { bg: 'rgba(249,115,22,0.15)', color: '#f97316', label: 'KCAL', barColor: '#f97316' },
  P:    { bg: 'rgba(34,211,238,0.15)', color: '#22d3ee', label: 'P',    barColor: '#22d3ee' },
  C:    { bg: 'rgba(34,197,94,0.15)',  color: '#22c55e', label: 'C',    barColor: '#22c55e' },
  F:    { bg: 'rgba(234,179,8,0.15)',  color: '#eab308', label: 'F',    barColor: '#eab308' },
}

function MacroChip({ type, value }) {
  const s = MACRO_STYLES[type]
  if (value == null) return null
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap"
      style={{ background: s.bg, color: s.color }}
    >
      {s.label} {value}{type !== 'kcal' ? 'g' : ''}
    </span>
  )
}

function sectionIcon(name) {
  if (name === 'Breakfast') return <Sun size={15} style={{ color: '#f97316' }} />
  if (name === 'Lunch')     return <UtensilsCrossed size={15} style={{ color: '#999966' }} />
  if (name === 'Dinner')    return <Moon size={15} style={{ color: '#818cf8' }} />
  return <Apple size={15} style={{ color: '#22c55e' }} />
}

// ── Macro Progress Bar ─────────────────────────────────────────────────────────
function MacroBar({ label, current, target, color }) {
  const pct = target > 0 ? Math.min((current / target) * 100, 100) : 0
  const over = target > 0 && current > target

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color }}>{label}</span>
        <span className="text-[10px] font-mono" style={{ color: over ? '#ef4444' : '#9C9C9C' }}>
          {current} / {target}{label !== 'Kcal' ? 'g' : ''}
        </span>
      </div>
      <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${pct}%`,
            background: over ? '#ef4444' : color,
          }}
        />
      </div>
    </div>
  )
}

// ── Personalized Targets Card ─────────────────────────────────────────────────
function PersonalizedTargetsCard({ profile, selectedMacros }) {
  const goalLabels = {
    muscle_building: 'Muscle Building',
    fat_loss: 'Fat Loss',
    maintain: 'Maintain',
  }

  return (
    <div className={`${GLASS} p-4`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-white font-bold text-sm">Your Daily Targets</p>
          <p className="text-[#9C9C9C] text-[10px] mt-0.5">{goalLabels[profile.goal]} · tap meals below to track</p>
        </div>
        <div
          className="px-2.5 py-1 rounded-lg text-[10px] font-bold"
          style={{ background: 'rgba(153,153,102,0.15)', color: '#999966', border: '1px solid rgba(153,153,102,0.3)' }}
        >
          {profile.target_kcal} kcal
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <MacroBar label="Kcal"    current={selectedMacros.kcal} target={profile.target_kcal}    color="#f97316" />
        <MacroBar label="Protein" current={selectedMacros.P}    target={profile.target_protein} color="#22d3ee" />
        <MacroBar label="Carbs"   current={selectedMacros.C}    target={profile.target_carbs}   color="#22c55e" />
        <MacroBar label="Fat"     current={selectedMacros.F}    target={profile.target_fat}     color="#eab308" />
      </div>

      {selectedMacros.kcal === 0 && (
        <p className="text-[#9C9C9C] text-[10px] mt-3 text-center">
          Tap the + button on any meal below to add it to your tracker
        </p>
      )}
    </div>
  )
}

// ── Meal Card ──────────────────────────────────────────────────────────────────
function MealCard({ meal, showCook, isSelected, onToggle }) {
  const [open, setOpen] = useState(false)
  const hasInstructions = showCook && meal.instructions
  const hasMacros = !!meal.macros

  return (
    <div
      className="rounded-xl overflow-hidden transition-all"
      style={{
        border: isSelected
          ? '1.5px solid rgba(153,153,102,0.6)'
          : '1px solid rgba(255,255,255,0.08)',
        background: isSelected
          ? 'rgba(153,153,102,0.06)'
          : 'rgba(255,255,255,0.02)',
      }}
    >
      {/* Option label + add button */}
      <div className="px-3 pt-2.5 flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#999966' }}>
          {meal.option}
        </span>
        {hasMacros && onToggle && (
          <button
            onClick={onToggle}
            className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold transition-all"
            style={isSelected
              ? { background: 'rgba(153,153,102,0.2)', color: '#999966', border: '1px solid rgba(153,153,102,0.4)' }
              : { background: 'rgba(255,255,255,0.06)', color: '#9C9C9C', border: '1px solid rgba(255,255,255,0.1)' }
            }
          >
            {isSelected ? <Check size={10} /> : <Plus size={10} />}
            {isSelected ? 'Added' : 'Add'}
          </button>
        )}
      </div>

      {/* Meal name */}
      <div className="px-3 pt-1 pb-2">
        <p className="text-white font-semibold text-sm leading-snug">{meal.name}</p>
      </div>

      {/* Macro chips */}
      {meal.macros ? (
        <div className="px-3 pb-2.5 flex flex-wrap gap-1.5">
          <MacroChip type="kcal" value={meal.macros.kcal} />
          <MacroChip type="P"    value={meal.macros.P} />
          <MacroChip type="C"    value={meal.macros.C} />
          <MacroChip type="F"    value={meal.macros.F} />
        </div>
      ) : (
        <div className="px-3 pb-2.5">
          <span className="text-[#9C9C9C] text-[10px]">Macros not specified</span>
        </div>
      )}

      {/* Ingredients */}
      <div className="px-3 py-2.5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-[#9C9C9C] text-xs leading-relaxed">{meal.ingredients}</p>
      </div>

      {/* How to cook */}
      {hasInstructions && (
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button
            onClick={() => setOpen(o => !o)}
            className="w-full flex items-center justify-between px-3 py-2.5 text-left"
          >
            <span className="text-xs font-semibold" style={{ color: '#999966' }}>How to cook</span>
            {open
              ? <ChevronUp size={13} style={{ color: '#999966' }} />
              : <ChevronDown size={13} style={{ color: '#999966' }} />
            }
          </button>
          {open && (
            <div className="px-3 pb-3" style={{ background: 'rgba(153,153,102,0.04)' }}>
              <p className="text-[#9C9C9C] text-xs leading-relaxed">{meal.instructions}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Section Group ──────────────────────────────────────────────────────────────
function SectionGroup({ section, showCook, selectedMeals, onToggleMeal, hasTargets }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          {sectionIcon(section.name)}
        </div>
        <span className="text-white font-bold text-sm uppercase tracking-widest">{section.name}</span>
      </div>

      <div className="flex flex-col gap-2.5">
        {section.meals.map((meal, i) => {
          const key = `${section.name}-${i}`
          return (
            <MealCard
              key={i}
              meal={meal}
              showCook={showCook}
              isSelected={selectedMeals.has(key)}
              onToggle={hasTargets && meal.macros ? () => onToggleMeal(key, meal.macros) : null}
            />
          )
        })}
      </div>
    </div>
  )
}

// ── Day at a Glance ────────────────────────────────────────────────────────────
function DayAtAGlance({ glance }) {
  const sectionEntries = Object.entries(glance.sections)

  return (
    <div className={`${GLASS} p-4`}>
      <p className="text-white font-bold text-sm mb-3">Day at a Glance</p>

      <div className="grid grid-cols-4 gap-1.5 mb-4">
        {sectionEntries.map(([name, kcal]) => (
          <div
            key={name}
            className="flex flex-col items-center gap-1 py-2 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div className="w-5 h-5 flex items-center justify-center">{sectionIcon(name)}</div>
            <p className="text-[#9C9C9C] text-[9px] uppercase tracking-wide">{name}</p>
            <p className="text-white text-[10px] font-bold font-mono leading-tight text-center">{kcal}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
          style={{ background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.2)' }}
        >
          <span className="text-[10px] font-bold" style={{ color: '#f97316' }}>TOTAL</span>
          <span className="text-white text-xs font-bold font-mono">{glance.totalKcal} kcal</span>
        </div>
        {Object.entries(glance.macros).map(([key, val]) => (
          val !== '—' && (
            <div
              key={key}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl"
              style={{ background: MACRO_STYLES[key]?.bg, border: `1px solid ${MACRO_STYLES[key]?.color}30` }}
            >
              <span className="text-[10px] font-bold" style={{ color: MACRO_STYLES[key]?.color }}>{key}</span>
              <span className="text-white text-[10px] font-mono">{val}g</span>
            </div>
          )
        ))}
      </div>

      <div
        className="flex items-start gap-2 mt-3 px-3 py-2.5 rounded-xl"
        style={{ background: 'rgba(153,153,102,0.08)', border: '1px solid rgba(153,153,102,0.2)' }}
      >
        <Info size={12} className="shrink-0 mt-0.5" style={{ color: '#999966' }} />
        <p className="text-xs leading-relaxed" style={{ color: '#999966' }}>
          Portions are a starting point — scale them to your bodyweight and goals.
        </p>
      </div>
    </div>
  )
}

// ── Shared MealPlanPage ────────────────────────────────────────────────────────
export default function MealPlanPage({ mealPlan, showCook = false }) {
  const { profile } = useAuth()
  const hasTargets = !!profile?.goal

  // selectedMeals: Set of "SectionName-index" keys
  const [selectedMeals, setSelectedMeals] = useState(new Set())
  // selectedMacros: running totals
  const [selectedMacros, setSelectedMacros] = useState({ kcal: 0, P: 0, C: 0, F: 0 })
  // mealMacrosMap: key -> macros (so we can subtract on deselect)
  const [mealMacrosMap] = useState({})

  function toggleMeal(key, macros) {
    setSelectedMeals(prev => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
        setSelectedMacros(cur => ({
          kcal: Math.max(0, cur.kcal - (macros.kcal || 0)),
          P:    Math.max(0, cur.P    - (macros.P    || 0)),
          C:    Math.max(0, cur.C    - (macros.C    || 0)),
          F:    Math.max(0, cur.F    - (macros.F    || 0)),
        }))
      } else {
        next.add(key)
        setSelectedMacros(cur => ({
          kcal: cur.kcal + (macros.kcal || 0),
          P:    cur.P    + (macros.P    || 0),
          C:    cur.C    + (macros.C    || 0),
          F:    cur.F    + (macros.F    || 0),
        }))
      }
      return next
    })
  }

  return (
    <div className="min-h-screen bg-black px-4 pt-6 pb-8">
      <h1 className="text-white font-bold text-xl mb-1">{mealPlan.title}</h1>
      <p className="text-[#9C9C9C] text-xs mb-5">Pick one option per meal · mix and match</p>

      <div className="flex flex-col gap-5">
        {/* Personalized targets — only shown if user has personalized */}
        {hasTargets && (
          <PersonalizedTargetsCard
            profile={profile}
            selectedMacros={selectedMacros}
          />
        )}

        <DayAtAGlance glance={mealPlan.glance} />

        {mealPlan.sections.map((section, i) => (
          <SectionGroup
            key={i}
            section={section}
            showCook={showCook}
            selectedMeals={selectedMeals}
            onToggleMeal={toggleMeal}
            hasTargets={hasTargets}
          />
        ))}
      </div>
    </div>
  )
}
