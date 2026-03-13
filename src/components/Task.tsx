import TaskList from "./TaskList.tsx";
import Modal from "./Modal.tsx";
import CreateTaskForm from "./CreateTaskForm.tsx";
import PageHeader from "./PageHeader.tsx";
import useTaskModal from "../hookes/useTaskModal.ts";
import {useGetTasks} from "../hookes/useGetTasks.ts";
import { useState, useEffect } from "react";

const ITEMS_PER_PAGE = 5;

const Task = () => {
    const modal = useTaskModal();
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const page = parseInt(urlParams.get('page') || '1', 10);
        setCurrentPage(page);
    }, []);

    const {tasksList, fetchState, errorMessage, refetch} = useGetTasks(currentPage);

    const handlePageChange = (page: number) => {
        const url = new URL(window.location.href);
        url.searchParams.set('page', page.toString());
        window.history.pushState({}, '', url.toString());
        setCurrentPage(page);
    };

    const hasNext = tasksList.length === ITEMS_PER_PAGE;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <PageHeader onAddTask={modal.open} />
                <TaskList 
                    tasksList={tasksList} 
                    fetchState={fetchState} 
                    errorMessage={errorMessage} 
                    currentPage={currentPage} 
                    onPageChange={handlePageChange} 
                    hasNext={hasNext} 
                />
                <Modal isOpen={modal.isOpen} onClose={modal.close}>
                    <CreateTaskForm onTaskCreated={refetch} onClose={modal.close} />
                </Modal>
            </div>
        </div>
    );
};

export default Task;