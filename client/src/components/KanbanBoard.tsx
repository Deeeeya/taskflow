import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

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

export const KanbanBoard = ({ projectId }: KanbanBoardProps) => {
    const { token } = useAuth()
    const [tasks, setTasks] = useState<Task[]>([])
    const [error, setError] = useState<string>('')

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
            }
        }
        fetchTasks()
    }, [projectId, token])

    const todoTasks = tasks.filter((task) => task.status === 'todo')
    const inProgressTasks = tasks.filter((task) => task.status === 'in_progress')
    const doneTasks = tasks.filter((task) => task.status === 'done')
}