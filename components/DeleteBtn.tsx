import { deleteTasks } from "@/lib/action"

const DeleteBtn = ({ id }: { id: string | number }) => {
  return (
    <form action={deleteTasks}>
      <input type="hidden" name='id' value={id} />
      <button className="btn btn-soft btn-error hover:text-gray-500">delete</button>
    </form>
  )
}

export default DeleteBtn