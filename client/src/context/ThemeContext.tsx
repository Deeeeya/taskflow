import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

interface ThemeContextType {
    theme: 'light' | 'dark',
    toggleTheme: () => void // initial toggle is set to null
}

const ThemeContext = createContext<ThemeContextType | null>(null)

const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        try {
            return (localStorage.getItem('theme') as 'light' | 'dark') ?? 'light' // this initializes theme from localStorage with a fallback to 'light'
        } catch {
            return 'light'
        }
    })

    useEffect(() => {
        const saved = localStorage.getItem('theme') as 'light' | 'dark' | null
        if (saved) setTheme(saved)
    }, [])

    useEffect(() => {
        if (theme === 'dark') { // every time 'theme' changes, update the class on <html>
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, [theme]) // only run when theme changes (code that runs after render)

    const toggleTheme = () => {
        setTheme(prev => {
            const newTheme = prev === 'light' ? 'dark' : 'light' // ternary operator that states "if prev equals 'light', set newTheme to 'dark', otherwise set it to 'light"
            localStorage.setItem('theme', newTheme) // saves the new theme to localStorage so when the user refreshes the page, their preference is remembered
            return newTheme // returns the new theme value to setTheme, which updates the state. This triggeres useEffect which then adds/removes the 'dark' class on <html>
        })
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeContext)
    if (!context) throw new Error('useTheme must be used within ThemeProvider') // a safety check
    return context
}

export default ThemeProvider