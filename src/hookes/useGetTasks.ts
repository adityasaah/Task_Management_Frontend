import {useEffect, useState} from "react";
import axios from "axios";
import {type TaskItem} from "../tasks/tasks.type.ts"

type FetchState = "idle" | "loading" | "success" | "error";

export function useGetTasks() {
    const [tasksList, setTasksList] = useState<TaskItem[]>([]);
    const [fetchState, setFetchState] = useState<FetchState>("idle");
    const [errorMessage, setErrorMessage] = useState<string>("");


    useEffect(() => {
        const fetchTasks = async () => {
            setFetchState("loading");
            setErrorMessage("");

            try {
                const response = await axios.get(`http://localhost:3000/tasks`);
                setTasksList(response.data.tasks || response.data); // Assuming response has tasks array, or fallback
                setFetchState("success");
            } catch (error) {
                const message = axios.isAxiosError(error)
                    ? error.response?.data?.message ?? error.message
                    : "An unexpected error occurred";
                setErrorMessage(message);
                setFetchState("error");
            }
        };
        fetchTasks();
    },[]);

    return {
        tasksList,
        fetchState,
        errorMessage,
    };
}
