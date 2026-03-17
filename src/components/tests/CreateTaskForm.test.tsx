import { render, screen } from '@testing-library/react';
import CreateTaskForm from '../CreateTaskForm';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/react';
import * as tasksService from '../services/tasks.service';
// import type { AxiosResponse } from 'axios';
import { server } from '../../mocks/node';


interface TaskFormData {
    title: string;
    description: string;
    currentProgress: string;
    targetProgress: string;
    metric: string;
}


const VALID_FORM_DATA : TaskFormData = {
    title: 'Test Task',
    description: 'Test Description',
    currentProgress: '0',
    targetProgress: '10',
    metric: 'hours',
};

const IN_VALID_FORM_DATA = {
    title: 'Test Task 2',
    description: 'Test Description',
    currentProgress: '0',
    targetProgress: '10',
    metric: 'hours',
};

const VALID_FORM_DATA_2 = {
    title: 'Test Task 3',
    description: 'Test Description',
    currentProgress: '0',
    targetProgress: '10',
    metric: 'hours',
};


async function fillForm(user: ReturnType<typeof userEvent.setup>, formData: TaskFormData) {
    await user.type(screen.getByLabelText(/title/i), formData.title);
    await user.type(screen.getByLabelText(/description/i), formData.description);
    await user.type(screen.getByLabelText(/metric/i), formData.metric);

    const targetInput = screen.getByLabelText(/target progress/i);
    await user.clear(targetInput);
    await user.type(targetInput, formData.targetProgress.toString());
}

async function submitForm(user: ReturnType<typeof userEvent.setup>) {
    await user.click(screen.getByRole('button', { name: /create task/i }));
}

async function clickCancel(user: ReturnType<typeof userEvent.setup>) {
    await user.click(screen.getByRole('button', { name: /cancel/i }));
}

describe('CreateTaskForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    beforeAll(() => server.listen())
    afterEach(() => server.resetHandlers())
    afterAll(() => server.close())

    it('renders the form with all required fields', () => {
        const onClose = vi.fn();
        const refetch = vi.fn();
        render(<CreateTaskForm onClose={onClose} refetch={refetch} />);

        expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/current progress/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/target progress/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/metric/i)).toBeInTheDocument();
    });


    it('should submits the correct payload', async () => {
         const submitTaskSpy = vi.spyOn(tasksService, 'submitTask');

        const user = userEvent.setup();
        const onClose = vi.fn();
        const refetch = vi.fn();

        render(<CreateTaskForm onClose={onClose} refetch={refetch} />);

        await fillForm(user, VALID_FORM_DATA);
        await submitForm(user);

        await waitFor(() => {
            expect(submitTaskSpy).toHaveBeenCalledWith({
                title: VALID_FORM_DATA.title,
                description: VALID_FORM_DATA.description,
                currentProgress: Number(VALID_FORM_DATA.currentProgress),
                targetProgress: Number(VALID_FORM_DATA.targetProgress),
                metric: VALID_FORM_DATA.metric,
            });
        });

        submitTaskSpy.mockRestore();
    });


    it('calls refetch and onClose after successful form submission', async () => {
        // vi.mocked(submitTask).mockResolvedValueOnce({ data: {} } as AxiosResponse);
        const user = userEvent.setup();

        const onClose = vi.fn();
        const refetch = vi.fn();

        render(<CreateTaskForm onClose={onClose} refetch={refetch} />);
        await fillForm(user, VALID_FORM_DATA);
        await submitForm(user);

        await waitFor(() => {
            expect(refetch).toHaveBeenCalledOnce();
            expect(onClose).toHaveBeenCalledOnce();
        });
    });

    it('does not call onClose or refetch when submission fails', async () => {
        // vi.mocked(submitTask).mockRejectedValueOnce(new Error('Network error'));
        const user = userEvent.setup();

        const onClose = vi.fn();
        const refetch = vi.fn();

        render(<CreateTaskForm onClose={onClose} refetch={refetch} />);
        await fillForm(user,IN_VALID_FORM_DATA);
        await submitForm(user);

        await waitFor(() => {
            expect(refetch).not.toHaveBeenCalled();
            expect(onClose).not.toHaveBeenCalled();
        });
    });


    it('disables the submit button while submitting', async () => {
        // vi.mocked(submitTask).mockReturnValue(new Promise(() => { })); // never resolves
        const user = userEvent.setup();

        const onClose = vi.fn();
        const refetch = vi.fn();


        render(<CreateTaskForm onClose={onClose} refetch={refetch} />);
        await fillForm(user, VALID_FORM_DATA_2);
        await submitForm(user);

        expect(screen.getByRole('button', { name: /creating/i })).toBeDisabled();
    });

    it('calls the onClose function on clicking cancel button', async () => {
        // vi.mocked(submitTask).mockResolvedValueOnce({ data: {} } as AxiosResponse); // never resolves
        const user = userEvent.setup();

        const onClose = vi.fn();
        const refetch = vi.fn();


        render(<CreateTaskForm onClose={onClose} refetch={refetch} />);
        await fillForm(user, VALID_FORM_DATA);
        await clickCancel(user);

        await waitFor(() => {
            expect(onClose).toHaveBeenCalled();
        });
    });

});
