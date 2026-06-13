import { useState, useEffect } from "react"
import { Sidebar } from "@/components/Sidebar"
import { useAuth } from "@/context/AuthContext"

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
                onSelectProject={(id) => setActiveProjectId(id)} // when a user clicks a project in the sidebar, the sidebar calls onSelectProject(project.id), it triggers setActiveProjectId(id) which updates our state in DashboardPage
                onNewProject={() => setIsModalOpen(true)} // when we click the 'New Project' button, it sets isModalOpen to true which will open a modal to create a new project
                isCollapsed={isCollapsed}
                onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
            />
            <main className={`pt-6 px-6 transition-all duration-300 ease-in-out ${isCollapsed ? 'ml-10' : 'ml-64'}`}>
                <h1>Dashboard</h1>
            </main>
        </div>
    )
}

export default DashboardPage