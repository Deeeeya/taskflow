import { Router } from 'express'
import { getProjects, createProject, updateProject, deleteProject } from '../controllers/project.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'

const router = Router()

router.get('/', authMiddleware, getProjects)
router.post('/', authMiddleware, createProject)
router.patch('/:id', authMiddleware, updateProject) // we are using patch instead of put because we are only updating name and description (only updates the field you send while everything else stays the same)
router.delete('/:id', authMiddleware, deleteProject)

export default router