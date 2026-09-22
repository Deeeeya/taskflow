import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";

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

interface TaskDetailModalProps {
    projectId: string
    token: string | null
    selectedTask: Task | null
    onClose: () => void
    onTaskUpdated: (task: Task) => void
    onTaskDeleted: (taskId: string) => void
    onError: (message: string) => void
}

const PRIORITIES = ["low", "medium", "high"] as const

const PRIORITY_DOT: Record<string, string> = {
    high: "bg-red-500",
    medium: "bg-amber-500",
    low: "bg-green-500",
}

const toDateInputValue = (value: string) => (value ? value.slice(0, 10) : '')

export const TaskDetailModal = ({
    projectId,
    token,
    selectedTask,
    onClose,
    onTaskUpdated,
    onTaskDeleted,
    onError,
}: TaskDetailModalProps) => {
    const [editTitle, setEditTitle] = useState<string>('')
    const [editDescription, setEditDescription] = useState<string>('')
    const [editPriority, setEditPriority] = useState<string>('')
    const [editDueDate, setEditDueDate] = useState<string>('')

    useEffect(() => {
        if (selectedTask) {
            setEditTitle(selectedTask.title)
            setEditDescription(selectedTask.description ?? '') // description can be null so use '' to fall back to an empty string
            setEditPriority(selectedTask.priority)
            setEditDueDate(selectedTask.dueDate ? selectedTask.dueDate.split('T')[0] : '')
        } else {
            setEditTitle('')
            setEditDescription('') // description can be null so use '' to fall back to an empty string
            setEditPriority('')
            setEditDueDate('')
        }
    }, [selectedTask])

    const handleSave = async () => {
        try {
            if (!selectedTask) return

            const response = await fetch(`http://localhost:3000/api/projects/${projectId}/tasks/${selectedTask.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: editTitle,
                    description: editDescription,
                    priority: editPriority,
                    dueDate: editDueDate ? new Date(editDueDate + 'T12:00:00').toISOString() : null
                })
            })

            const data = await response.json()

            if (!response.ok) {
                onError(data.error)
            } else {
                onTaskUpdated(data)
                onClose()
            }
        } catch {
            onError('Something went wrong')
        }
    }

    const handleDelete = async () => {
        try {
            if (!selectedTask) return

            const response = await fetch(`http://localhost:3000/api/projects/${projectId}/tasks/${selectedTask.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                } // no 'body' neaded for DELETE reequests
            })

            if (!response.ok) {
                onError('Failed to delete task')
            } else {
                onTaskDeleted(selectedTask.id)
                onClose()
            }
        } catch {
            onError('Something went wrong')
        }
    }

    return (
        <Dialog open={selectedTask !== null} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="bg-background rounded-2xl border border-primary/30 shadow-lg shadow-primary/10 sm:max-w-lg duration-200 ease-out data-open:zoom-in-98 data-closed:zoom-out-98">
                <DialogHeader>
                    <DialogTitle className="sr-only">Edit task</DialogTitle>
                    <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="Task title"
                        className="h-auto rounded-lg border-none bg-transparent px-0 text-xl font-semibold shadow-none focus-visible:ring-0"
                    />
                </DialogHeader>

                <div className="flex flex-col gap-5">
                    {/* Description */}
                    <div className="flex flex-col gap-2">
                        <Label className="text-xs text-muted-foreground uppercase">Description</Label>
                        <textarea
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            placeholder="Add a description"
                            rows={4}
                            className="w-full rounded-lg border border-input bg-input/30 px-3 py-2 text-sm outline-none transition-colors resize-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                        />
                    </div>

                    {/* Priority */}
                    <div className="flex flex-col gap-2">
                        <Label className="text-xs text-muted-foreground uppercase">Priority</Label>
                        <div className="flex gap-2">
                            {PRIORITIES.map((priority) => (
                                <button
                                    key={priority}
                                    type="button"
                                    onClick={() => setEditPriority(priority)}
                                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors ring-1 ${editPriority === priority
                                        ? "ring-primary bg-primary/10 text-foreground"
                                        : "ring-border text-muted-foreground hover:bg-muted"
                                        }`}
                                >
                                    <span className={`h-1.5 w-1.5 rounded-full ${PRIORITY_DOT[priority]}`} />
                                    {priority}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Due Date */}
                    <div className="flex flex-col gap-2">
                        <Label className="text-xs text-muted-foreground uppercase">Due Date</Label>
                        <Input
                            type="date"
                            value={toDateInputValue(editDueDate)}
                            onChange={(e) => setEditDueDate(e.target.value)}
                            className="rounded-lg"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="destructive" className="rounded-full" onClick={handleDelete}>
                        <Trash2 className="w-4 h-4" />
                        Delete
                    </Button>
                    <Button className="rounded-full" onClick={handleSave}>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
