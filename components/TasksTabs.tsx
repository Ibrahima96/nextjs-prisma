import { getAllTasks } from '@/lib/action'
import Link from 'next/link'
import UpdateBtn from './UpdateBtn'
import DeleteBtn from './DeleteBtn'
const TasksTabs = async () => {

  const tasks = await getAllTasks()
  return (
    <>
      <div className="overflow-x-auto text-black">
        {
          tasks.length === 0 ? (
            <table className="table table-zebra ">
              {/* head */}
              <thead className='text-black'>
                <tr>
                  <th></th>
                  <th>Content</th>
                  <th>Create</th>
                  <th>completed</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={4} className='text-center italic font-semibold'>Pas de Tache disponible </td>
                </tr>
              </tbody>
            </table>
          ) : (
            <table className="table table-zebra ">
              {/* head */}
              <thead className='text-black'>
                <tr>
                  <th></th>
                  <th>Content</th>
                  <th>Create</th>
                  <th>completed</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody >
                {/* row 1 */}
                {tasks.map(({ id, content, createAt, completed }) => (
                  <tr key={id}>
                    <th>{id}</th>
                    <td>{content}</td>
                    <td>{createAt.toLocaleString()}</td>
                    <td>{completed ? 'ok' : 'non'}</td>
                    <td
                      className='flex items-center gap-2'>
                      <UpdateBtn />
                      <DeleteBtn id={id} />
                    </td>
                  </tr>
                ))}

              </tbody>
            </table>
          )
        }
      </div>
    </>
  )
}

export default TasksTabs