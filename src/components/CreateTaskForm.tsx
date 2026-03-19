import React, { useState } from 'react';
import { submitTask } from './services/tasks.service';


interface CreateTaskFormProps {
    onClose: () => void;
    refetch: () => void;
}



const CreateTaskForm: React.FC<CreateTaskFormProps> = ({ onClose, refetch }) => {

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        currentProgress: 0,
        targetProgress: 1,
        metric: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'currentProgress' || name === 'targetProgress' ? Number(value) : value
        }));
    };




    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await submitTask(formData);
            refetch();
            onClose();
        } catch (error) {
            console.error('Error creating task:', error);
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Create New Task</h2>

            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                </label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="currentProgress" className="block text-sm font-medium text-gray-700 mb-1">
                        Current Progress
                    </label>
                    <input
                        type="text"
                        id="currentProgress"
                        name="currentProgress"
                        value={formData.currentProgress}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label htmlFor="targetProgress" className="block text-sm font-medium text-gray-700 mb-1">
                        Target Progress
                    </label>
                    <input
                        type="text"
                        id="targetProgress"
                        name="targetProgress"
                        value={formData.targetProgress}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="metric" className="block text-sm font-medium text-gray-700 mb-1">
                    Metric
                </label>
                <input
                    type="text"
                    id="metric"
                    name="metric"
                    value={formData.metric}
                    onChange={handleChange}
                    placeholder="e.g., hours, tasks, pages"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    {isSubmitting ? 'Creating...' : 'Create Task'}
                </button>
            </div>
        </form>
    );
};

export default CreateTaskForm;
