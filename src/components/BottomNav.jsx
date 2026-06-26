import { NavLink } from 'react-router-dom'
import { Home, Dumbbell, PersonStanding, Utensils, ShoppingCart } from 'lucide-react'

const tabs = [
  { to: '/',             icon: Home,            label: 'Dashboard' },
  { to: '/gym',          icon: Dumbbell,        label: 'Gym' },
  { to: '/home-workout', icon: PersonStanding,  label: 'Home' },
  { to: '/meals',        icon: Utensils,        label: 'Home Meals' },
  { to: '/spinneys',     icon: ShoppingCart,    label: 'Spinneys' },
]

export default function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 pb-safe"
      style={{
        background: 'rgba(0,0,0,0.92)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(20px)',
        height: '64px',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      {tabs.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 flex-1 py-1 transition-colors ${
              isActive ? 'text-[#999966]' : 'text-[#9C9C9C]'
            }`
          }
        >
          <Icon size={22} strokeWidth={1.8} />
          <span className="text-[10px] tracking-wide">{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
