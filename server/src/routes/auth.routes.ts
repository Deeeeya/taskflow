console.log("Auth routes loaded")

import { Router } from "express";
import { register, login } from '../controllers/auth.controller.js'

const router = Router()

router.post('/register', register) // POST request to '/register' calls the register controller
router.post('/login', login) // POST request to '/login' calls the login controller

export default router