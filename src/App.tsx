import './App.css';
import Notes from './components/Notes';
import { TaskProvider } from './TaskContext';

function App() {
    return (
        <div className="app">
            <TaskProvider>
                <Notes />
            </TaskProvider>
        </div>
    );
}

export default App;
