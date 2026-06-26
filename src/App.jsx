import { useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import OnboardingPage from './pages/OnboardingPage'
import MainApp from './pages/MainApp'

export default function App() {
  const { session, profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-[#9C9C9C] text-sm tracking-widest uppercase">Loading…</div>
      </div>
    )
  }

  if (!session) return <LoginPage />
  if (!profile?.has_completed_onboarding) return <OnboardingPage />
  return <MainApp />
}
