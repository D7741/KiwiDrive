// src/pages/ProfilePage.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, Input } from '../components/ui'
import { useAuthStore } from '../store/authStore'
import { useThemeStore } from '../store/themeStore'
import * as authApi from '../api/auth'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const { isDark, toggleDark } = useThemeStore()

  const [username, setUsername] = useState(user?.username ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [nameSaved, setNameSaved] = useState(false)
  const [nameError, setNameError] = useState('')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordSaved, setPasswordSaved] = useState(false)

  const handleSaveProfile = async () => {
    setNameError('')
    try {
      const updated = await authApi.updateProfile(username, email)
      useAuthStore.setState({ user: updated })
      setNameSaved(true)
      setTimeout(() => setNameSaved(false), 2500)
    } catch (err) {
      setNameError(err instanceof Error ? err.message : 'Could not update profile.')
    }
  }

  const handleChangePassword = async () => {
    setPasswordError('')
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters')
      return
    }
    try {
      await authApi.changePassword(currentPassword, newPassword)
      setCurrentPassword('')
      setNewPassword('')
      setPasswordSaved(true)
      setTimeout(() => setPasswordSaved(false), 2500)
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : 'Could not change password.')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/auth')
  }

  return (
    <div className="max-w-[820px] mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-10 pb-24">
      <div className="flex items-center gap-4 sm:gap-5 mb-7">
        <div className="w-14 h-14 sm:w-[74px] sm:h-[74px] rounded-2xl sm:rounded-[20px] bg-sky-blue text-white flex items-center justify-center font-heading font-extrabold text-xl sm:text-2xl shrink-0">
          {user?.username?.[0]?.toUpperCase() ?? '?'}
        </div>
        <div className="min-w-0">
          <div className="font-heading font-extrabold text-lg sm:text-xl text-ink truncate">{user?.username}</div>
          <div className="text-sm text-ink-light truncate">{user?.email}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mb-5">
        <Card>
          <h2 className="font-heading font-bold text-base text-ink mb-4">Edit profile</h2>
          <Input label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          {nameError && (
            <div className="bg-alert-red-light text-alert-red text-xs font-semibold px-3 py-2.5 rounded-xl mb-3">
              {nameError}
            </div>
          )}
          {nameSaved && (
            <div className="bg-kiwi-green-light text-[oklch(45%_0.14_152)] text-xs font-semibold px-3 py-2.5 rounded-xl mb-3">
              Profile updated successfully!
            </div>
          )}
          <Button variant="primary" onClick={handleSaveProfile} className="w-full sm:w-auto">Save changes</Button>
        </Card>

        <Card>
          <h2 className="font-heading font-bold text-base text-ink mb-4">Change password</h2>
          <Input
            label="Current password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <Input
            label="New password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          {passwordError && (
            <div className="bg-alert-red-light text-alert-red text-xs font-semibold px-3 py-2.5 rounded-xl mb-3">
              {passwordError}
            </div>
          )}
          {passwordSaved && (
            <div className="bg-sky-blue-light text-[oklch(45%_0.15_255)] text-xs font-semibold px-3 py-2.5 rounded-xl mb-3">
              Password changed successfully!
            </div>
          )}
          <Button variant="secondary" onClick={handleChangePassword} className="w-full sm:w-auto">Update password</Button>
        </Card>
      </div>

      <Card className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 mb-5">
        <div>
          <h2 className="font-heading font-bold text-base text-ink mb-1">Appearance</h2>
          <p className="text-xs text-ink-light">Switch between light and dark mode across KiwiDrive.</p>
        </div>
        <button
          onClick={toggleDark}
          className="w-13 h-[30px] rounded-full border-none cursor-pointer relative shrink-0 self-start sm:self-auto"
          style={{ background: isDark ? 'oklch(30% 0.03 260)' : 'oklch(88% 0.015 95)' }}
        >
          <div
            className="absolute top-[3px] w-6 h-6 rounded-full bg-white transition-[left] duration-200 ease-out shadow-sm"
            style={{ left: isDark ? '25px' : '3px' }}
          />
        </button>
      </Card>

      <div className="text-center sm:text-right">
        <button
          onClick={handleLogout}
          className="w-full sm:w-auto font-heading font-bold text-sm text-alert-red border-[1.5px] border-[oklch(85%_0.06_25)] rounded-xl px-5 py-2.5 bg-transparent cursor-pointer"
        >
          Log out
        </button>
      </div>
    </div>
  )
}