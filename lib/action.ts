"use server"
import prisma from "./prisma"

export const getAllTasks = async () => {
    const allTasks = await prisma.task.findMany({
        orderBy: {
            createAt: 'desc'
        }
    })

    return allTasks
}