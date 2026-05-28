import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
                <input className="w-full border border-gray-300 px-3 py-2 rounded-md mb-4 focus:outline-none focus:border-blue-500" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} /> {/* this is controlled input, react re-renders the component every time the state changes, same with line below */}
                <input className="w-full border border-gray-300 px-3 py-2 rounded-md mb-4 focus:outline-none focus:border-blue-500" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600" onClick={handleLogin}>Login</button>
                <p className="text-red-500 text-sm mt-2">{error}</p>
            </div>
        </div>
    )
}

export default LoginPage