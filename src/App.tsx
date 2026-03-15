import Task from "./components/Task.tsx";
import {TasksProvider} from "./contexts/TasksContext.tsx";
import {BrowserRouter} from "react-router-dom";

function App() {

    return (
        <BrowserRouter>
            <TasksProvider>
                <Task/>
            </TasksProvider>
        </BrowserRouter>
    )
}

export default App
