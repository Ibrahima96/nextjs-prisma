"use server"
import { revalidatePath } from "next/cache"
import prisma from "./prisma"

export const getAllTasks = async () => {
    const allTasks = await prisma.task.findMany({
        orderBy: {
            createAt: "desc"
        }
    })

    return allTasks
}
export const creatTasts = async (formData: FormData) => {
    
    await new Promise((resolve) => setTimeout(resolve, 2000))
    const task = formData.get('task') as string

    await prisma.task.create({
        data: {
            content: task
        }
    })
    revalidatePath('/')
}