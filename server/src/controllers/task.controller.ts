import type { Response } from 'express'
import prisma from '../lib/prisma.js'
import type { AuthRequest } from '../middleware/auth.middleware.js'

export const getTasks = async (req: AuthRequest, res: Response) => {
    try {
        const { projectId } = req.params as { projectId: string }
        const tasks = await prisma.task.findMany({
            where: { projectId }
        })
        return res.status(200).json(tasks)
    } catch {
        return res.status(500).json({ error: 'Internal server error' })
    }
}

export const createTask = async (req: AuthRequest, res: Response) => {
    try {
        const { projectId } = req.params as { projectId: string }
        const { title, description, priority, status, dueDate } = req.body
        const newTask = await prisma.task.create({
            data: {
                title,
                description,
                priority,
                status,
                dueDate,
                projectId, // links task to project from URL
            }
        })
        return res.status(201).json(newTask)
    } catch {
        return res.status(500).json({ error: 'Internal server error' })
    }
}

export const updateTask = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params as { id: string }
        const { title, description, priority, status, dueDate } = req.body
        const updatedTask = await prisma.task.update({
            where: { id },
            data: {
                title: title,
                description: description,
                priority: priority,
                status: status,
                dueDate: dueDate,
            }
        })
        return res.status(200).json(updatedTask)
    } catch {
        return res.status(500).json({ error: 'Internal server error' })
    }
}

export const deleteTask = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params as { id: string }
        await prisma.task.delete({
            where: { id }
        })
        return res.status(204).send()
    } catch {
        return res.status(500).json({ error: 'Internal server error' })
    }
}