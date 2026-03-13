interface AddTaskButtonProps {
    onClick: () => void;
}

const AddTaskButton = ({ onClick }: AddTaskButtonProps) => (
    <button
        onClick={onClick}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
        Add Task
    </button>
);

export default AddTaskButton;