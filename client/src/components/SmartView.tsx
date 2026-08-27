import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { Circle, Calendar } from "lucide-react";

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

interface SmartViewProps {
    view: ('inbox' | 'today' | 'upcoming' | 'completed')
}

const VIEW_LABELS: Record<SmartViewProps['view'], string> = {
    inbox: "Inbox",
    today: "Today",
    upcoming: "Upcoming",
    completed: "Completed",
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

const TaskRow = ({ task }: { task: Task }) => (
    <div className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-muted/40 transition-colors">
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

export const SmartView = ({ view }: SmartViewProps) => {
    const { token } = useAuth()
    const [tasks, setTasks] = useState<Task[]>([])
    const [error, setError] = useState<string>('')

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/tasks', {
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
            }
        }
        fetchTasks()
    }, [token])

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const nextWeek = new Date(today)
    nextWeek.setDate(today.getDate() + 7)

    const inboxTasks = useMemo(() => tasks, [tasks])
    const todayTasks = useMemo(() => tasks.filter((task) => task.dueDate && new Date(task.dueDate).toDateString() === today.toDateString()), [tasks])
    const upcomingTasks = useMemo(() => tasks.filter((task) => task.dueDate && new Date(task.dueDate) >= today && new Date(task.dueDate) <= nextWeek), [tasks])
    const completedTasks = useMemo(() => tasks.filter((task) => task.status === 'done'), [tasks])

    const filteredTasks = useMemo(() => {
        switch (view) {
            case 'inbox':
                return inboxTasks
            case 'today':
                return todayTasks
            case 'upcoming':
                return upcomingTasks
            case 'completed':
                return completedTasks
            default:
                return tasks
        }
    }, [tasks, view, inboxTasks, todayTasks, upcomingTasks, completedTasks])

    return (
        <div className="w-full flex flex-col gap-4">
            <h2 className="text-lg font-semibold">{VIEW_LABELS[view]}</h2>
            {error && <p className="text-destructive text-sm">{error}</p>}
            <div className="flex flex-col gap-1 rounded-xl bg-card ring-1 ring-foreground/10 p-1">
                {filteredTasks.map((task) => (
                    <TaskRow key={task.id} task={task} />
                ))}
                {filteredTasks.length === 0 && (
                    <p className="text-xs text-muted-foreground/60 text-center py-4">No tasks</p>
                )}
            </div>
        </div>
    )
}