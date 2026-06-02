import { createContext, useContext, useState, type ReactNode } from "react";

interface User { // TypeScript blueprint that describes what a user object looks like, must have all 3 fields to be accepted
    id: string,
    email: string,
    name: string
}

interface AuthContextType { // the blueprint for everything the global state will hold
    user: User | null, // either a logged in user or null (not logged in)
    token: string | null, // either a string or null (no token)
    login: (user: User, token: string) => void, // a function that takes a user and token but returns nothing (void)
    logout: () => void, // returns nothing (void)
    isAuthenticated: boolean // just true or false
}

const AuthContext = createContext<AuthContextType | null>(null) // createContext helps build the global state that any component can access but we pass null as the default because no one is logged in yet

const AuthProvider = ({ children }: { children: ReactNode }) => { // the component that wraps your app and provides data to the global state and maintains it
    // {children} is whatever components are wrapped inside AuthProvider
    const [user, setUser] = useState<User | null>(null) // this means it starts with no user logged in
    const [token, setToken] = useState<string | null>(localStorage.getItem('token')) // when the app loads, check if a token was already saved from a previous login. This keeps the usert logged in even after refreshing the page

    const login = (user: User, token: string) => {
        setUser(user)
        setToken(token)
        localStorage.setItem('token', token) // saves token to localStorage
    }

    const logout = () => {
        setUser(null)
        setToken(null)
        localStorage.removeItem('token') // removes token from localStorage
    }

    const isAuthenticated = !!token // the '!!' converts the token to a boolean. If token exists, it's true, if null, it's false

    return ( // AuthContext.Provider makes the data available to all components inside it. Any component that reads from the context will receive exactly these values. Children renders whatever components are wrapped inside AuthProvider
        <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => { // this is a custom hook - a reusable function that wraps existing React hooks to make then easier to use
    const context = useContext(AuthContext) // this is how a component reads from the global state, it looks at the nearest AuthContext.Provider above it in the component trree and returns whatever is in its value. So it gives you back { user, token, login, logout, isAuthenticated }
    if (!context) throw new Error('useAuth must be used within AuthProvider') // a safety check
    return context // returns all the auth data so the component can use it
}

export default AuthProvider