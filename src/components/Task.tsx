import TaskList from "./TaskList.tsx";
import Modal from "./Modal.tsx";
import CreateTaskForm from "./CreateTaskForm.tsx";
import PageHeader from "./PageHeader.tsx";
import useTaskModal from "../hookes/useTaskModal.ts";
import { useTasksContext } from "../contexts/TasksContext.tsx";


const Task = () => {
    const modal = useTaskModal();
    const { refetch } = useTasksContext();

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <PageHeader onAddTask={modal.open}/>
                <TaskList  />
                <Modal isOpen={modal.isOpen} onClose={modal.close}>
                    <CreateTaskForm refetch={refetch} onClose={modal.close}/>
                </Modal>
            </div>
        </div>
    );
};

export default Task;