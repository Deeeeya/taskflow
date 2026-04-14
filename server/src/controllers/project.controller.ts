import type { Response } from 'express'
import prisma from '../lib/prisma.js'
import type { AuthRequest } from '../middleware/auth.middleware.js'

export const getProjects = async (req: AuthRequest, res: Response) => {
    try {
        const projects = await prisma.project.findMany() // gets all the projects
        return res.status(200).json(projects)
    } catch {
        res.status(500).json({ error: 'Internal server error' })
    }
}

export const createProject = async (req: AuthRequest, res: Response) => {
    try {
        const { name, description } = req.body // destructures name and description from req.body (which is the data the client sends to your server in the body of a POST/PUT request)
        const newProject = await prisma.project.create({ // creates a new project using the data we destructured in the line above 
            data: {
                name: name,
                description: description
            }
        })
        return res.status(201).json(newProject)
    } catch {
        res.status(500).json({ error: 'Internal server error' })
    }
}

export const updateProject = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params as { id: string } // the id comes from req.params (NOT req.body!!!) additionally, req.params.id is typed as string | string[] | undefined by express, so  explicitly type id as a string when destructuring
        const { name, description } = req.body
        const updatedProject = await prisma.project.update({
            where: {
                id
            },
            data: {
                name: name,
                description: description
            }
        })
        return res.status(200).json(updatedProject)
    } catch {
        res.status(500).json({ error: 'Internal server error' })
    }
}

export const deleteProject = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params as { id: string } // we need the id to specify which project we are deleting!
        await prisma.project.delete({
            where: {
                id
            }
        })
        return res.status(204).send()
    } catch {
        res.status(500).json({ error: 'Internal server error' })
    }
}