import { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleRegister = async () => {
        try {
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
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
                <input className="w-full border border-gray-300 px-3 py-2 rounded-md mb-4 focus:outline-none focus:border-blue-500" placeholder="Name" type="name" value={name} onChange={(e) => setName(e.target.value)} />
                <input className="w-full border border-gray-300 px-3 py-2 rounded-md mb-4 focus:outline-none focus:border-blue-500" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input className="w-full border border-gray-300 px-3 py-2 rounded-md mb-4 focus:outline-none focus:border-blue-500" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600" onClick={handleRegister}>Register</button>
                <p className="text-red-500 text-sm mt-2">{error}</p>
            </div>
        </div>
    )
}

export default RegisterPage