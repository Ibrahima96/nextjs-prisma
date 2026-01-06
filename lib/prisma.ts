import { PrismaClient } from '../app/generated/prisma'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import Database from 'better-sqlite3'

const globalForPrisma = global as unknown as {
  prisma: PrismaClient
}

const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' })

const prisma = globalForPrisma.prisma || new PrismaClient({
  adapter,
  log: ['info', 'warn', 'error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma