import { getTasks, updateTask } from "@/lib/action"
import Link from "next/link"

interface Props {
    params: Promise<{ id: string }>
}

const page = async ({ params }: Props) => {
    // 1. Dans Next.js 15, les paramètres d'URL (params) sont asynchrones.
    // On doit utiliser 'await' pour récupérer l'ID de la tâche.
    const { id } = await params

    // 2. On récupère les données de la tâche depuis la base de données via Prisma.
    const task = await getTasks(id)

    // Si la tâche n'existe pas (mauvais ID dans l'URL), on affiche un message d'erreur.
    if (!task) {
        return <div className="p-10 text-center text-zinc-500">Tâche non trouvée</div>
    }

    return (
        <div className="p-10 flex flex-col items-center gap-4 bg-zinc-50 min-h-screen">
            <div className="card bg-white w-96 shadow-xl border border-zinc-200">
                {/* 3. Le formulaire utilise l'action "updateTask" définie dans @/lib/action */}
                <form action={updateTask} className="card-body gap-4">
                    <h2 className="card-title text-zinc-800">Modifier la tâche</h2>

                    {/* On passe l'ID de la tâche dans un input caché pour que l'action sache quelle tâche modifier */}
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
                            {/* Checkbox pour marquer la tâche comme terminée */}
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
                        {/* Bouton pour revenir à l'accueil sans modifier */}
                        <Link href="/" className="btn btn-ghost hover:bg-zinc-100">Retour</Link>
                        {/* Le bouton submit déclenche l'action du formulaire (updateTask) */}
                        <button type="submit" className="btn btn-primary px-8 text-white">Mettre à jour</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default page