import {describe, it, expect, vi, beforeEach} from 'vitest'
import {render, screen} from '@testing-library/react'
import TaskList from '../TaskList'
import {useGetTasks} from '../../hookes/useGetTasks'
import type {FetchState, TaskItem} from '../../tasks/tasks.type'

// Mock the useGetTasks hook
vi.mock('../../hookes/useGetTasks', () => ({
    useGetTasks: vi.fn()
}))

const mockUseGetTasks = vi.mocked(useGetTasks)


const createMockReturnValue = (tasksList: TaskItem[] = [], fetchState: FetchState, errorMessage: string = '') => ({
    tasksList,
    fetchState,
    errorMessage
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
        // mockUseGetTasks.mockReturnValue({
        //     tasksList: [],
        //     fetchState: 'loading',
        //     errorMessage: ''
        // })
        mockUseGetTasks.mockReturnValue(createMockReturnValue([], 'loading', ''))

        render(<TaskList/>)

        expect(screen.getByText('Loading tasks...')).toBeInTheDocument()
    })


    it('displays error message when fetchState is error', () => {
        const errorMessage = 'Network error occurred'
        // mockUseGetTasks.mockReturnValue({
        //     tasksList: [],
        //     fetchState: 'error',
        //     errorMessage
        // })

        mockUseGetTasks.mockReturnValue(createMockReturnValue([], 'error', errorMessage))

        render(<TaskList/>)

        expect(screen.getByText('Failed to load tasks')).toBeInTheDocument()
        expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })

    it('displays generic error message when errorMessage is empty and fetchState is error', () => {
        // mockUseGetTasks.mockReturnValue({
        //     tasksList: [],
        //     fetchState: 'error',
        //     errorMessage: ''
        // })

        mockUseGetTasks.mockReturnValue(createMockReturnValue([], 'error', ''))

        render(<TaskList/>)

        expect(screen.getByText('Failed to load tasks')).toBeInTheDocument()
        const messageParagraph = screen.getByText('Failed to load tasks')
            .parentElement?.querySelector('p:last-child')
        expect(messageParagraph).toBeEmptyDOMElement()
    })


    it('renders empty task list without crashing when fetchState is success and tasksList is returned empty', () => {
        // mockUseGetTasks.mockReturnValue({
        //     tasksList: [],
        //     fetchState: 'success',
        //     errorMessage: ''
        // })

        mockUseGetTasks.mockReturnValue(createMockReturnValue([], 'success', ''))

        render(<TaskList/>)

        const innerDiv = screen.getByTestId('tasks-grid')

        expect(innerDiv).toBeEmptyDOMElement()
    })


    it('renders all tasks as TaskCard components when fetchState is success and tasksList is not empty', () => {

        // mockUseGetTasks.mockReturnValue({
        //     tasksList: mockTasks,
        //     fetchState: 'success',
        //     errorMessage: ''
        // })

        mockUseGetTasks.mockReturnValue(createMockReturnValue([mockTask1, mockTask2], 'success', ''))

        render(<TaskList/>)

        expect(screen.getByText('Complete Project')).toBeInTheDocument()
        expect(screen.getByText('Write Tests')).toBeInTheDocument()
    })

})


