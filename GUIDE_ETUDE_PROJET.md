# 📔 Guide d'Étude Complet : Gestionnaire de Tâches (Next.js + Prisma)

Ce document sert de guide de référence pour comprendre l'architecture, le fonctionnement et les choix techniques du projet.

---

## 🚀 1. Stack Technique
*   **Framework :** [Next.js 15](https://nextjs.org/) (App Router).
*   **ORM :** [Prisma](https://www.prisma.io/) (Gestion de la base de données).
*   **Base de Données :** [SQLite](https://sqlite.org/) (Fichier local `dev.db`).
*   **Style :** [Tailwind CSS](https://tailwindcss.com/) & [DaisyUI](https://daisyui.com/) (Composants UI).
*   **Langage :** [TypeScript](https://www.typescriptlang.org/).

---

## 📊 2. Modèle de Données (Prisma)
Le fichier `prisma/schema.prisma` définit la structure de la table `Task`.

```prisma
model Task {
  id        Int      @id @default(autoincrement()) // Clé primaire auto-incrémentée
  content   String                               // Texte de la tâche
  createAt  DateTime @default(now())             // Date de création automatique
  completed Boolean  @default(false)             // État de la tâche (défaut : non terminé)
}
```

---

## 🛠️ 3. Actions Serveur (`lib/action.ts`)
Le projet utilise les **Server Actions** pour gérer la logique côté serveur. Voici le code complet avec les explications pour chaque fonction :

```typescript
"use server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import prisma from "./prisma"

// RÉCUPÉRER TOUTES LES TÂCHES
export const getAllTasks = async () => {
    const allTasks = await prisma.task.findMany({
        orderBy: {
            createAt: "desc" // Les plus récentes en premier
        }
    })
    return allTasks
}

// CRÉER UNE TÂCHE
export const createTasks = async (formData: FormData) => {
    // Simulation d'un délai de 2 secondes
    await new Promise((resolve) => setTimeout(resolve, 2000))
    const task = formData.get('task') as string

    if (!task.trim()) return // Empêche les tâches vides

    await prisma.task.create({
        data: {
            content: task
        }
    })
    revalidatePath('/') // Met à jour la liste sur l'accueil
}

// SUPPRIMER UNE TÂCHE
export const deleteTasks = async (formData: FormData) => {
    const id = formData.get('id') as string
    await prisma.task.delete({
        where: { id: Number(id) } // Conversion string -> number
    })
    revalidatePath('/')
}

// RÉCUPÉRER UNE SEULE TÂCHE (pour la modif)
export const getTasks = async (id: string) => {
    const task = await prisma.task.findUnique({
        where: { id: Number(id) }
    })
    return task
}

// METTRE À JOUR UNE TÂCHE
export const updateTask = async (formData: FormData) => {
    const id = formData.get('id') as string
    const content = formData.get("content") as string
    
    // Checkbox HTML : "on" si coché, sinon undefined
    const completed = formData.get("completed") === "on"

    await prisma.task.update({
        where: { id: Number(id) },
        data: {
            content,
            completed
        }
    })

    revalidatePath('/')
    redirect('/') // Retour à l'accueil après modification
}
```

| Fonction | Rôle | Détails Techniques |
| :--- | :--- | :--- |
| `getAllTasks` | Récupère toutes les tâches. | Trie par `createAt` décroissant. |
| `createTasks` | Ajoute une nouvelle tâche. | Vérifie que le contenu n'est pas vide. |
| `deleteTasks` | Supprime une tâche. | Capture l'ID via `formData` et convertit en `Number`. |
| `getTasks(id)` | Récupère une seule tâche. | Utilisé pour la page de modification. |
| `updateTask` | Modifie une tâche existante. | Met à jour le texte et le statut `completed`. |

---

## 🌐 4. Structure des Pages et Routage

### A. Page d'Accueil (`app/page.tsx`)
C'est le point d'entrée de l'application. Elle affiche le formulaire d'ajout et la liste des tâches.

```tsx
import TasksTabs from '@/components/TasksTabs'
import AddForm from '@/components/AddForm'

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans flex-col">
      {/* Composant pour ajouter une tâche */}
      <AddForm />
      {/* Composant pour afficher la liste des tâches */}
      <TasksTabs />
    </div>
  );
}
```

### B. Page de Détails et Modification (`app/task/[id]/page.tsx`)
Cette page dynamique permet de modifier une tâche existante. Elle utilise l'ID passé dans l'URL.

```tsx
import { getTasks, updateTask } from "@/lib/action"
import Link from "next/link"

interface Props {
    params: Promise<{ id: string }>
}

const page = async ({ params }: Props) => {
    // 1. Récupération de l'ID (asynchrone dans Next.js 15)
    const { id } = await params

    // 2. Récupération des données de la tâche
    const task = await getTasks(id)

    // Gestion du cas où la tâche n'existe pas
    if (!task) {
        return <div className="p-10 text-center text-zinc-500">Tâche non trouvée</div>
    }

    return (
        <div className="p-10 flex flex-col items-center gap-4 bg-zinc-50 min-h-screen">
            <div className="card bg-white w-96 shadow-xl border border-zinc-200">
                <form action={updateTask} className="card-body gap-4">
                    <h2 className="card-title text-zinc-800">Modifier la tâche</h2>

                    {/* ID caché pour l'action updateTask */}
                    <input type="hidden" name="id" value={task.id} />

                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text font-medium">Contenu</span>
                        </label>
                        <input
                            name="content"
                            type="text"
                            defaultValue={task.content}
                            placeholder="Nom de la tâche"
                            className="input input-bordered w-full bg-white text-zinc-800 focus:border-primary"
                        />
                    </div>

                    <div className="form-control">
                        <label className="label cursor-pointer justify-start gap-4">
                            <input
                                name="completed"
                                type="checkbox"
                                defaultChecked={task.completed}
                                className="checkbox checkbox-primary"
                            />
                            <span className="label-text">Marquer comme terminée</span>
                        </label>
                    </div>

                    <div className="card-actions justify-between mt-4">
                        <Link href="/" className="btn btn-ghost hover:bg-zinc-100">Retour</Link>
                        <button type="submit" className="btn btn-primary px-8 text-white">Mettre à jour</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default page
```

---

## 🧩 5. Composants Clés (`components/`)

### `<AddForm />` (Client Component)
*   Formulaire d'ajout rapide en haut de la page.
*   Affiche un bouton de chargement pendant la création.

### `<TasksTabs />` (Server Component)
*   Tableau DaisyUI affichant la liste des tâches.
*   **Badges dynamiques :** Affiche "complète" (bleu) ou "en cours" (neutre) selon l'état `completed`.
*   Contient les boutons de navigation vers la modification et le bouton de suppression.

### `<DeleteBtn />`
*   Composant client contenant un formulaire avec un bouton poubelle.
*   Envoie l'ID caché au serveur pour la suppression.

---

## 💡 6. Concepts Importants à Retenir pour NotebookLM

### 1. Server vs Client Components
*   Les **Server Components** (par défaut) sont parfaits pour récupérer des données (`getTasks`).
*   Les **Client Components** (`"use client"`) sont nécessaires pour l'interactivité (boutons, formulaires avec états).

### 2. Hydratation et Revalidation
*   `revalidatePath('/')` : Cette fonction est CRUCIALE. Elle demande à Next.js de mettre à jour le cache de la page pour que l'utilisateur voie instantanément les changements (après ajout, suppression ou mise à jour).

### 3. Gestion de la Checkbox HTML
*   Dans un formulaire HTML, une checkbox cochée envoie `"on"`. Si elle n'est pas cochée, elle n'envoie rien. Le code convertit cela en booléen : `const completed = formData.get("completed") === "on"`.

### 4. Conversion des Types (IDs)
*   Dans les URL de Next.js, les paramètres sont des chaînes (`string`). Puisque notre base de données utilise des entiers (`Int`), il faut toujours utiliser `Number(id)` avant d'interroger la base avec Prisma.

---

## 🛠️ 7. Historique des Corrections Majeures
*   **Lien d'édition :** Correction du lien `<Link>` qui ne pointait pas correctement vers l'ID.
*   **Suppression :** Correction de l'input caché dans `DeleteBtn` qui envoyait la chaîne de caractères `'id'` au lieu de la valeur réelle de l'ID.
*   **Next.js 15 :** Mise en conformité de la récupération des `params` (utilisation de `await` car les paramètres sont désormais des Promises).

---
*Guide généré pour l'apprentissage du développement Fullstack avec Next.js.*
