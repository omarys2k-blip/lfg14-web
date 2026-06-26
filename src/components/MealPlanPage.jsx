import { useState } from 'react'
import { Sun, UtensilsCrossed, Moon, Apple, ChevronDown, ChevronUp, Info } from 'lucide-react'

const GLASS = 'bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl'

// Macro chip colours
const MACRO_STYLES = {
  kcal: { bg: 'rgba(249,115,22,0.15)', color: '#f97316', label: 'KCAL' },
  P:    { bg: 'rgba(34,211,238,0.15)', color: '#22d3ee', label: 'P'    },
  C:    { bg: 'rgba(34,197,94,0.15)',  color: '#22c55e', label: 'C'    },
  F:    { bg: 'rgba(234,179,8,0.15)',  color: '#eab308', label: 'F'    },
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
  const cls = 'shrink-0'
  if (name === 'Breakfast') return <Sun size={15} className={cls} style={{ color: '#f97316' }} />
  if (name === 'Lunch')     return <UtensilsCrossed size={15} className={cls} style={{ color: '#999966' }} />
  if (name === 'Dinner')    return <Moon size={15} className={cls} style={{ color: '#818cf8' }} />
  return <Apple size={15} className={cls} style={{ color: '#22c55e' }} />
}

// ── Meal Card ──────────────────────────────────────────────────────────────────
function MealCard({ meal, showCook }) {
  const [open, setOpen] = useState(false)
  const hasInstructions = showCook && meal.instructions

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}
    >
      {/* Option label */}
      <div
        className="px-3 pt-2.5 pb-0"
      >
        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#999966' }}>
          {meal.option}
        </span>
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
      <div
        className="px-3 py-2.5"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <p className="text-[#9C9C9C] text-xs leading-relaxed">{meal.ingredients}</p>
      </div>

      {/* How to cook (collapsible) */}
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
            <div
              className="px-3 pb-3"
              style={{ background: 'rgba(153,153,102,0.04)' }}
            >
              <p className="text-[#9C9C9C] text-xs leading-relaxed">{meal.instructions}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Section Group ──────────────────────────────────────────────────────────────
function SectionGroup({ section, showCook }) {
  return (
    <div>
      {/* Section header */}
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
        {section.meals.map((meal, i) => (
          <MealCard key={i} meal={meal} showCook={showCook} />
        ))}
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

      {/* Per-section kcal strip */}
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

      {/* Total + macros */}
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

      {/* Portion notice */}
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
  return (
    <div className="min-h-screen bg-black px-4 pt-6 pb-8">
      <h1 className="text-white font-bold text-xl mb-1">{mealPlan.title}</h1>
      <p className="text-[#9C9C9C] text-xs mb-5">Pick one option per meal · mix and match</p>

      <div className="flex flex-col gap-5">
        <DayAtAGlance glance={mealPlan.glance} />

        {mealPlan.sections.map((section, i) => (
          <SectionGroup key={i} section={section} showCook={showCook} />
        ))}
      </div>
    </div>
  )
}
