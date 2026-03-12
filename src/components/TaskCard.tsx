import type {TaskItem} from "../tasks/tasks.type.ts";


function TaskCard({task}: {task : TaskItem}) {
    return <div
        className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
            task.isCompleted ? 'border-green-500' : 'border-blue-500'
        }`}
    >
        <h2 className="text-xl font-semibold text-gray-800 mb-2">{task.title}</h2>
        <p className="text-gray-600 mb-4">{task.description}</p>
        <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-500 mb-1">
                <span>Progress</span>
                <span>{task.currentProgress}/{task.targetProgress} {task.metric}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                    className={`h-2 rounded-full ${
                        task.isCompleted ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                    style={{width: `${(task.currentProgress / task.targetProgress) * 100}%`}}
                ></div>
            </div>
        </div>
        {task.isCompleted && (
            <div className="flex items-center text-green-600">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"/>
                </svg>
                Completed
            </div>
        )}
    </div>;
}


export default TaskCard;