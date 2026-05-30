import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, CheckSquare } from 'lucide-react'

const LoginPage = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate() // we define navigate to use to redirect after data is stored
    const { login } = useAuth() // since we are destructuring an object from useAuth(), we use brackets, not parenthesis

    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }) // this converts your JavaScript object into a JSON string so it can be sent over the network
            })

            const data = await response.json() // parsing the response: converts the response back from JSON into a JavaScript object you can use

            if (!response.ok) {
                setError(data.error) //data.error comes from your backend's error response
            } else {
                login(data.user, data.token) // we call the login function from context which handles everything, including storing the token
                navigate('/dashboard') // redirects to dashboard after login is successfull and token is stored
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
                    <h1 className="text-2xl font-bold text-white">Taskflow</h1>
                </div>
                {/* Card */}
                <Card className="w-[420px] border border-primary/30 shadow-lg shadow-primary/10">
                    <CardHeader>
                        <CardTitle className="text-center text-2xl">Login</CardTitle>
                        <p className="text-muted-foreground text-sm text-center">Welcome back, sign in to continue</p>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        {/* Email Input */}
                        <div className="flex flex-col gap-2">
                            <Label className="px-2" htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <Input className="rounded-full pl-9" id="email" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} /> {/* this is controlled input, react re-renders the component every time the state changes, same with line below */}
                            </div>
                        </div>
                        {/* Password Input */}
                        <div className="flex flex-col gap-2">
                            <Label className="px-2" htmlFor="password">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <Input className="rounded-full pl-9" id="password" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} /> {/* this is controlled input, react re-renders the component every time the state changes, same with line below */}
                            </div>
                        </div>
                        {/* Button */}
                        <Button onClick={handleLogin} className="w-full rounded-full">Login</Button>
                        <p className="text-sm text-muted-foreground">
                            Don't have an account? <Link to="/register" className="text-primary hover:underline">Register</Link>
                        </p>
                        {error && <p className="text-destructive text-sm text-center">{error}</p>} {/* this is conditional rendering: the error paragraph only appears when there is a failed login */}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default LoginPage