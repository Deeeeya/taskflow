import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { Trash2, RotateCcw, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";

const PRIORITY_STYLES: Record<string, string> = {
    high: "bg-red-500/10 text-red-600 dark:text-red-400",
    medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    low: "bg-green-500/10 text-green-600 dark:text-green-400",
}

const formatDueDate = (dueDate: string) => {
    const date = new Date(dueDate)
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
}

interface Task {
    id: string,
    title: string,
    description: string | null,
    priority: string,
    status: string,
    dueDate: string | null,
    projectId: string,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null
}

export const TrashView = () => {
    const { token } = useAuth()
    const [tasks, setTasks] = useState<Task[]>([])
    const [taskToDelete, setTaskToDelete] = useState<string | null>(null) // stores the id of the task the user wants to permanently delete
    const [error, setError] = useState<string>('')

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/tasks/trash', {
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

    const handleRestore = async (id: string) => {
        try {
            const response = await fetch(`http://localhost:3000/api/tasks/trash/${id}`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${token}`
                },
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.error)
            } else {
                setTasks((prev) => prev.filter((task) => task.id !== id))
            }
        } catch {
            setError('Something went wrong')
        }
    }

    const handlePermDelete = async (id: string) => {
        try {
            const response = await fetch(`http://localhost:3000/api/tasks/trash/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.error)
            } else {
                setTasks((prev) => prev.filter((task) => task.id !== id))
            }
        } catch {
            setError('Something went wrong')
        }
    }

    return (
        <div className="w-full flex flex-col gap-4">
            <div className="flex flex-col gap-1">
                <h1 className="text-xl font-semibold">Trash</h1>
                <p className="text-sm text-muted-foreground">Items in trash are deleted after 30 days</p>
            </div>

            {error && <p className="text-destructive text-sm">{error}</p>}

            {tasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 rounded-xl bg-card ring-1 ring-foreground/10 py-16">
                    <Trash2 className="w-8 h-8 text-muted-foreground/40" />
                    <p className="text-sm text-muted-foreground/60">Trash is empty</p>
                </div>
            ) : (
                <div className="flex flex-col gap-1 rounded-xl bg-card ring-1 ring-foreground/10 p-1">
                    {tasks.map((task) => (
                        <div
                            key={task.id}
                            className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-muted/40 transition-colors"
                        >
                            <Trash2 className="w-4 h-4 text-muted-foreground/60 shrink-0" />
                            <span className="text-sm flex-1 truncate text-muted-foreground/80">{task.title}</span>
                            {task.dueDate && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                                    <Calendar className="w-3 h-3" />
                                    <span>{formatDueDate(task.dueDate)}</span>
                                </div>
                            )}
                            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${PRIORITY_STYLES[task.priority] ?? "bg-muted text-muted-foreground"}`}>
                                {task.priority}
                            </span>
                            <div className="flex items-center gap-2 shrink-0">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRestore(task.id)}
                                >
                                    <RotateCcw />
                                    Restore
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => setTaskToDelete(task.id)}
                                >
                                    <Trash2 />
                                    Delete Forever
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Dialog open={taskToDelete !== null} onOpenChange={(open) => { if (!open) setTaskToDelete(null) }}>
                <DialogContent className="bg-background rounded-2xl border border-primary/30 shadow-lg shadow-primary/10">
                    <DialogHeader>
                        <DialogTitle className="text-xl">Delete task permanently?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. The task will be permanently removed.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setTaskToDelete(null)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                handlePermDelete(taskToDelete!)
                                setTaskToDelete(null)
                            }}
                        >
                            <Trash2 />
                            Delete Forever
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}