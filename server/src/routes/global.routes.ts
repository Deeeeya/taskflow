import { Router } from 'express'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { getAllTasks, getTrashedTasks, restoreTask, permDeleteTask } from '../controllers/task.controller.js'

const router = Router()

router.get('/', authMiddleware, getAllTasks)
router.get('/trash', authMiddleware, getTrashedTasks)
router.patch('/trash/:id', authMiddleware, restoreTask)
router.delete('/trash/:id', authMiddleware, permDeleteTask)

export default router