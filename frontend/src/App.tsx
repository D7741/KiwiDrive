// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import RequireRealAuth from './components/RequireRealAuth'
import AuthPage from './pages/AuthPage'
import DashboardPage from './pages/DashboardPage'
import QuizPage from './pages/QuizPage'
import LeaderboardPage from './pages/LeaderboardPage'
import AchievementsPage from './pages/AchievementsPage'
import ProfilePage from './pages/ProfilePage'
import AdminPage from './pages/AdminPage'
import RequireAdmin from './components/RequireAdmin'



export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 公开路由：登录/注册 */}
        <Route path="/" element={<AuthPage />} />

        {/* 需要登录才能访问的路由，套上Layout + 保护（Guest也可访问） */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/achievements" element={<AchievementsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Route>
        </Route>

        {/* Quiz 需要真实登录，Guest 不允许访问 */}
        <Route element={<RequireRealAuth />}>
          <Route element={<Layout />}>
            <Route path="/quiz" element={<QuizPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}