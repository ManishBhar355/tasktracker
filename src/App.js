import React, { useState, useMemo, useEffect, useRef } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [showInput, setShowInput] = useState(false);
  const [title, setTitle] = useState('');
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('All');
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false); 
  const inputRef = useRef(null);

  const handleToggle = () => {
    setShowInput(true);
    setTimeout(() => inputRef.current?.focus(), 100); 
  };

  const handleSave = () => {
    if (title.trim() !== '') {
      const newTask = {
        id: Date.now(),
        title: title.trim(),
        status: 'Pending',
        isCompleted: false,
        time: 0,
        isRunning: false,
      };
      setTasks(prev => [...prev, newTask]);
      setTitle('');
      setShowInput(false);
    }
  };

  // Load tasks from localStorage on mount
  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      try {
        setTasks(JSON.parse(storedTasks));
      } catch (e) {
        console.error("Error parsing tasks:", e);
      }
    }
    setIsInitialized(true);
  }, []);




  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks, isInitialized]);


  useEffect(() => {
    if (!isInitialized) return;

    const interval = setInterval(() => {
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.isRunning ? { ...task, time: task.time + 1 } : task
        )
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [isInitialized]);

  const toggleTimer = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, isRunning: !task.isRunning } : task
    ));
  };

  const toggleCompletion = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
    ));
  };

  const updateTaskStatus = (id, newStatus) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, status: newStatus } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const formatTime = (seconds) => {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  const handleFilterClick = (type) => {
    setFilter(type);
    setShowFilterOptions(false);
  };

  const filteredTasks = useMemo(() => {
    if (filter === 'All') return tasks;
    if (filter === 'Pending') return tasks.filter(task => task.status === 'Pending');
    if (filter === 'In Progress') return tasks.filter(task => task.status === 'In Progress');
    if (filter === 'Completed') return tasks.filter(task => task.status === 'Completed');
    return tasks;
  }, [tasks, filter]);

  const pendingTasks = filteredTasks.filter(task => task.status === 'Pending');
  const inProgressTasks = filteredTasks.filter(task => task.status === 'In Progress');
  const completedTasks = filteredTasks.filter(task => task.status === 'Completed');

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.status === 'Completed').length;
    const pending = tasks.filter(task => task.status === 'Pending').length;
    const inProgress = tasks.filter(task => task.status === 'In Progress').length;
    return { total, completed, pending, inProgress };
  }, [tasks]);

  return (
    <div className="container py-4">
      <div className="task-main">
        <h1 className="text-start text-white mb-4">Task Tracker</h1>

        <div className="text-end add-task-feature mb-3">
          <button className="filter-btn" onClick={() => setShowFilterOptions(!showFilterOptions)}>Filter</button>
          {showFilterOptions && (
            <div className="d-inline-flex gap-2 me-2">
              <button className={`btn btn-sm ${filter === 'All' ? 'btn-success' : 'btn-outline-light'}`} onClick={() => handleFilterClick('All')}>All</button>
              <button className={`btn btn-sm ${filter === 'Pending' ? 'btn-success' : 'btn-outline-light'}`} onClick={() => handleFilterClick('Pending')}>Pending</button>
              <button className={`btn btn-sm ${filter === 'In Progress' ? 'btn-success' : 'btn-outline-light'}`} onClick={() => handleFilterClick('In Progress')}>In Progress</button>
              <button className={`btn btn-sm ${filter === 'Completed' ? 'btn-success' : 'btn-outline-light'}`} onClick={() => handleFilterClick('Completed')}>Completed</button>
            </div>
          )}
          <a href="#" className="me-2">Share</a>
          <button className="btn btn-primary" onClick={handleToggle}>+ Add New Task</button>
        </div>
      </div>

      <div className="stats-input">
        <div className="text-white mb-3 task-stats">
          <strong>Stats:</strong>{' '}
          <h3>Total: {stats.total}, Pending: {stats.pending}, In Progress: {stats.inProgress}, Completed: {stats.completed}</h3>
        </div>

        {showInput && (
          <div className="mb-3 title-div d-flex justify-content-end align-items-center gap-2 task-add-title">
            <input
              ref={inputRef}
              type="text"
              className="form-control"
              placeholder="Enter task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <button className="btn btn-success" onClick={handleSave}>Save</button>
          </div>
        )}
      </div>

      <div className="row pt-100 ">
        {/* Pending Tasks */}
        <div className="col-md-4">
          <h4 className="text-white text-center">Pending</h4>
          {pendingTasks.map(task => (
            <div className="card mb-2 p-2" key={task.id}>
              <p className={task.isCompleted ? 'text-decoration-line-through' : ''}>{task.title}</p>
              <small className="d-block">Time: {formatTime(task.time)}</small>
              <div className="d-flex gap-2 mt-2 flex-wrap">
                <button className="btn btn-sm btn-info" onClick={() => toggleTimer(task.id)}>
                  {task.isRunning ? 'Pause' : 'Start'}
                </button>
                <button className="btn btn-sm btn-warning" onClick={() => updateTaskStatus(task.id, 'In Progress')}>
                  Start Work
                </button>
              </div>
              <div className="mt-2">
                <button className="btn btn-sm btn-outline-success" onClick={() => toggleCompletion(task.id)}>
                  {task.isCompleted ? 'Undo' : 'Mark as Done'}
                </button>
                <button className="btn btn-sm btn-danger ml-10" onClick={() => deleteTask(task.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* In Progress Tasks */}
        <div className="col-md-4">
          <h4 className="text-white text-center">In Progress</h4>
          {inProgressTasks.map(task => (
            <div className="card mb-2 p-2" key={task.id}>
              <p className={task.isCompleted ? 'text-decoration-line-through' : ''}>{task.title}</p>
              <small className="d-block">Time: {formatTime(task.time)}</small>
              <div className="d-flex gap-2 mt-2 flex-wrap">
                <button className="btn btn-sm btn-info" onClick={() => toggleTimer(task.id)}>
                  {task.isRunning ? 'Pause' : 'Start'}
                </button>
                <button className="btn btn-sm btn-success" onClick={() => updateTaskStatus(task.id, 'Completed')}>
                  Complete
                </button>
                <button className="btn btn-sm btn-secondary" onClick={() => updateTaskStatus(task.id, 'Pending')}>
                  Back to Pending
                </button>
              </div>
              <div>
                <button className="btn btn-sm btn-outline-success" onClick={() => toggleCompletion(task.id)}>
                  {task.isCompleted ? 'Undo' : 'Mark as Done'}
                </button>
                <button className="btn btn-sm btn-danger ml-10" onClick={() => deleteTask(task.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Completed Tasks */}
        <div className="col-md-4">
          <h4 className="text-white text-center">Completed</h4>
          {completedTasks.map(task => (
            <div className="card mb-2 p-2 bg-light" key={task.id}>
              <p className={`mb-2 ${task.isCompleted ? 'text-decoration-line-through' : ''}`}>
                {task.title}
              </p>
              <small className="d-block">Time: {formatTime(task.time)}</small>
              <div className="d-flex gap-2 mt-2 flex-wrap">
                <button className="btn btn-sm btn-info" onClick={() => toggleTimer(task.id)}>
                  {task.isRunning ? 'Pause' : 'Start'}
                </button>
                <button className="btn btn-sm btn-outline-success" onClick={() => toggleCompletion(task.id)}>
                  {task.isCompleted ? 'Undo' : 'Mark as Done'}
                </button>
              </div>
              <div className="mt-2">
                <button className="btn btn-sm btn-secondary" onClick={() => updateTaskStatus(task.id, 'In Progress')}>
                  Back
                </button>
                <button className="btn btn-sm btn-danger ml-10" onClick={() => deleteTask(task.id)}>
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
