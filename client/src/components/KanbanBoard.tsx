import { useState, useEffect, useMemo } from "react";
import {
    DndContext,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors,
    closestCorners,
    type DragStartEvent,
    type DragEndEvent,
} from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Plus, Calendar, X, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useAuth } from "@/context/AuthContext";
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

interface KanbanBoardProps {
    projectId: string
}

const COLUMNS = [
    { status: "todo", label: "To Do" },
    { status: "in_progress", label: "In Progress" },
    { status: "done", label: "Done" },
] as const

const PRIORITY_STYLES: Record<string, string> = {
    high: "bg-red-500/10 text-red-600 dark:text-red-400",
    medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    low: "bg-green-500/10 text-green-600 dark:text-green-400",
}

const formatDueDate = (dueDate: string) => {
    const date = new Date(dueDate)
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
}

const TaskCard = ({ task, onSelect }: { task: Task, onSelect: (task: Task) => void }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="flex flex-col gap-2 rounded-xl bg-card p-3 ring-1 ring-foreground/10 cursor-grab active:cursor-grabbing hover:ring-foreground/20 transition-all"
        >
            <div onClick={(e) => { e.stopPropagation(); onSelect(task) }}>
                <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium leading-snug">{task.title}</p>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${PRIORITY_STYLES[task.priority] ?? "bg-muted text-muted-foreground"}`}>
                        {task.priority}
                    </span>
                </div>
                {task.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
                )}
                {task.dueDate && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDueDate(task.dueDate)}</span>
                    </div>
                )}
            </div>
        </div>
    )
}

interface AddTaskFormProps {
    onAdd: (title: string) => Promise<void>
    onCancel: () => void
}

const AddTaskForm = ({ onAdd, onCancel }: AddTaskFormProps) => {
    const [title, setTitle] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async () => {
        if (!title.trim() || isSubmitting) return
        setIsSubmitting(true)
        await onAdd(title.trim())
        setIsSubmitting(false)
        setTitle("")
    }

    return (
        <div className="flex flex-col gap-2 rounded-xl bg-card p-3 ring-1 ring-primary/30">
            <Input
                autoFocus
                placeholder="Task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") handleSubmit()
                    if (e.key === "Escape") onCancel()
                }}
                className="rounded-lg h-8 text-sm"
            />
            <div className="flex items-center gap-2">
                <Button size="sm" className="rounded-full" onClick={handleSubmit} disabled={isSubmitting || !title.trim()}>
                    {isSubmitting ? "Adding..." : "Add task"}
                </Button>
                <Button size="icon-sm" variant="ghost" className="rounded-full" onClick={onCancel}>
                    <X className="w-4 h-4" />
                </Button>
            </div>
        </div>
    )
}

interface ColumnProps {
    status: string
    label: string
    tasks: Task[]
    onAddTask: (status: string, title: string) => Promise<void>
    onSelect: (task: Task) => void
}

const Column = ({ status, label, tasks, onAddTask, onSelect }: ColumnProps) => {
    const { setNodeRef, isOver } = useDroppable({ id: status })
    const [isAdding, setIsAdding] = useState(false)

    return (
        <div className="flex flex-col flex-1 min-w-0 rounded-2xl bg-muted/40">
            {/* Column Header */}
            <div className="flex items-center gap-2 px-4 py-3.5">
                <h2 className="text-sm font-semibold">{label}</h2>
                <span className="text-xs text-muted-foreground bg-foreground/5 rounded-full px-2 py-0.5">
                    {tasks.length}
                </span>
            </div>

            {/* Task List */}
            <div
                ref={setNodeRef}
                className={`flex flex-col gap-2 px-3 pt-1 pb-3 flex-1 min-h-24 overflow-y-auto transition-colors rounded-xl mx-1 ${isOver ? "bg-primary/5" : ""}`}
            >
                <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                    {tasks.map((task) => (
                        <TaskCard onSelect={onSelect} key={task.id} task={task} />
                    ))}
                </SortableContext>
                {tasks.length === 0 && !isAdding && (
                    <p className="text-xs text-muted-foreground/60 text-center py-4">No tasks</p>
                )}
                {isAdding && (
                    <AddTaskForm
                        onAdd={async (title) => {
                            await onAddTask(status, title)
                            setIsAdding(false)
                        }}
                        onCancel={() => setIsAdding(false)}
                    />
                )}
            </div>

            {/* Add Task Button */}
            {!isAdding && (
                <div className="px-3 pb-3">
                    <Button
                        variant="ghost"
                        className="w-full flex items-center justify-start gap-2 px-2 py-1.5 rounded-lg text-sm font-normal text-muted-foreground"
                        onClick={() => setIsAdding(true)}
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add task</span>
                    </Button>
                </div>
            )}
        </div>
    )
}

export const KanbanBoard = ({ projectId }: KanbanBoardProps) => {
    const { token } = useAuth()
    const [tasks, setTasks] = useState<Task[]>([])
    const [error, setError] = useState<string>('')
    const [isLoading, setIsLoading] = useState(true)
    const [activeTask, setActiveTask] = useState<Task | null>(null)
    const [selectedTask, setSelectedTask] = useState<Task | null>(null)

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

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

    const tasksByStatus: Record<string, Task[]> = {
        todo: todoTasks,
        in_progress: inProgressTasks,
        done: doneTasks,
    }

    const updateTaskStatus = async (taskId: string, status: string) => {
        const previousTasks = tasks
        setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, status } : task)))

        try {
            const response = await fetch(`http://localhost:3000/api/projects/${projectId}/tasks/${taskId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            })

            if (!response.ok) {
                setTasks(previousTasks)
                const data = await response.json()
                setError(data.error)
            }
        } catch {
            setTasks(previousTasks)
            setError('Something went wrong')
        }
    }

    const addTask = async (status: string, title: string) => {
        try {
            const response = await fetch(`http://localhost:3000/api/projects/${projectId}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ title, status })
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.error)
            } else {
                setTasks((prev) => [...prev, data])
            }
        } catch {
            setError('Something went wrong')
        }
    }

    const handleDragStart = (event: DragStartEvent) => {
        const task = tasks.find((t) => t.id === event.active.id)
        setActiveTask(task ?? null)
    }

    const handleDragEnd = (event: DragEndEvent) => {
        setActiveTask(null)
        const { active, over } = event
        if (!over) return

        const activeTaskId = active.id as string
        const task = tasks.find((t) => t.id === activeTaskId)
        if (!task) return

        const overId = over.id as string
        const targetStatus = COLUMNS.some((c) => c.status === overId)
            ? overId
            : tasks.find((t) => t.id === overId)?.status

        if (!targetStatus || targetStatus === task.status) return

        updateTaskStatus(activeTaskId, targetStatus)
    }

    if (isLoading) {
        return (
            <div className="w-full flex items-center justify-center py-16">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-4">
            {error && <p className="text-destructive text-sm">{error}</p>}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="flex gap-4 pb-4">
                    {COLUMNS.map((column) => (
                        <Column
                            key={column.status}
                            status={column.status}
                            label={column.label}
                            tasks={tasksByStatus[column.status]}
                            onAddTask={addTask}
                            onSelect={(task) => setSelectedTask(task)}
                        />
                    ))}
                </div>
                <DragOverlay>
                    {activeTask && (
                        <div className="flex flex-col gap-2 rounded-xl bg-card p-3 ring-1 ring-primary/40 shadow-lg w-80">
                            <div className="flex items-start justify-between gap-2">
                                <p className="text-sm font-medium leading-snug">{activeTask.title}</p>
                                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${PRIORITY_STYLES[activeTask.priority] ?? "bg-muted text-muted-foreground"}`}>
                                    {activeTask.priority}
                                </span>
                            </div>
                            {activeTask.description && (
                                <p className="text-xs text-muted-foreground line-clamp-2">{activeTask.description}</p>
                            )}
                        </div>
                    )}
                </DragOverlay>
            </DndContext>
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
