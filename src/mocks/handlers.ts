import { http, HttpResponse } from 'msw'


interface TaskFormData {
    title: string;
    description: string;
    currentProgress: number;
    targetProgress: number;
    metric: string;
}

export const handlers = [
    http.post('http://localhost:3000/tasks', async ({ request }) => {
        const body = await request.json() as TaskFormData;

        console.log(body);
        
        if(body.title === 'Test Task 3') {
            await new Promise(resolve => setTimeout(resolve, 2000));

            return HttpResponse.json({ message: 'valid task data' }, { status: 400 });
        }
        if(body.title === 'Test Task 2') {
            return HttpResponse.json({ message: 'Invalid task data' }, { status: 400 });
        }

        return HttpResponse.json({
            id: 1,
            title: body.title,
            description: body.description,
            currentProgress: body.currentProgress,
            targetProgress: body.targetProgress,
            metric: body.metric,
            createdAt : new Date().toISOString(),
        }, { status: 201 });
    }),
]