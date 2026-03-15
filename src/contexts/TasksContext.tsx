import React, {createContext, useContext, type ReactNode} from 'react';
import {useSearchParams} from 'react-router-dom';
import {useGetTasks} from '../hookes/useGetTasks';
import type {FetchState, TaskItem} from '../tasks/tasks.type';

interface TasksContextType {
    tasksList: TaskItem[];
    fetchState: FetchState;
    errorMessage: string;
    hasMore: boolean;           // ← add
    page: number;
    onPageChange: (page: number) => void;
    refetch: () => void;
}


const TasksContext = createContext<TasksContextType>({
    tasksList: [],
    fetchState: "loading",
    errorMessage: "",
    page: 1,
    onPageChange: () => {},
    refetch: () => {},
    hasMore: false,
});

export const useTasksContext = () => {
    const context = useContext(TasksContext);
    if (!context) {
        throw new Error('useTasksContext must be used within a TasksProvider');
    }
    return context;
};

interface TasksProviderProps {
    children: ReactNode;
}

export const TasksProvider: React.FC<TasksProviderProps> = ({children}) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = 5;

    const { tasksList, fetchState, errorMessage, hasMore, refetch } = useGetTasks({ page, limit });


    const onPageChange = (newPage: number) => {
        setSearchParams({page: newPage.toString()});
    };

    const value: TasksContextType = {
        tasksList,
        fetchState,
        errorMessage,
        hasMore,
        page,
        onPageChange,
        refetch,
    };
    return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
};
