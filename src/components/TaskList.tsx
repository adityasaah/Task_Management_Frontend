import type {FetchState, TaskItem} from "../tasks/tasks.type.ts";
import TaskCard from "./TaskCard.tsx";


interface TaskListProps {
    tasksList: TaskItem[];
    fetchState : FetchState;
    errorMessage : string;
}

const TaskList = ({tasksList,fetchState,errorMessage} : TaskListProps ) => {



    if (fetchState === "loading") return <LoadingView/>;
    if (fetchState === "error") return <ErrorView message={errorMessage}/>;

    return (
        <div data-testid="outer-container" >
            <div data-testid="tasks-grid" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
                {tasksList.map((task) => <TaskCard key={task.id} task={task}/>)}
            </div>
        </div>
    )
}
export default TaskList;


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
