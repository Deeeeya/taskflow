import express from "express";
import type { Request, Response } from "express" // ts types

const app = express(); // creates server instance
const PORT = process.env.PORT||3000 // use the env's port if it exists, otherwise use 3000

app.get('/', (req: Request, res: Response) => { // test route
    res.json({ message: 'Server is running!' })
})

app.listen(PORT, () => {
    console.log(`Server running on the port! ${PORT}`)
})