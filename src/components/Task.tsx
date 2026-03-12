import TaskCard from "./TaskCard.tsx";
import {useGetTasks} from "../hookes/useGetTasks.ts";


const Task = () => {
    const {tasksList, fetchState, errorMessage} = useGetTasks()
    
    if (fetchState === "loading") return <LoadingView/>;
    if (fetchState === "error") return <ErrorView message={errorMessage}/>;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Task Manager</h1>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {tasksList.map((task) => <TaskCard key={task.id} task={task}/>)}
                </div>
            </div>
        </div>
    );
};


const LoadingView = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading tasks...</p>
    </div>
);

const ErrorView = ({message}: { message: string }) => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
            <p className="text-red-500 text-lg font-medium">Failed to load tasks</p>
            <p className="text-gray-400 text-sm mt-1">{message}</p>
        </div>
    </div>
);


export default Task;