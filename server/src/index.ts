import express from "express";
import type { Request, Response } from "express" // ts types
import authRouter from './routes/auth.routes.js'
import projectRouter from './routes/project.routes.js'
import taskRouter from './routes/task.routes.js'
import cors from 'cors'

const app = express(); // creates server instance
const PORT = process.env.PORT || 3000 // use the env's port if it exists, otherwise use 3000

app.use(express.json()) // tells Express to parse incoming JSON requesy bodies (without this, req.body will be undefined)

app.use(cors({ origin: 'http://localhost:5173' })) // tells Express to allow requests specifically from your React app

app.use('/api/auth', authRouter) // all auth routes will be prefixed with /api/auth, so register becomes /api/auth/register and login becomes /api/auth/login

app.use('/api/projects', projectRouter) // all project routes are prefixed with /api/projects

app.use('/api/projects/:projectId/tasks', taskRouter) // all task routes are prefixed with /api/projects/:projectId/tasks

app.get('/', (req: Request, res: Response) => { // test route
    res.json({ message: 'Server is running!' })
})

app.listen(PORT, () => {
    console.log(`Server running on the port! ${PORT}`)
})

