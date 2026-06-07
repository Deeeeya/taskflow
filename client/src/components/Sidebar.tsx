import { Plus, Inbox, Calendar, CalendarDays, CheckCircle2, Hash, Settings, Trash2, Sun, Moon, ChevronDown, LogOut, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

interface SidebarProps { // props interface
    projects: { id: string, name: string }[], // projects type is a tuple
    onNewProject: () => void, // a function that takes no arguments and returns voide
    activeProjectId: string | null,
    onSelectProject: (id: string) => void
    isCollapsed: boolean, // this and the prop below will be used to control the sidebar collapse behavior
    onToggleCollapse: () => void
}

export const Sidebar = ({ projects, onNewProject, activeProjectId, onSelectProject, isCollapsed, onToggleCollapse }: SidebarProps) => {
    const { user, logout } = useAuth()
    const { theme, toggleTheme } = useTheme()

    const initial = user?.name?.[0]?.toUpperCase() // initial is being set to the usernames first letter and is setting it to uppercase, however its checking to see if user and name exists with the '?' as it could be null

    return (
        <aside className={`fixed left-0 top-0 h-full flex flex-col border-r bg-background transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
            {/* Avatar Div */}
            <div className="p-3 border-b flex items-center gap-2">
                {/* Avatar Circle */}
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex justify-center items-center text-sm font-bold">
                    {initial}
                </div>
                <span className={`text-sm font-medium ${isCollapsed ? 'hidden' : 'block'}`}>{user?.name}</span>
                <Button variant="ghost" size="icon" onClick={onToggleCollapse} className="ml-auto">
                    {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
                </Button>
            </div>
            {/* Smart Views Nav Section */}
            <nav className="p-2 flex flex-col gap-1">
                <p className={`text-xs text-muted-foreground uppercase font-medium pl-2 pb-1 ${isCollapsed ? 'hidden' : 'block'}`}>SMART VIEWS</p>
                <Button className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm" variant="ghost">
                    <Inbox className="w-4 h-4 shrink-0" />
                    <span className={isCollapsed ? 'hidden' : 'block'}>Inbox</span>
                </Button>
                <Button className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm" variant="ghost">
                    <Calendar className="w-4 h-4 shrink-0" />
                    <span className={isCollapsed ? 'hidden' : 'block'}>Today</span>
                </Button>
                <Button className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm" variant="ghost">
                    <CalendarDays className="w-4 h-4 shrink-0" />
                    <span className={isCollapsed ? 'hidden' : 'block'}>Upcoming</span>
                </Button>
                <Button className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm" variant="ghost">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span className={isCollapsed ? 'hidden' : 'block'}>Completed</span>
                </Button>
            </nav>
            {/* My Projects */}
            <div className="p-2 flex flex-col gap-1">
                {/* Header */}
                <div className="flex items-center pl-2 pb-1">
                    <p className={`text-xs text-muted-foreground uppercase font-medium pl-2 pb-1 ${isCollapsed ? 'hidden' : 'block'}`}>MY PROJECTS</p>
                    <Button variant="ghost" size="icon" className={`ml-auto w-6 h-6 ${isCollapsed ? 'hidden' : 'block'}`} onClick={onNewProject}>
                        <Plus className="w-3 h-3" />
                    </Button>
                </div>
                {/* Projects List */}
                {projects.map((project) => (
                    <Button key={project.id} onClick={() => onSelectProject(project.id)} variant="ghost" className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm justify-start
                    ${project.id === activeProjectId ? 'bg-primary/10 text-primary font-medium' : ''}`}>
                        <Hash className="w-4 h-4 shrink-0" />
                        <span className={isCollapsed ? 'hidden' : 'block'}>{project.name}</span>
                    </Button>
                ))}
            </div>
        </aside >
    )
}