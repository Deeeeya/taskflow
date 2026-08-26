import { Router } from 'express'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { getAllTasks } from '../controllers/task.controller.js'

const router = Router()

router.get('/', authMiddleware, getAllTasks)

export default router