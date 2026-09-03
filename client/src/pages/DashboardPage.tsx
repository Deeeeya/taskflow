import { useState, useEffect } from "react"
import { Sidebar } from "@/components/Sidebar"
import { CreateProjectModal } from "@/components/CreateProjectModal"
import { KanbanBoard } from "@/components/KanbanBoard"
import { ListView } from "@/components/ListView"
import { SmartView } from "@/components/SmartView"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { LayoutGrid, List } from "lucide-react"
import { SettingsPage } from "./SettingsPage"

interface Project {
    id: string,
    name: string,
    description: string | null
    createdAt: string,
    updatedAt: string
}

const DashboardPage = () => {
    const { token } = useAuth()
    const [projects, setProjects] = useState<Project[]>([]) // stores the array of projects fetched from the API, starts empty
    const [activeProjectId, setActiveProjectId] = useState<string | null>(null) // tracks which project is selected in the sidebar, starts as null
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false) // tracks whether the create project modal is open, starts as false
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false) // tracks if the sidebar is collapsed or not
    const [error, setError] = useState('') // stores any error messages to display to the user
    const [view, setView] = useState<'board' | 'list'>('board')
    const [activeView, setActiveView] = useState<'inbox' | 'today' | 'upcoming' | 'completed' | null>(null)
    const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false)

    console.log(activeView)

    useEffect(() => { // runs the fetchProjects function whenever token changes
        const fetchProjects = async () => { // an async function that makes a GET request to the backend with the JWT token in the header
            try {
                const response = await fetch('http://localhost:3000/api/projects', {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${token}` }
                })

                const data = await response.json()

                if (!response.ok) {
                    setError(data.error)
                } else {
                    setProjects(data)
                }
            } catch {
                setError('Something went wrong')
            }
        }
        fetchProjects() // useEffect doesn't allow its callback to be async directly, so we have to define the async function inside and then call it on the next line
    }, [token]) // if token is null on first render, the effect won't fetch, and once the token is set, the effect re-runs and fetches the projects

    return (
        <div className="h-screen flex">
            <Sidebar
                projects={projects} // passing our projects state array to the Sidebar so it can display the list of projects, we defined projects as a prop in Sidebar.tsx
                activeProjectId={activeProjectId} // we're passing which project is currently selected
                onSelectProject={(id) => { // this ensures that the smart view (inbox, today, etc) does not show on the dashboard
                    setActiveProjectId(id)
                    setActiveView(null)
                }} // when a user clicks a project in the sidebar, the sidebar calls onSelectProject(project.id), it triggers setActiveProjectId(id) which updates our state in DashboardPage
                onNewProject={() => setIsModalOpen(true)} // when we click the 'New Project' button, it sets isModalOpen to true which will open a modal to create a new project
                isCollapsed={isCollapsed} // we're passing current collapse state down to Sidebar so it knows whether to show full width version or narrow icon-only version
                onToggleCollapse={() => setIsCollapsed(!isCollapsed)} // callback function we pass to the Sidebar's collapse button. When clicked, it calls onToggleCollapse which runs 'setIsCollapsed(!isCollapsed) flipping the boolean (this is called toggling)
                onSelectView={(view) => { // this ensures only smart views are active, not the active project you were on, meaning selecting a task automatically deselects a project
                    setActiveView(view)
                    setActiveProjectId(null)
                }} // passing onSelectView on to the Sidebar component
                onOpenSettings={() => setIsSettingsOpen(true)}
            />
            <CreateProjectModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onProjectCreated={(project) => setProjects([...projects, project])} // updates the React state on the frontend, '...projects' is the spread operator, while project is the newly created project returned from the API
            // 'setProjects([...projects, project])' creates a brand new array with all the old projects plus the new one, and updates the state
            />
            <SettingsPage isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
            <main className={`${isCollapsed ? 'ml-10' : 'ml-64'} pt-6 px-6 flex-1 overflow-x-auto transition-all duration-300 ease-in-out`}>
                {activeView ? (
                    <SmartView view={activeView} />) : activeProjectId ? (
                        <div>
                            {/* Header with Toggle Buttons */}
                            <div className="mb-4 flew items-center gap-2">
                                <Button className={`rounded-md ${view === 'board' ? 'bg-primary/10 text-primary' : ''}`} variant="ghost" onClick={() => setView('board')}><LayoutGrid /></Button> {/* Board View */}
                                <Button className={`rounded-md ${view === 'list' ? 'bg-primary/10 text-primary' : ''}`} variant="ghost" onClick={() => setView('list')}><List /></Button> {/* List View */}
                            </div>
                            {/* Board or List based on view state */}
                            {view === 'board' ? <KanbanBoard projectId={activeProjectId} /> : <ListView projectId={activeProjectId} />}
                        </div>
                    ) : (
                    <p className="text-muted-foreground">Select a project to get started</p>
                )}
            </main>
        </div>
    )
}

export default DashboardPage