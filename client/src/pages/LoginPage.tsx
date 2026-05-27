import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

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
                localStorage.setItem('token', data.token) // we need to store the token so the app remembers the user is logged in
                navigate('/dashboard')
            }

        } catch {
            setError('Something went wrong')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
                <input className="w-full border border-gray-300 px-3 py-2 rounded-md mb-4 focus:outline-none focus:border-blue-500" type="email" value={email} onChange={(e) => setEmail(e.target.value)} /> {/* this is controlled input, react re-renders the component every time the state changes, same with line below */}
                <input className="w-full border border-gray-300 px-3 py-2 rounded-md mb-4 focus:outline-none focus:border-blue-500" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600" onClick={handleLogin}>Login</button>
                <p className="text-red-500 text-sm mt-2">{error}</p>
            </div>
        </div>
    )
}

export default LoginPage