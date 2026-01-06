"use client"

import { useFormStatus } from "react-dom"

const addForm = () => {

  const BtnSubmit = () => {
    const { pending } = useFormStatus()
    return <button disabled={pending} className="btn bg-blue-500 hover:bg-blue-600">{pending ? 'Création en cours ...' : 'Ajouter'}</button>
  }

  return (
    <>Text</>
  )
}

export default addForm