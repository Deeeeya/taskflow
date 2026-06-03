import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon, LogOut, CheckSquare } from "lucide-react";
import { Button } from "./ui/button";

export const Navbar = () => {
    const { user, logout } = useAuth()
    const { theme, toggleTheme } = useTheme()

    return (
        <nav className="w-full fixed top-0 h-14 border-b bg-background flex items-center px-6 z-50">
            <div className="flex items-center gap-2">
                <CheckSquare className="text-primary" />
                <p className="font-semibold text-lg">Taskflow</p>
            </div>
            <div className="flex items-center gap-3 ml-auto">
                <Button variant="ghost" size="icon" onClick={toggleTheme}>
                    {theme === 'dark' ? <Sun /> : <Moon />}
                </Button>
                <span className="text-sm text-muted-foreground">{user?.name}</span>
                <Button variant="ghost" size="icon" onClick={logout}>
                    <LogOut />
                </Button>
            </div>
        </nav>
    )
}