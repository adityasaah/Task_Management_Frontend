import AddTaskButton from "./AddTaskButton.tsx";

interface PageHeaderProps {
    onAddTask: () => void;
}

const PageHeader = ({ onAddTask }: PageHeaderProps) => (
    <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Task Manager</h1>
        <AddTaskButton onClick={onAddTask} />
    </div>
);

export default PageHeader;