import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
} from 'react';
import { Task, TaskContextType } from './types/types';

const TaskContext = createContext<TaskContextType | undefined>(undefined);

interface TaskProviderProps {
    children: React.ReactNode;
}

export function TaskProvider({ children }: TaskProviderProps) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [filter, setFilter] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [history, setHistory] = useState<Task[][]>([[]]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    useEffect(() => {
        const tasks = localStorage.getItem('tasks');
        const history = localStorage.getItem('history');
        const currentIndex = localStorage.getItem('currentIndex');
        if (tasks) {
            setTasks(JSON.parse(tasks));
        }
        if (history) {
            setHistory(JSON.parse(history));
        }
        if (currentIndex) {
            setCurrentIndex(JSON.parse(currentIndex));
        }
    }, []);

    useEffect(() => {
        if (tasks.length || currentIndex) {
            localStorage.setItem('tasks', JSON.stringify(tasks));
            localStorage.setItem('history', JSON.stringify(history));
            localStorage.setItem('currentIndex', JSON.stringify(currentIndex));
        }
    }, [currentIndex, history, tasks]);

    const updateHistory = useCallback(
        (newTasks: Task[]) => {
            const newHistory = history.slice(0, currentIndex + 1);
            newHistory.push(newTasks);
            setHistory(newHistory);
            setCurrentIndex(newHistory.length - 1);
        },
        [history, currentIndex],
    );

    const addTask = (text: string) => {
        if (text.trim() !== '') {
            const newTasks = [
                ...tasks,
                { id: Date.now(), text, completed: false },
            ];
            setTasks(newTasks);
            updateHistory(newTasks);
        }
    };

    const toggleTask = (id: number) => {
        const newTasks = tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task,
        );
        setTasks(newTasks);
        updateHistory(newTasks);
    };

    const deleteTask = (id: number) => {
        const newTasks = tasks.filter((task) => task.id !== id);
        setTasks(newTasks);
        updateHistory(newTasks);
    };

    const undo = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setTasks(history[currentIndex - 1]);
        }
    };

    const redo = () => {
        if (currentIndex < history.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setTasks(history[currentIndex + 1]);
        }
    };

    const filteredTasks = tasks.filter((task) => {
        const matchesSearch = task.text
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        switch (filter) {
            case 'completed':
                return task.completed && matchesSearch;
            case 'incomplete':
                return !task.completed && matchesSearch;
            default:
                return matchesSearch;
        }
    });

    const value: TaskContextType = {
        tasks: filteredTasks,
        addTask,
        toggleTask,
        deleteTask,
        filter,
        setFilter,
        searchQuery,
        setSearchQuery,
        undo,
        redo,
        canUndo: currentIndex > 0,
        canRedo: currentIndex < history.length - 1,
    };

    return (
        <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
    );
}

export function useTask(): TaskContextType {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error('useTask must be used within a TaskProvider');
    }
    return context;
}
