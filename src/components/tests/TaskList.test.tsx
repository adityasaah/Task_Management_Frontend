import {describe, it, expect, vi, beforeEach} from 'vitest'
import {render, screen} from '@testing-library/react'
import TaskList from '../TaskList'
import type {FetchState, TaskItem} from '../../tasks/tasks.type'
import {useTasksContext} from "../../contexts/TasksContext.tsx";

// Mock the useGetTasks hook
vi.mock('../../contexts/TasksContext.tsx', () => ({
    useTasksContext: vi.fn()
}))


interface MockPaginationPropsType {
    page: number,
    hasMore: boolean,
    hasPrev: boolean,
    onPageChange: (page: number) => void,
}

vi.mock("./TaskCard.tsx", () => ({
    default: ({ task } : {task : TaskItem}) => <div>{task.id}</div>
}));

vi.mock("./Pagination.tsx", () => ({
    Pagination: ({ page, hasMore, hasPrev, onPageChange } : MockPaginationPropsType) => (
        <div >
            <span >{page}</span>
            <span >{String(hasMore)}</span>
            <span >{String(hasPrev)}</span>
            <button onClick={() => onPageChange(page + 1)}>Next</button>
            <button onClick={() => onPageChange(page - 1)}>Prev</button>
        </div>
    )
}));


const mockUseTasksContext = vi.mocked(useTasksContext)


const createMockReturnValue = (tasksList: TaskItem[] = [], fetchState: FetchState, errorMessage: string = '', page: number, onPageChange: (page: number) => void, hasMore: boolean, refetch: () => void) => ({
    tasksList,
    fetchState,
    errorMessage,
    page,
    onPageChange,
    hasMore,
    refetch
})

const mockTask1: TaskItem = {
    id: '1',
    title: 'Complete Project',
    description: 'Finish the task manager app',
    currentProgress: 50,
    targetProgress: 100,
    metric: 'tasks',
    isCompleted: false,
    createdAt: new Date('2024-01-01')
}
const mockTask2: TaskItem = {
    id: '2',
    title: 'Write Tests',
    description: 'Finish the testing',
    currentProgress: 50,
    targetProgress: 100,
    metric: 'tasks',
    isCompleted: false,
    createdAt: new Date('2024-01-01')
}


describe('TaskList Component', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('displays loading message when fetchState is loading', () => {
        mockUseTasksContext.mockReturnValue(createMockReturnValue([], 'loading', '', 1, () => {
        }, true, () => {
        }))

        render(<TaskList/>)

        expect(screen.getByText('Loading tasks...')).toBeInTheDocument()
    })


    it('displays error message when fetchState is error', () => {
        const errorMessage = 'Network error occurred'

        mockUseTasksContext.mockReturnValue(createMockReturnValue([], 'error', errorMessage, 1, () => {
        }, true, () => {
        }))


        render(<TaskList/>)

        expect(screen.getByText('Failed to load tasks')).toBeInTheDocument()
        expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })

    it('displays generic error message when errorMessage is empty and fetchState is error', () => {
        mockUseTasksContext.mockReturnValue(createMockReturnValue([], 'error', '', 1, () => {
        }, true, () => {
        }))


        render(<TaskList/>)

        expect(screen.getByText('Failed to load tasks')).toBeInTheDocument()
        const messageParagraph = screen.getByText('Failed to load tasks')
            .parentElement?.querySelector('p:last-child')
        expect(messageParagraph).toBeEmptyDOMElement()
    })


    it('renders empty task list without crashing when fetchState is success and tasksList is returned empty', () => {
        mockUseTasksContext.mockReturnValue(createMockReturnValue([], 'success', '', 1, () => {
        }, true, () => {
        }))


        render(<TaskList/>)

        const innerDiv = screen.getByTestId('tasks-grid')

        expect(innerDiv).toBeEmptyDOMElement()
    })


    it('renders all tasks as TaskCard components when fetchState is success and tasksList is not empty', () => {
        mockUseTasksContext.mockReturnValue(createMockReturnValue([mockTask1, mockTask2], 'success', '', 1, () => {
        }, true, () => {
        }))


        render(<TaskList/>)

        expect(screen.getByText('Complete Project')).toBeInTheDocument()
        expect(screen.getByText('Write Tests')).toBeInTheDocument()
    })

    it("should renders Pagination when fetch is successful", () => {
        vi.mocked(useTasksContext).mockReturnValue(createMockReturnValue([mockTask1], 'success', '', 12, (page:number) => {
            console.log(page);
        }, true, () => {
        }));
        render(<TaskList />);
        expect(screen.getByText(`${12}`)).toBeInTheDocument();
        expect(screen.getByText(`Next`)).toBeInTheDocument();
        expect(screen.getByText(`Prev`)).toBeInTheDocument();
    });

    it("should renders TaskCard when fetch is successful", () => {
        vi.mocked(useTasksContext).mockReturnValue(createMockReturnValue([mockTask1], 'success', '', 1, (page:number) => {
            console.log(page);
        }, true, () => {
        }));
        render(<TaskList />);
        expect(screen.getByText(`${1}`)).toBeInTheDocument();
    });

})


