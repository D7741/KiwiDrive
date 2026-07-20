// src/pages/AuthPage.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Input } from '../components/ui'

type Mode = 'login' | 'register'

interface FormErrors {
    name?: string
    email?: string
    password?: string
    confirmPassword?: string
}

export default function AuthPage() 
{
    const navigate = useNavigate()
    const [mode, setMode] = useState<Mode>('login')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errors, setErrors] = useState<FormErrors>({})
    const [authError, setAuthError] = useState('')



    const isEmailValid = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)


    const switchMode = (next: Mode) => {
        setMode(next)
        setErrors({})
        setAuthError('')
    }

    // detected if the form is correct required.
    const handleSubmit = () => 
        {
            const newErrors: FormErrors = {}
            if (mode === 'register' && !name.trim()) newErrors.name = 'Please enter your name'
            if (!email) newErrors.email = 'Email is required'
            else if (!isEmailValid(email)) newErrors.email = 'Enter a valid email address'
            if (!password) newErrors.password = 'Password is required'
            else if (password.length < 8) newErrors.password = 'Must be at least 8 characters'
            if (mode === 'register' && confirmPassword !== password) newErrors.confirmPassword = "Passwords don't match"

            if (Object.keys(newErrors).length) 
            {
                setErrors(newErrors)
                setAuthError('')
                return
            }

            // TODO: Connect with the actual database
            setErrors({})
            setAuthError('')
            navigate('/dashboard')
        }

    const handleGuest = () => {
    // TODO: controller with guest dashboard
    navigate('/dashboard')
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6 box-border">
        <div className="w-full max-w-[960px] grid grid-cols-2 bg-card rounded-[28px] shadow-[0_2px_0_var(--color-border-subtle),0_20px_50px_oklch(30%_0.03_260/0.1)] overflow-hidden">

        {/* left */}
        <div className="bg-gradient-to-br from-kiwi-green to-[oklch(50%_0.15_165)] p-12 flex flex-col justify-between text-white">
        <div>
            <div className="font-heading font-extrabold text-2xl mb-2">KiwiDrive</div>
            <p className="text-sm opacity-85 leading-relaxed max-w-[260px]">
            Ace your learner licence theory test. Earn XP, keep your streak alive, and climb the leaderboard.
            </p>
        </div>
        <div className="bg-white/12 rounded-2xl p-5 backdrop-blur-[2px]">
            <div className="font-heading font-bold text-sm mb-2.5">Why sign up?</div>
            <div className="flex flex-col gap-2 text-[13px] opacity-90">
            <div>• Save XP, levels &amp; streaks</div>
            <div>• Unlock achievement badges</div>
            <div>• Rank on the global leaderboard</div>
            </div>
        </div>
        </div>

        {/* right form */}
        <div className="p-12">
        <div className="flex gap-1.5 bg-cream rounded-2xl p-1 mb-7">
            <button
            onClick={() => switchMode('login')}
            className={`flex-1 py-2.5 rounded-[11px] font-heading font-bold text-sm cursor-pointer border-none ${
                mode === 'login'
                ? 'bg-card text-kiwi-green shadow-sm'
                : 'bg-transparent text-ink-muted'
            }`}
            >
            Log In
            </button>
            <button
            onClick={() => switchMode('register')}
            className={`flex-1 py-2.5 rounded-[11px] font-heading font-bold text-sm cursor-pointer border-none ${
                mode === 'register'
                ? 'bg-card text-kiwi-green shadow-sm'
                : 'bg-transparent text-ink-muted'
            }`}
            >
            Register
            </button>
        </div>

        {authError && (
            <div className="bg-alert-red-light text-alert-red text-[13px] font-semibold px-3.5 py-3 rounded-xl mb-4.5">
            {authError}
            </div>
        )}

        {mode === 'register' && (
            <Input
            label="Name"
            placeholder="Alex Smith"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            />
        )}

        <Input
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
        />

        <Input
            label="Password"
            type="password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
        />

        {mode === 'register' && (
            <Input
            label="Confirm Password"
            type="password"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
            />
        )}

        <Button variant="primary" onClick={handleSubmit} className="w-full mb-3.5">
            {mode === 'login' ? 'Log In' : 'Create Account'}
        </Button>

        <div className="text-center text-xs text-ink-light mb-3.5">or</div>

        <Button variant="outline" onClick={handleGuest} className="w-full">
            Continue as Guest
        </Button>
        <p className="text-[11.5px] text-ink-light text-center mt-2.5 leading-relaxed">
            Guest progress is saved on this device only. Sign up any time to keep it.
        </p>
        </div>
        </div>
        </div>
    )
}