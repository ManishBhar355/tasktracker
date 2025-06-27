import React, { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [showInput, setShowInput] = useState(false);
  const [title, setTitle] = useState('');
  const [tasks, setTasks] = useState([]);

  const handleToggle = () => setShowInput(!showInput);

  const handleSave = () => {
    if (title.trim() !== '') {
      const newTask = {
        id: Date.now(),
        title: title.trim(),
        status: 'Pending',
      };
      setTasks([...tasks, newTask]);
      setTitle('');
      setShowInput(false);
    }
  };

  const updateTaskStatus = (id, newStatus) => {
    setTasks(tasks.map((task) =>
      task.id === id ? { ...task, status: newStatus } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const pendingTasks = tasks.filter(task => task.status === 'Pending');
  const inProgressTasks = tasks.filter(task => task.status === 'In Progress');
  const completedTasks = tasks.filter(task => task.status === 'Completed');

  return (
    <div className="container py-4">
      <div class="task-main">
      <h1 className="text-start text-white mb-4">Task Tracker</h1>
      <div className="text-end add-task-feature mb-3">
        <button class="filter-btn">Filter</button>
        <a class="" href="#">Share</a>
        <button className="btn btn-primary me-2" onClick={handleToggle}>
          + Add New Task
        </button>
      </div>
      </div>

      {showInput && (
        <div className="mb-3 title-div d-flex justify-content-end align-items-center gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Enter task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button className="btn btn-success" onClick={handleSave}>
            Save
          </button>
        </div>
      )}

      <div className="row">
        <div className="col-md-4">
          <h4 class="text-white">Pending</h4>
          {pendingTasks.map((task) => (
            <div className="card mb-2 p-2" key={task.id}>
              <p>{task.title}</p>
              <button
                className="btn btn-sm btn-warning"
                onClick={() => updateTaskStatus(task.id, 'In Progress')}
              >
                Start
              </button>
            </div>
          ))}
        </div>

        <div className="col-md-4">
          <h4 class="text-white">In Progress</h4>
          {inProgressTasks.map((task) => (
            <div className="card mb-2 p-2" key={task.id}>
              <p>{task.title}</p>
              <button
                className="btn btn-sm btn-success"
                onClick={() => updateTaskStatus(task.id, 'Completed')}
              >
                Complete
              </button>
            </div>
          ))}
        </div>

        <div className="col-md-4">
          <h4 class="text-white" >Completed</h4>
          {completedTasks.map((task) => (
            <div className="card mb-2 p-2 bg-light" key={task.id}>
              <div className="d-flex justify-content-between align-items-center">
                <p className="mb-0">{task.title}</p>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => deleteTask(task.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
