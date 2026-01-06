
import TasksTabs from '@/components/TasksTabs'
import AddForm from '@/components/AddForm'


export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans flex-col">
      <AddForm />
      <TasksTabs />
    </div>
  );
}
