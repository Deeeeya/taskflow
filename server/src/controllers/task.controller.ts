import type { Response } from 'express'
import prisma from '../lib/prisma.js'
import type { AuthRequest } from '../middleware/auth.middleware.js'

export const getAllTasks = async (req: AuthRequest, res: Response) => { // function used to get all tasks across all projects
    try {
        if (!req.userId) {
            return res.status(401).json({ error: 'Unauthorized' })
        }

        const allTasks = await prisma.task.findMany({
            where: {
                project: {
                    userId: req.userId
                },
                deletedAt: null,
            }
        })

        return res.status(200).json(allTasks)
    } catch {
        return res.status(500).json({ error: 'Internal server error' })
    }
}

export const getTasks = async (req: AuthRequest, res: Response) => {
    try {
        const { projectId } = req.params as { projectId: string }
        const tasks = await prisma.task.findMany({
            where: {
                projectId,
                deletedAt: null
            }
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
        const deletedTask = await prisma.task.update({
            where: { id },
            data: {
                deletedAt: new Date()
            }
        })
        return res.status(200).json(deletedTask)
    } catch {
        return res.status(500).json({ error: 'Internal server error' })
    }
}

export const getTrashedTasks = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.userId) {
            return res.status(401).json({ error: 'Unauthorized' })
        }

        const trashedTasks = await prisma.task.findMany({
            where: {
                deletedAt: {
                    not: null,
                }
            }
        })
        return res.status(200).json(trashedTasks)
    } catch (error) {
        console.error("Internal server error", error)
        return res.status(500).json({ error: 'Internal server error' })
    }
}

export const restoreTask = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params as { id: string }
        const restoredTask = await prisma.task.update({
            where: { id },
            data: {
                deletedAt: null
            }
        })
        return res.status(200).json(restoredTask)
    } catch {
        return res.status(500).json({ error: 'Internal server error ' })
    }
}

export const permDeleteTask = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params as { id: string }
        const permDelete = await prisma.task.delete({
            where: {
                id,
                deletedAt: {
                    not: null
                }
            }
        })
        return res.status(200).json(permDelete)
    } catch {
        return res.status(500).json({ error: 'Internal server error' })
    }
}