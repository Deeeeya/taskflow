// single instance of PrismaClient that the whole app will share
import { PrismaClient } from "../generated/prisma/index.js"

const prisma = new PrismaClient() // instance

export default prisma
// gives us one shared database connection that all our routes can import and use
