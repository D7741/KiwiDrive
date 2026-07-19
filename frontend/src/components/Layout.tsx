import { Outlet, Link } from 'react-router-dom'

export default function Layout() {
  return (
    <div>
      <nav className="flex gap-4 p-4 border-b">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/quiz">Quiz</Link>
        <Link to="/leaderboard">Leaderboard</Link>
        <Link to="/achievements">Achievements</Link>
        <Link to="/profile">Profile</Link>
      </nav>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  )
}