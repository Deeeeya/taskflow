import { Router } from 'express'
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/task.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'

const router = Router({ mergeParams: true }) // task routes are nested under projects, so the task router needs to access the 'projectId' param from the parent route

router.get('/', authMiddleware, getTasks)
router.post('/', authMiddleware, createTask)
router.patch('/:id', authMiddleware, updateTask)
router.delete('/:id', authMiddleware, deleteTask)

export default router