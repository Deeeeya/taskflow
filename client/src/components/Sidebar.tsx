import { Plus, Inbox, Calendar, CalendarDays, CheckCircle2, Hash, Settings, Trash2, Sun, Moon, LogOut, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from "./ui/dropdown-menu";

interface SidebarProps { // props interface
    projects: { id: string, name: string }[], // projects type is a tuple
    onNewProject: () => void, // a function that takes no arguments and returns void
    activeProjectId: string | null,
    onSelectProject: (id: string) => void
    isCollapsed: boolean, // this and the prop below will be used to control the sidebar collapse behavior
    onToggleCollapse: () => void
    onSelectView: (view: 'inbox' | 'today' | 'upcoming' | 'completed') => void
    onOpenSettings: () => void
}

export const Sidebar = ({ projects, onNewProject, activeProjectId, onSelectProject, isCollapsed, onToggleCollapse, onSelectView, onOpenSettings }: SidebarProps) => {
    const { user, logout } = useAuth()
    const { theme, toggleTheme } = useTheme()

    const initial = user?.name?.[0]?.toUpperCase() // initial is being set to the usernames first letter and is setting it to uppercase, however its checking to see if user and name exists with the '?' as it could be null

    // collapses an entire section (icons included) to nothing - width and opacity animate together
    const section = `overflow-hidden transition-all duration-300 ease-in-out ${isCollapsed ? 'max-w-0 opacity-0' : 'max-w-full opacity-100'}`

    return (
        <aside className={`fixed left-0 top-0 h-full flex flex-col transition-all duration-300 ease-in-out ${isCollapsed ? 'w-10' : 'w-64 bg-muted/40'}`}>

            {/* Avatar Row */}
            <div className="flex items-center h-14 transition-all duration-300 ease-in-out">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className={`flex items-center gap-2 overflow-hidden transition-all duration-300 ease-in-out cursor-pointer ml-2
                            data-[state=open]:bg-accent data-[state=open]:rounded-md data-[state=open]:py-1 data-[state=open]:px-2 ${isCollapsed ? 'w-0 opacity-0' : 'w-full flex-1 pl-3 opacity-100'}`}>
                            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex justify-center items-center text-sm font-bold shrink-0">
                                {initial}
                            </div>
                            <span className="text-sm font-medium whitespace-nowrap">{user?.name}</span>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="min-w-0">
                        <DropdownMenuLabel>
                            {user?.name}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onOpenSettings()}> {/* opens the settings modal when clicked */}
                            <Settings className="w-4 h-4 mr-2" />
                            Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={logout}>
                            <LogOut className="w-4 h-4 mr-2" />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="ghost" size="icon-lg" onClick={onToggleCollapse} className={`shrink-0 rounded-md transition-all duration-300 ease-in-out ${isCollapsed ? '' : 'mr-2'}`}>
                    {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
                </Button>
            </div>

            {/* Smart Views Nav Section */}
            <nav className={`p-2 flex flex-col gap-1 ${section}`}>
                <p className="text-xs text-muted-foreground uppercase font-medium pl-2 pb-1 whitespace-nowrap">SMART VIEWS</p>
                <Button className="w-full flex items-center justify-start gap-2 px-2 py-1.5 rounded-md text-sm font-normal" variant="ghost" onClick={() => onSelectView('inbox')}>
                    <Inbox className="w-4 h-4 shrink-0" />
                    <span className="whitespace-nowrap">Inbox</span>
                </Button>
                <Button className="w-full flex items-center justify-start gap-2 px-2 py-1.5 rounded-md text-sm font-normal" variant="ghost" onClick={() => onSelectView('today')}>
                    <Calendar className="w-4 h-4 shrink-0" />
                    <span className="whitespace-nowrap">Today</span>
                </Button>
                <Button className="w-full flex items-center justify-start gap-2 px-2 py-1.5 rounded-md text-sm font-normal" variant="ghost" onClick={() => onSelectView('upcoming')}>
                    <CalendarDays className="w-4 h-4 shrink-0" />
                    <span className="whitespace-nowrap">Upcoming</span>
                </Button>
                <Button className="w-full flex items-center justify-start gap-2 px-2 py-1.5 rounded-md text-sm font-normal" variant="ghost" onClick={() => onSelectView('completed')}>
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span className="whitespace-nowrap">Completed</span>
                </Button>
                <Button variant="ghost" className="w-full flex items-center justify-start gap-2 px-2 py-1.5 rounded-md text-xs">
                    <Trash2 className="w-4 h-4 shrink-0" />
                    <span className="whitespace-nowrap">Trash</span>
                </Button>
            </nav>

            {/* My Projects */}
            <div className={`p-2 flex flex-col gap-1 ${section}`}>
                {/* Header */}
                <div className="flex items-center pl-2 pb-1">
                    <p className="text-xs text-muted-foreground uppercase font-medium pb-1 whitespace-nowrap">MY PROJECTS</p>
                    <Button variant="ghost" className="ml-auto flex items-center gap-2 px-2 py-1.5 rounded-md text-sm font-normal" onClick={onNewProject}>
                        <Plus className="w-3 h-3" />
                    </Button>
                </div>

                {/* Projects List */}
                {projects.map((project) => (
                    <Button key={project.id} onClick={() => onSelectProject(project.id)} variant="ghost" className={`w-full flex items-center justify-start gap-2 px-2 py-1.5 rounded-md text-sm
                            ${project.id === activeProjectId ? 'bg-primary/10 text-primary font-medium' : ''}`}>
                        <Hash className="w-4 h-4 shrink-0" />
                        <span className="whitespace-nowrap">{project.name}</span>
                    </Button>
                ))}
            </div>

            {/* Bottom Section */}
            <div className={`mt-auto p-2 flex items-center justify-start gap-2 ${section}`}>
                {/* Theme Toggle Button */}
                <Button variant="ghost" size="icon-sm" onClick={toggleTheme} className="rounded-md">
                    {theme == 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </Button>
                {/* Logout Button */}
                <Button variant="ghost" size="icon-sm" onClick={logout} className="rounded-md">
                    <LogOut className="w-4 h-4" />
                </Button>
            </div>
        </aside>
    )
}
