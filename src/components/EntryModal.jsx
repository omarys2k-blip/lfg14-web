import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { getDayShort } from '../lib/cohortClock'

export default function EntryModal({ dayIndex, type, existingValue, onSave, onClose }) {
  const [value, setValue] = useState(existingValue != null ? String(existingValue) : '')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    // prevent background scroll
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  async function handleSave() {
    const num = parseFloat(value)
    if (isNaN(num) || num <= 0) return
    setSaving(true)
    await onSave(dayIndex, num)
    setSaving(false)
    onClose()
  }

  const isWeight = type === 'weight'
  const label = isWeight ? 'Weight (kg)' : 'Steps'
  const placeholder = isWeight ? '75.5' : '8000'
  const dayName = getDayShort(dayIndex)

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="w-full max-w-sm mx-4 mb-6 sm:mb-0 rounded-2xl p-6"
        style={{
          background: '#111',
          border: '1px solid rgba(255,255,255,0.12)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-[#9C9C9C] text-xs uppercase tracking-widest">
              Day {dayIndex} · {dayName}
            </p>
            <h3 className="text-white font-bold text-lg mt-0.5">
              {existingValue != null ? 'Edit' : 'Log'} {isWeight ? 'Weight' : 'Steps'}
            </h3>
          </div>
          <button onClick={onClose} className="text-[#9C9C9C] hover:text-white p-1">
            <X size={20} />
          </button>
        </div>

        {/* Input */}
        <input
          type="number"
          inputMode={isWeight ? 'decimal' : 'numeric'}
          step={isWeight ? '0.1' : '1'}
          min="0"
          placeholder={placeholder}
          value={value}
          onChange={e => setValue(e.target.value)}
          autoFocus
          className="w-full rounded-xl px-4 py-4 text-white text-3xl font-bold text-center outline-none focus:ring-2 focus:ring-[#999966] mb-5"
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
        />

        <button
          onClick={handleSave}
          disabled={saving || !value}
          className="w-full py-3 rounded-xl font-bold text-sm tracking-widest uppercase text-white transition-opacity disabled:opacity-40"
          style={{ background: '#999966' }}
        >
          {saving ? 'Saving…' : existingValue != null ? 'Update' : 'Save'}
        </button>
      </div>
    </div>
  )
}
