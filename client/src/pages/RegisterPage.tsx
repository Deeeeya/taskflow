import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, User, CheckSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const getPasswordStrength = (password: string) => {
    let score = 0
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[!@#$%^&*]/.test(password)) score++
    return score
}

const STRENGTH_COLORS: Record<number, string> = {
    0: "bg-red-500",
    1: "bg-red-500",
    2: "bg-amber-500",
    3: "bg-yellow-500",
    4: "bg-green-500",
}

const RegisterPage = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleRegister = async () => {
        try {
            if (name === '') { setError('Name is required'); return }
            if (email === '') { setError('Email is required'); return }
            if (password === '') { setError('Password is required'); return }

            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            const isValidEmail = emailRegex.test(email)

            if (!isValidEmail) {
                setError('Please enter a valid email address')
                return
            }

            const strength = getPasswordStrength(password)
            if (strength < 4) {
                setError('Password must be at least 8 characters and include uppercase, numbers, and special characters')
                return
            }

            const response = await fetch('http://localhost:3000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.error)
            } else {
                navigate('/login')
            }
        } catch {
            setError('Something went wrong')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-backround">
            <div className="flex flex-col items-center">
                {/* Branding */}
                <div className="flex flex-col items-center mb-6">
                    <CheckSquare className="text-primary w-10 h-10 mb-2" />
                    <CardTitle className="text-2xl font-bold text-foreground">Taskflow</CardTitle>
                </div>
                {/* Card */}
                <Card className="w-[420px] border border-primary/30 shadow-lg shadow-primary/10">
                    <CardHeader>
                        <CardTitle className="text-center text-2xl">Register</CardTitle>
                        <p className="text-muted-foreground text-sm text-center">Sign up to get started</p>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        {/* Name Input */}
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="Name" className="px-2">Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <Input className="rounded-full pl-9" placeholder="Enter your name" type="name" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => {
                                    if (e.key === "Enter") handleRegister()
                                }} />
                            </div>
                        </div>
                        {/* Email Input */}
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="Email" className="px-2">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <Input className="rounded-full pl-9" placeholder="Enter your email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => {
                                    if (e.key === "Enter") handleRegister()
                                }} />
                            </div>
                        </div>
                        {/* Password Input */}
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="Password" className="px-2">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <Input className="rounded-full pl-9" placeholder="Enter your password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => {
                                    if (e.key === "Enter") handleRegister()
                                }} />
                            </div>
                            {password && (
                                <div className="flex flex-col gap-1.5 px-2">
                                    <div className="flex gap-1">
                                        {[0, 1, 2, 3].map((i) => (
                                            <div
                                                key={i}
                                                className={`h-1.5 flex-1 rounded-full transition-colors ${i < getPasswordStrength(password) ? STRENGTH_COLORS[getPasswordStrength(password)] : "bg-muted"}`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-xs text-muted-foreground whitespace-nowrap">
                                        8+ chars, uppercase, number, special char
                                    </p>
                                </div>
                            )}
                        </div>
                        {/* Button */}
                        <Button className="w-full rounded-full" onClick={handleRegister}>Register</Button>
                        <p className="text-sm text-muted-foreground">
                            Already have an account? <Link to="/login" className="text-primary hover:underline">Login</Link>
                        </p>
                        {error && <p className="text-destructive text-sm text-center">{error}</p>}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default RegisterPage