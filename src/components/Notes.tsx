import React, { useState } from 'react';
import { useTask } from '../TaskContext';

const Notes: React.FC = () => {
    const {
        tasks,
        addTask,
        toggleTask,
        deleteTask,
        filter,
        setFilter,
        searchQuery,
        setSearchQuery,
        undo,
        redo,
        canUndo,
        canRedo,
    } = useTask();

    const [newTask, setNewTask] = useState<string>('');

    const handleAddTask = () => {
        addTask(newTask);
        setNewTask('');
    };

    return (
        <div className="container">
            <h1>Today</h1>

            <div className="action-buttons">
                <button
                    onClick={undo}
                    disabled={!canUndo}
                    className="action-btn"
                >
                    Undo
                </button>
                <button
                    onClick={redo}
                    disabled={!canRedo}
                    className="action-btn"
                >
                    Redo
                </button>
            </div>

            <div className="search-bar">
                <input
                    type="search"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                />
                <div className="filter-buttons">
                    <button
                        className={`filter-btn ${
                            filter === 'all' ? 'active' : ''
                        }`}
                        onClick={() => setFilter('all')}
                    >
                        All
                    </button>
                    <button
                        className={`filter-btn ${
                            filter === 'completed' ? 'active' : ''
                        }`}
                        onClick={() => setFilter('completed')}
                    >
                        Completed
                    </button>
                    <button
                        className={`filter-btn ${
                            filter === 'incomplete' ? 'active' : ''
                        }`}
                        onClick={() => setFilter('incomplete')}
                    >
                        Incomplete
                    </button>
                </div>
            </div>

            <div className="tasks-list">
                {tasks.map((task) => (
                    <div
                        key={task.id}
                        className={`task-item ${
                            task.completed ? 'task-complete' : ''
                        }`}
                    >
                        <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => toggleTask(task.id)}
                        />
                        <span className={task.completed ? 'completed' : ''}>
                            {task.text}
                        </span>
                        <button onClick={() => deleteTask(task.id)}>×</button>
                    </div>
                ))}
            </div>

            <div className="add-task">
                <input
                    type="text"
                    placeholder="Type something"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                />
                <button
                    onClick={handleAddTask}
                    className="add-btn"
                    style={{
                        backgroundColor: newTask ? undefined : 'lightgray',
                    }}
                >
                    Add Task
                </button>
            </div>
        </div>
    );
};

export default Notes;
