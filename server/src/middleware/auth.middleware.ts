import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

interface AuthRequest extends Request {
    userId?: string, // optional property because when a request first comes in, userId doesn't exist yet, the middleware adds it
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(" ")[1] // getting the token from the requests header and splitting "Bearer" from <token>
        if (!token) return res.status(401).json({ error: 'No token provided' })
        const decoded = jwt.verify(token, process.env.JWT_SECRET ?? 'secret') as { id: string } // verifying the token, if the token was tampered with or signed with a different secret, jwt.verify() will throw an error which our catch block will handle
        req.userId = decoded.id
        next()
    } catch {
        return res.status(401).json({ error: 'Invalid token' })
    }
}