"use server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import prisma from "./prisma"

// RÉCUPÉRER TOUTES LES TÂCHES
export const getAllTasks = async () => {
    try {
        const allTasks = await prisma.task.findMany({
            orderBy: {
                createAt: "desc"
            }
        })
        return allTasks
    } catch (error) {
        console.error("Erreur lors de la récupération des tâches:", error)
        return []
    }
}

// CRÉER UNE TÂCHE
export const createTasks = async (formData: FormData) => {
    try {
        await new Promise((resolve) => setTimeout(resolve, 2000))
        const task = formData.get('task') as string

        if (!task.trim()) return
        await prisma.task.create({
            data: {
                content: task
            }
        })
        revalidatePath('/')
    } catch (error) {
        console.error("Erreur lors de la création de la tâche:", error)
    }
}

// SUPPRIMER UNE TÂCHE
export const deleteTasks = async (formData: FormData) => {
    try {
        const id = formData.get('id') as string
        await prisma.task.delete({
            where: { id: Number(id) }
        })
        revalidatePath('/')
    } catch (error) {
        console.error("Erreur lors de la suppression de la tâche:", error)
    }
}

// Cette fonction permet de récupérer une tâche spécifique par son identifiant.
export const getTasks = async (id: string) => {
    try {
        // On utilise findUnique pour chercher une seule tâche.
        // L'ID reçu est une chaîne de caractères (string), on doit le convertir
        // en nombre (Number) car dans le schéma Prisma, l'ID est de type Int.
        const task = await prisma.task.findUnique({
            where: { id: Number(id) }
        })
        return task
    } catch (error) {
        console.error("Erreur lors de la récupération de la tâche:", error)
        return null
    }
}

// Cette fonction est une "Server Action" qui permet de mettre à jour une tâche dans la base de données.
export const updateTask = async (formData: FormData) => {
    try {
        // 1. On récupère les données envoyées par le formulaire via l'objet formData
        const id = formData.get('id') as string // L'identifiant de la tâche (caché dans le formulaire)
        const content = formData.get("content") as string // Le nouveau texte de la tâche

        // Le checkbox HTML envoie "on" s'il est coché, et rien s'il ne l'est pas.
        // On convertit cela en un booléen (true/false) pour Prisma.
        const completed = formData.get("completed") === "on"

        // 2. On utilise Prisma pour mettre à jour l'enregistrement correspondant dans la base de données.
        await prisma.task.update({
            // On cible la tâche par son ID (converti en Nombre car Prisma attend un Int)
            where: { id: Number(id) },
            // On définit les nouvelles valeurs pour le contenu et l'état de complétion
            data: {
                content,
                completed
            }
        })

        // 3. On demande à Next.js de rafraîchir le cache de la page d'accueil ('/')
        // pour que les changements soient visibles immédiatement sans recharger manuellement.
        revalidatePath('/')
    } catch (error) {
        console.error("Erreur lors de la mise à jour de la tâche:", error)
    }

    // 4. On redirige l'utilisateur vers la page d'accueil après la modification.
    redirect('/')
}