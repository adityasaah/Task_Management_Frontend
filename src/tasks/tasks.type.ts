export interface TaskItem {
    id: string;
    title: string;
    description: string;
    currentProgress: number;
    targetProgress: number;
    metric: string;
    isCompleted: boolean;
    createdAt: Date;
}


export type FetchState = "idle" | "loading" | "success" | "error";