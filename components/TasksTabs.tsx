import { getAllTasks } from '@/lib/action'
const TasksTabs = async () => {

  const tasks = await getAllTasks()
  return (
    <></>
  )
}

export default TasksTabs