import axios from "axios";

const TASKS_API_URL = 'http://localhost:3000/tasks';

interface TaskFormData {
    title: string;
    description: string;
    currentProgress: number;
    targetProgress: number;
    metric: string;
}

export const submitTask = (data: TaskFormData) => axios.post(TASKS_API_URL, data);