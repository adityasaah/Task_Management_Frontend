// useGetTasks.ts
import { useEffect, useState } from "react";
import axios from "axios";
import { type FetchState, type TaskItem } from "../tasks/tasks.type.ts";

interface UseGetTasksParams {
    page: number;
    limit: number;
}

interface UseGetTasksReturn {
    tasksList: TaskItem[];
    fetchState: FetchState;
    errorMessage: string;
    hasMore: boolean;
    refetch: () => void;
}

const buildTasksUrl = (page: number, limit: number): string =>
    `http://localhost:3000/tasks?page=${page}&pageSize=${limit}`;

const extractTasks = (data: unknown): TaskItem[] =>
    (data as any)?.tasks ?? (data as TaskItem[]) ?? [];

const extractErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
        return error.response?.data?.message ?? error.message;
    }
    return "An unexpected error occurred";
};

export function useGetTasks({ page, limit }: UseGetTasksParams): UseGetTasksReturn {
    const [tasksList, setTasksList] = useState<TaskItem[]>([]);
    const [fetchState, setFetchState] = useState<FetchState>("idle");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [hasMore, setHasMore] = useState<boolean>(false);

    const fetchTasks = async () => {
        setFetchState("loading");
        setErrorMessage("");

        try {
            const response = await axios.get(buildTasksUrl(page, limit));
            const tasks = extractTasks(response.data);

            setTasksList(tasks);
            setHasMore(tasks.length === limit);
            setFetchState("success");
        } catch (error) {
            setErrorMessage(extractErrorMessage(error));
            setFetchState("error");
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [page, limit]);

    return {
        tasksList,
        fetchState,
        errorMessage,
        hasMore,
        refetch: fetchTasks,
    };
}