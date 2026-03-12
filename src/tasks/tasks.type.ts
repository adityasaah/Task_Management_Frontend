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
