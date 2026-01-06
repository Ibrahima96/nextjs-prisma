"use client"

import { creatTasts } from "@/lib/action"
import { useFormStatus } from "react-dom"

const addForm = () => {

  const BtnSubmit = () => {
    const { pending } = useFormStatus()
    return <button type="submit" disabled={pending} className="btn bg-blue-500 hover:bg-blue-600">{pending ? 'Création en cours ...' : 'Ajouter'}</button>
  }

  return (
    <form className="max-w-4xl flex items-center mb-3" action={creatTasts}>
      <input type="text" name="task" placeholder="tache .." className="input "/>

    </form>
  )
}

export default addForm