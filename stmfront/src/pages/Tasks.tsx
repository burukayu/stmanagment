import React, { useEffect, useState } from "react";
import API from "../api";
import { Task, User } from "../types";
import "./tasks.css";

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [status, setStatus] = useState("pending");
  const user: User = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchTasks = async () => {
    if (!user || !user.username) {
      setTasks([]);
      return;
    }
    const res = await API.get("tasks/");
    setTasks(res.data);
  };

  const createTask = async () => {
    if (!title.trim()) return alert("Task title cannot be empty!");
    await API.post("tasks/", { title, description: desc });
    fetchTasks();
    setTitle("");
    setDesc("");
    showAdd && setShowAdd(false);
  };

  const deleteTask = async (id: number) => {
    await API.delete(`tasks/${id}/`);
    fetchTasks();
  };

 const toggleComplete = async (task: Task) => {
  try {
    await API.put(`tasks/${task.id}/`, {
      status: task.status === "completed" ? "pending" : "completed",
    });
    fetchTasks();
  } catch (error) {
    console.error("Failed to toggle task:", error);
  }
};
 const updateTask = async () => {
    if (!editingTask) return;
    await API.put(`tasks/${editingTask.id}/`, { title, description: desc, status });
    setEditingTask(null);
    setTitle("");
    setDesc("");
    setStatus("pending");
     setShowAdd(false);
    fetchTasks();
  };
  const startEdit = (task: Task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDesc(task.description);
    setStatus(task.status);
    setShowAdd(true);
  };
const showtaskoradd = () => {
    setShowAdd(!showAdd);
    setEditingTask(null);
    setTitle("");
    setDesc("");
}

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="container">
      <div className="tasks-header">
        <h1 className="heading">
          Tasks Dashboard - {user?.username} ({user?.role})
        </h1>
{
        (user)?(// ?.role === "staff" || user?.role === "admin") ? (
        <button
          className="btn-toggle-view"
          onClick={showtaskoradd }
        >
          {showAdd ? "Show Task List" : "Add New Task"}
        </button>
        ): null}
      </div>
      {showAdd ? (
        // (user?.role === "staff" || user?.role === "admin") ? (
          <div className="task-form">
            <h2 className="form-title">Create New Task</h2>
            <input
              className="input-field"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
            />
            <textarea
              className="input-field textarea"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Task description"
            />
            <select value={status}className="input-field" 
             onChange={(e) => setStatus(e.target.value)}>
            <option value="pending">Pending</option>
            <option value="done">Done</option>
            <option value="redo">Redo</option>
            <option value="completed">Completed</option>
          </select>

          {editingTask ? (
            <button onClick={updateTask} className="btn-add">Update Task</button>
          ) : (
            <button onClick={createTask} className="btn-add">Add Task</button>
          )}
          </div>
        // ) : (
        //   <p className="no-access">You don’t have permission to add tasks.</p>
        // )
      ) : (
        <div className="task-grid">
          {tasks.length === 0 ? (
            <p className="no-tasks">No tasks available.</p>
          ) : (
            tasks.map((task) => (
              <div key={task.id} className="task-card">
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <p className="meta">
                <strong>Owner:</strong> {task.owner_username} <br />
                <strong>Last updated by:</strong>{" "}
                {task.last_updated_by_username || "—"} <br />
                <strong>Updated:</strong> {new Date(task.updated_at).toLocaleString()}
                </p>
                <span className={`status ${task.status}`}>{task.status}</span><div className="task-actions">
                  {/* <button
                    className={`btn-toggle ${
                      task.status === "completed" ? "done" : "pending"
                    }`}
                    onClick={() => toggleComplete(task)}
                  >
                    {task.status === "completed"
                      ? "Mark Undone"
                      : "Mark Done"}
                  </button> */}
            <button onClick={() => startEdit(task)} className="btn-edit">
                Edit
              </button>
                  {(user?.role === "staff" || user?.role === "admin") && (
                    <button
                      className="btn-delete"
                      onClick={() => deleteTask(task.id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Tasks;
