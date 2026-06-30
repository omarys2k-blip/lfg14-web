import { useState } from 'react'
import { X, LogOut, AlertTriangle } from 'lucide-react'

export default function LogoutModal({ onConfirm, onClose }) {
  const [confirmed, setConfirmed] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  async function handleFinalConfirm() {
    setLoggingOut(true)
    await onConfirm()
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
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
        >
          <h3 className="text-white font-bold text-base">
            {confirmed ? 'Confirm Log Out' : 'Log Out'}
          </h3>
          <button onClick={onClose} className="text-[#9C9C9C] hover:text-white p-1">
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-6 flex flex-col items-center text-center">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
            style={{ background: 'rgba(239,68,68,0.12)' }}
          >
            <AlertTriangle size={22} style={{ color: '#ef4444' }} />
          </div>

          {!confirmed ? (
            <>
              <p className="text-white font-semibold text-sm mb-1">Are you sure you want to log out?</p>
              <p className="text-[#9C9C9C] text-xs leading-relaxed mb-6">
                Don't worry — all your data is saved. You can log back in anytime and pick up right where you left off.
              </p>
              <div className="flex gap-2 w-full">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold text-[#9C9C9C]"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => setConfirmed(true)}
                  className="flex-1 py-3 rounded-xl font-bold text-sm text-white"
                  style={{ background: '#ef4444' }}
                >
                  Yes
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-white font-semibold text-sm mb-1">This will end your session</p>
              <p className="text-[#9C9C9C] text-xs leading-relaxed mb-6">
                You'll need to log in again with your email and password to continue.
              </p>
              <div className="flex gap-2 w-full">
                <button
                  onClick={onClose}
                  disabled={loggingOut}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold text-[#9C9C9C] disabled:opacity-40"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleFinalConfirm}
                  disabled={loggingOut}
                  className="flex-1 py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 disabled:opacity-60"
                  style={{ background: '#ef4444' }}
                >
                  <LogOut size={14} />
                  {loggingOut ? 'Logging out…' : 'Confirm Log Out'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
