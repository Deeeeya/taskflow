import type { Request, Response } from "express"
import * as bcrypt from "bcrypt"
import prisma from "../lib/prisma.js"
import jwt from "jsonwebtoken"

export const register = async (req: Request, res: Response) => {
    console.log('Register route hit!')

    try {
        const { name, email, password } = req.body
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await prisma.user.create({
            data: {
                name: name,
                email: email,
                password: hashedPassword
            }
        })
        const { password: _, ...userWithoutPassword } = newUser // creates a copy of the newUser named 'userWithoutPassword' to return user data without password (protects sensitive information)
        return res.status(201).json(userWithoutPassword)
    } catch {
        return res.status(500).json({ error: 'Internal server error' })
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })
        if (!user) return res.status(401).json({ error: 'Invalid credentials' })
        const isMatch: boolean = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' })
        } else {
            const { password: _, ...userWithoutPassword } = user
            const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET ?? 'secret', { expiresIn: '7d' })
            return res.status(200).json({ user: userWithoutPassword, token })
        }

    } catch {
        return res.status(500).json({ error: 'Internal server error' })
    }
}