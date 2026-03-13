import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import TaskList from '../TaskList'
import { useGetTasks } from '../../hookes/useGetTasks'

// Mock the useGetTasks hook
vi.mock('../../hookes/useGetTasks', () => ({
  useGetTasks: vi.fn()
}))

const mockUseGetTasks = vi.mocked(useGetTasks)

describe('TaskList Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Loading State', () => {
    it('displays loading message when fetchState is loading', () => {
      mockUseGetTasks.mockReturnValue({
        tasksList: [],
        fetchState: 'loading',
        errorMessage: ''
      })

      render(<TaskList />)

      expect(screen.getByText('Loading tasks...')).toBeInTheDocument()
    })

  })

  describe('Error State', () => {
    it('displays error message when fetchState is error', () => {
      const errorMessage = 'Network error occurred'
      mockUseGetTasks.mockReturnValue({
        tasksList: [],
        fetchState: 'error',
        errorMessage
      })

      render(<TaskList />)

      expect(screen.getByText('Failed to load tasks')).toBeInTheDocument()
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })

    it('displays generic error message when errorMessage is empty', () => {
      mockUseGetTasks.mockReturnValue({
        tasksList: [],
        fetchState: 'error',
        errorMessage: ''
      })

      render(<TaskList />)

      expect(screen.getByText('Failed to load tasks')).toBeInTheDocument()
      const messageParagraph = screen.getByText('Failed to load tasks')
          .parentElement?.querySelector('p:last-child')
      expect(messageParagraph).toBeEmptyDOMElement()
    })

  })

  describe('Success State - Empty Tasks', () => {
    it('renders empty task list without crashing', () => {
      mockUseGetTasks.mockReturnValue({
        tasksList: [],
        fetchState: 'success',
        errorMessage: ''
      })

      render(<TaskList />)

      // Should render the grid container but no task cards
      const gridContainer = screen.getByRole('generic', { hidden: true })
      expect(gridContainer).toHaveClass('grid', 'gap-6', 'md:grid-cols-2', 'lg:grid-cols-3', 'mb-8')
    })

    it('does not render any TaskCard components when tasksList is empty', () => {
      mockUseGetTasks.mockReturnValue({
        tasksList: [],
        fetchState: 'success',
        errorMessage: ''
      })

      render(<TaskList />)

      // No task cards should be rendered
      expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument()
    })
  })

  describe('Success State - With Tasks', () => {
    const mockTasks = [
      {
        id: '1',
        title: 'Complete Project',
        description: 'Finish the task manager app',
        currentProgress: 50,
        targetProgress: 100,
        metric: 'tasks',
        isCompleted: false,
        createdAt: new Date('2024-01-01')
      },
      {
        id: '2',
        title: 'Write Tests',
        description: 'Create comprehensive test suite',
        currentProgress: 100,
        targetProgress: 100,
        metric: 'tests',
        isCompleted: true,
        createdAt: new Date('2024-01-02')
      }
    ]

    it('renders all tasks as TaskCard components', () => {
      mockUseGetTasks.mockReturnValue({
        tasksList: mockTasks,
        fetchState: 'success',
        errorMessage: ''
      })

      render(<TaskList />)

      expect(screen.getByText('Complete Project')).toBeInTheDocument()
      expect(screen.getByText('Write Tests')).toBeInTheDocument()
    })

    it('renders correct number of task cards', () => {
      mockUseGetTasks.mockReturnValue({
        tasksList: mockTasks,
        fetchState: 'success',
        errorMessage: ''
      })

      render(<TaskList />)

      // Should have 2 task cards
      const taskCards = screen.getAllByRole('generic').filter(
        element => element.className.includes('bg-white') && element.className.includes('rounded-lg')
      )
      expect(taskCards).toHaveLength(2)
    })

    it('uses task.id as key for TaskCard components', () => {
      mockUseGetTasks.mockReturnValue({
        tasksList: mockTasks,
        fetchState: 'success',
        errorMessage: ''
      })

      render(<TaskList />)

      // The key is not directly testable in DOM, but we can verify the component renders correctly
      expect(screen.getByText('Complete Project')).toBeInTheDocument()
      expect(screen.getByText('Write Tests')).toBeInTheDocument()
    })

    it('renders grid with responsive classes', () => {
      mockUseGetTasks.mockReturnValue({
        tasksList: mockTasks,
        fetchState: 'success',
        errorMessage: ''
      })

      render(<TaskList />)

      const gridContainer = screen.getByRole('generic', { hidden: true })
      expect(gridContainer).toHaveClass('grid', 'gap-6', 'md:grid-cols-2', 'lg:grid-cols-3', 'mb-8')
    })
  })

  describe('Task Progress Display', () => {
    it('displays progress for incomplete tasks', () => {
      const incompleteTask = [{
        id: '1',
        title: 'Incomplete Task',
        description: 'Not done yet',
        currentProgress: 30,
        targetProgress: 100,
        metric: 'items',
        isCompleted: false,
        createdAt: new Date()
      }]

      mockUseGetTasks.mockReturnValue({
        tasksList: incompleteTask,
        fetchState: 'success',
        errorMessage: ''
      })

      render(<TaskList />)

      expect(screen.getByText('30/100 items')).toBeInTheDocument()
    })

    it('displays progress for completed tasks', () => {
      const completedTask = [{
        id: '1',
        title: 'Completed Task',
        description: 'All done',
        currentProgress: 100,
        targetProgress: 100,
        metric: 'tasks',
        isCompleted: true,
        createdAt: new Date()
      }]

      mockUseGetTasks.mockReturnValue({
        tasksList: completedTask,
        fetchState: 'success',
        errorMessage: ''
      })

      render(<TaskList />)

      expect(screen.getByText('100/100 tasks')).toBeInTheDocument()
      expect(screen.getByText('Completed')).toBeInTheDocument()
    })

    it('handles zero progress correctly', () => {
      const zeroProgressTask = [{
        id: '1',
        title: 'New Task',
        description: 'Just started',
        currentProgress: 0,
        targetProgress: 50,
        metric: 'pages',
        isCompleted: false,
        createdAt: new Date()
      }]

      mockUseGetTasks.mockReturnValue({
        tasksList: zeroProgressTask,
        fetchState: 'success',
        errorMessage: ''
      })

      render(<TaskList />)

      expect(screen.getByText('0/50 pages')).toBeInTheDocument()
    })

    it('handles edge case where currentProgress > targetProgress', () => {
      const overProgressTask = [{
        id: '1',
        title: 'Overachieved Task',
        description: 'Went beyond target',
        currentProgress: 120,
        targetProgress: 100,
        metric: 'units',
        isCompleted: false,
        createdAt: new Date()
      }]

      mockUseGetTasks.mockReturnValue({
        tasksList: overProgressTask,
        fetchState: 'success',
        errorMessage: ''
      })

      render(<TaskList />)

      expect(screen.getByText('120/100 units')).toBeInTheDocument()
    })
  })

  describe('Task Completion Status', () => {
    it('shows completed indicator for completed tasks', () => {
      const completedTask = [{
        id: '1',
        title: 'Done Task',
        description: 'Finished',
        currentProgress: 100,
        targetProgress: 100,
        metric: 'items',
        isCompleted: true,
        createdAt: new Date()
      }]

      mockUseGetTasks.mockReturnValue({
        tasksList: completedTask,
        fetchState: 'success',
        errorMessage: ''
      })

      render(<TaskList />)

      expect(screen.getByText('Completed')).toBeInTheDocument()
    })

    it('does not show completed indicator for incomplete tasks', () => {
      const incompleteTask = [{
        id: '1',
        title: 'Incomplete Task',
        description: 'Still working',
        currentProgress: 50,
        targetProgress: 100,
        metric: 'items',
        isCompleted: false,
        createdAt: new Date()
      }]

      mockUseGetTasks.mockReturnValue({
        tasksList: incompleteTask,
        fetchState: 'success',
        errorMessage: ''
      })

      render(<TaskList />)

      expect(screen.queryByText('Completed')).not.toBeInTheDocument()
    })
  })

  describe('Large Task Lists', () => {
    it('handles large number of tasks efficiently', () => {
      const largeTaskList = Array.from({ length: 50 }, (_, index) => ({
        id: `task-${index}`,
        title: `Task ${index}`,
        description: `Description for task ${index}`,
        currentProgress: Math.floor(Math.random() * 100),
        targetProgress: 100,
        metric: 'items',
        isCompleted: Math.random() > 0.5,
        createdAt: new Date()
      }))

      mockUseGetTasks.mockReturnValue({
        tasksList: largeTaskList,
        fetchState: 'success',
        errorMessage: ''
      })

      render(<TaskList />)

      // Should render all 50 tasks without crashing
      expect(screen.getByText('Task 0')).toBeInTheDocument()
      expect(screen.getByText('Task 49')).toBeInTheDocument()
    })
  })

  describe('Hook Integration', () => {
    it('calls useGetTasks hook correctly', () => {
      mockUseGetTasks.mockReturnValue({
        tasksList: [],
        fetchState: 'idle',
        errorMessage: ''
      })

      render(<TaskList />)

      expect(mockUseGetTasks).toHaveBeenCalledTimes(1)
    })

    it('re-renders when hook data changes', async () => {
      const { rerender } = render(<TaskList />)

      // Initially loading
      mockUseGetTasks.mockReturnValue({
        tasksList: [],
        fetchState: 'loading',
        errorMessage: ''
      })

      rerender(<TaskList />)
      expect(screen.getByText('Loading tasks...')).toBeInTheDocument()

      // Then success with data
      mockUseGetTasks.mockReturnValue({
        tasksList: [{
          id: '1',
          title: 'New Task',
          description: 'Test task',
          currentProgress: 0,
          targetProgress: 100,
          metric: 'items',
          isCompleted: false,
          createdAt: new Date()
        }],
        fetchState: 'success',
        errorMessage: ''
      })

      rerender(<TaskList />)
      expect(screen.getByText('New Task')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('renders semantic HTML structure', () => {
      mockUseGetTasks.mockReturnValue({
        tasksList: [],
        fetchState: 'success',
        errorMessage: ''
      })

      render(<TaskList />)

      // Should have proper container structure
      const container = screen.getByRole('generic', { hidden: true })
      expect(container).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('handles undefined task properties gracefully', () => {
      const malformedTask = [{
        id: '1',
        title: undefined as any,
        description: undefined as any,
        currentProgress: undefined as any,
        targetProgress: 100,
        metric: 'items',
        isCompleted: false,
        createdAt: new Date()
      }]

      mockUseGetTasks.mockReturnValue({
        tasksList: malformedTask,
        fetchState: 'success',
        errorMessage: ''
      })

      // Should not crash, though TaskCard might handle this
      expect(() => render(<TaskList />)).not.toThrow()
    })

    it('handles tasks with very long titles and descriptions', () => {
      const longTask = [{
        id: '1',
        title: 'A'.repeat(200),
        description: 'B'.repeat(500),
        currentProgress: 50,
        targetProgress: 100,
        metric: 'characters',
        isCompleted: false,
        createdAt: new Date()
      }]

      mockUseGetTasks.mockReturnValue({
        tasksList: longTask,
        fetchState: 'success',
        errorMessage: ''
      })

      render(<TaskList />)

      // Should render without issues
      expect(screen.getByText('A'.repeat(200))).toBeInTheDocument()
    })

    it('handles tasks with special characters in title and description', () => {
      const specialCharTask = [{
        id: '1',
        title: 'Task with émojis 🎉 and spëcial chärs',
        description: 'Description with <script> tags & symbols @#$%',
        currentProgress: 25,
        targetProgress: 100,
        metric: 'tests',
        isCompleted: false,
        createdAt: new Date()
      }]

      mockUseGetTasks.mockReturnValue({
        tasksList: specialCharTask,
        fetchState: 'success',
        errorMessage: ''
      })

      render(<TaskList />)

      expect(screen.getByText('Task with émojis 🎉 and spëcial chärs')).toBeInTheDocument()
    })
  })
})

