"use client"

import { createTasks } from "@/lib/action"
import { useFormStatus } from "react-dom"

const addForm = () => {

  const BtnSubmit = () => {
    const { pending } = useFormStatus()
    return <button type="submit" disabled={pending} className="btn btn-md  bg-blue-500 hover:bg-blue-600 text-gray-100">{pending ? 'Création en cours ...' : 'Ajouter'}</button>
  }

  return (
    <form className="flex items-center w-2xl mb-4 max-w-full gap-2" action={createTasks}>
      <input type="text" name="task" placeholder="tache .." className="input w-full " required />
      <BtnSubmit />
    </form>
  )
}

export default addForm