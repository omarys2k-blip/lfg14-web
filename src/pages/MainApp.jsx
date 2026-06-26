import { Routes, Route, Navigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import DashboardPage from './DashboardPage'
import GymPage from './GymPage'
import GymDayPage from './GymDayPage'
import HomeWorkoutPage from './HomeWorkoutPage'
import HomeWorkoutDetailPage from './HomeWorkoutDetailPage'
import HomeCookedPage from './HomeCookedPage'
import SpinneysPage from './SpinneysPage'

export default function MainApp() {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      <div className="flex-1 overflow-y-auto" style={{ paddingBottom: '64px' }}>
        <Routes>
          <Route path="/"                            element={<DashboardPage />} />
          <Route path="/gym"                         element={<GymPage />} />
          <Route path="/gym/:dayIndex"               element={<GymDayPage />} />
          <Route path="/home-workout"                element={<HomeWorkoutPage />} />
          <Route path="/home-workout/:workoutId"     element={<HomeWorkoutDetailPage />} />
          <Route path="/meals"                       element={<HomeCookedPage />} />
          <Route path="/spinneys"                    element={<SpinneysPage />} />
          <Route path="*"                            element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <BottomNav />
    </div>
  )
}
