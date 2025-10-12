import React, { useEffect, useState } from "react";
import API from "../api";
import { Task, User } from ".././types";
import "./tasks.css"; 

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const user: User = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchTasks = async () => {
    const res = await API.get("tasks/");
    setTasks(res.data);
  };

  const createTask = async () => {
    await API.post("tasks/", { title, description: desc });
    fetchTasks();
    setTitle("");
    setDesc("");
  };

  const deleteTask = async (id: number) => {
    await API.delete(`tasks/${id}/`);
    fetchTasks();
  };

  const toggleComplete = async (task: Task) => {
    await API.patch(`tasks/${task.id}/`, {
      status: task.status === "completed" ? "pending" : "completed",
    });
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="container">
      <h1 className="heading">
        Tasks Dashboard - {user?.username} ({user?.role})
      </h1>

      {(user?.role === "staff" || user?.role === "admin") && (
        <div className="task-card">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
          />
          <input
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Task description"
          />
          <button onClick={createTask} className="btn-add">
            Add Task
          </button>
        </div>
      )}

      <div className="task-grid">
        {tasks.map((task) => (
          <div key={task.id} className="task-card">
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <span className={`status ${task.status}`}>{task.status}</span>
            <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
              <button
                className={`btn-toggle ${
                  task.status === "completed" ? "done" : "pending"
                }`}
                onClick={() => toggleComplete(task)}
              >
                {task.status === "completed" ? "Mark Undone" : "Mark Done"}
              </button>

              {(user?.role === "staff" || user?.role === "admin") && (
                <button className="btn-delete" onClick={() => deleteTask(task.id)}>
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;