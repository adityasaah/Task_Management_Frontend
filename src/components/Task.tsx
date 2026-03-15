import TaskList from "./TaskList.tsx";
import Modal from "./Modal.tsx";
import CreateTaskForm from "./CreateTaskForm.tsx";
import PageHeader from "./PageHeader.tsx";
import useTaskModal from "../hookes/useTaskModal.ts";
import {useGetTasks} from "../hookes/useGetTasks.ts";


const Task = () => {
    const modal = useTaskModal();
    const {tasksList, fetchState, errorMessage, refetch} = useGetTasks();

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <PageHeader onAddTask={modal.open}/>
                <TaskList tasksList={tasksList} fetchState={fetchState} errorMessage={errorMessage}/>
                <Modal isOpen={modal.isOpen} onClose={modal.close}>
                    <CreateTaskForm refetch={refetch} onClose={modal.close}/>
                </Modal>
            </div>
        </div>
    );
};

export default Task;