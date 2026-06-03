import { Plus } from "lucide-react";
import { Button } from "./ui/button";

interface SidebarProps { // props interface
    projects: { id: string, name: string }[], // projects type is a tuple
    onNewProject: () => void, // a function that takes no arguments and returns voide
    activeProjectId: string | null,
    onSelectProject: (id: string) => void
}

export const Sidebar = ({ projects, onNewProject, activeProjectId, onSelectProject }: SidebarProps) => {
    return (
        <aside className="fixed left-0 top-14 h-full w-64 border-r bg-backround flex flex-col p-4">
            <div className="mb-4">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">My Projects</p>
            </div>
            <div className="flex flex-col gap-1">
                {projects.map((project) => ( // the key prop is required by React - it needs a unique identifier for each item so it can track changes
                    <Button className={`w-full text-left px-3 py-2 rounded-md text-sm ${project.id === activeProjectId ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-accent text-foreground'}`} key={project.id} onClick={() => onSelectProject(project.id)}>{project.name}</Button> // map over projects, and for each project, render a button
                ))}
            </div>
            <div className="mt-auto pt-4 border-t">
                <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => onNewProject()}>
                    <Plus className="w-4 h-4" />
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">New Projects</p>
                </Button>
            </div>
        </aside >
    )
}