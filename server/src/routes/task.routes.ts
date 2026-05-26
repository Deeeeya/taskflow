import { Router } from 'express'
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/task.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'

const router = Router({ mergeParams: true })

router.get('/', authMiddleware, getTasks)
router.post('/', authMiddleware, createTask)
router.patch('/:id', authMiddleware, updateTask)
router.delete('/:id', authMiddleware, deleteTask)

export default router