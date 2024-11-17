export interface Task {
    id: number;
    text: string;
    completed: boolean;
}

export interface TaskContextType {
    tasks: Task[];
    addTask: (text: string) => void;
    toggleTask: (id: number) => void;
    deleteTask: (id: number) => void;
    filter: string;
    setFilter: (filter: string) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
}
