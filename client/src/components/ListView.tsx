import { useAuth } from "@/context/AuthContext";
import { useState, useEffect, useMemo } from "react";
import { Circle, Calendar, Loader2 } from "lucide-react";
import { TaskDetailModal } from "./TaskDetailModal";

interface Task {
    id: string,
    title: string,
    description: string | null,
    priority: string,
    status: string,
    dueDate: string | null,
    projectId: string,
    createdAt: string,
    updatedAt: string
}

interface ListViewProps {
    projectId: string
}

const PRIORITY_STYLES: Record<string, string> = {
    high: "bg-red-500/10 text-red-600 dark:text-red-400",
    medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    low: "bg-green-500/10 text-green-600 dark:text-green-400",
}

const formatDueDate = (dueDate: string) => {
    const date = new Date(dueDate)
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
}

const TaskRow = ({ task, onSelect }: { task: Task, onSelect: (task: Task) => void }) => (
    <div
        onClick={() => onSelect(task)}
        className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-muted/40 transition-colors cursor-pointer"
    >
        <Circle className="w-4 h-4 text-muted-foreground shrink-0" />
        <span className="text-sm flex-1 truncate">{task.title}</span>
        {task.dueDate && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                <Calendar className="w-3 h-3" />
                <span>{formatDueDate(task.dueDate)}</span>
            </div>
        )}
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${PRIORITY_STYLES[task.priority] ?? "bg-muted text-muted-foreground"}`}>
            {task.priority}
        </span>
    </div>
)

const ListSection = ({ label, tasks, onSelect }: { label: string, tasks: Task[], onSelect: (task: Task) => void }) => (
    <div className="flex flex-col gap-2">
        <p className="text-sm uppercase text-muted-foreground font-medium">{label}</p>
        <div className="flex flex-col gap-1 rounded-xl bg-card ring-1 ring-foreground/10 p-1">
            {tasks.map((task) => (
                <TaskRow key={task.id} task={task} onSelect={onSelect} />
            ))}
            {tasks.length === 0 && (
                <p className="text-xs text-muted-foreground/60 text-center py-4">No tasks</p>
            )}
        </div>
    </div>
)

export const ListView = ({ projectId }: ListViewProps) => {
    const { token } = useAuth()
    const [tasks, setTasks] = useState<Task[]>([])
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [selectedTask, setSelectedTask] = useState<Task | null>(null)

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/projects/${projectId}/tasks`, {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${token}` }
                })

                const data = await response.json()

                if (!response.ok) {
                    setError(data.error)
                } else {
                    setTasks(data)
                }
            } catch {
                setError('Something went wrong')
            } finally {
                setIsLoading(false)
            }
        }
        fetchTasks()
    }, [projectId, token])

    const todoTasks = useMemo(() => tasks.filter((task) => task.status === 'todo'), [tasks])
    const inProgressTasks = useMemo(() => tasks.filter((task) => task.status === 'in_progress'), [tasks])
    const doneTasks = useMemo(() => tasks.filter((task) => task.status === 'done'), [tasks])

    if (isLoading) {
        return (
            <div className="w-full flex items-center justify-center py-16">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <div className="w-full flex flex-col gap-4">
            {error && <p className="text-destructive text-sm">{error}</p>}
            <ListSection label="To Do" tasks={todoTasks} onSelect={setSelectedTask} />
            <ListSection label="In Progress" tasks={inProgressTasks} onSelect={setSelectedTask} />
            <ListSection label="Done" tasks={doneTasks} onSelect={setSelectedTask} />
            <TaskDetailModal
                projectId={projectId}
                token={token}
                selectedTask={selectedTask}
                onClose={() => setSelectedTask(null)}
                onTaskUpdated={(updatedTask) => setTasks((prev) => prev.map((task) => task.id === updatedTask.id ? updatedTask : task))}
                onTaskDeleted={(taskId) => setTasks((prev) => prev.filter((task) => task.id !== taskId))}
                onError={(message) => setError(message)}
            />
        </div>
    )
}