import React, { useEffect, useState } from "react";
import API from "../api";
import {  User ,UsersI} from "../types";  

const Users: React.FC = () => {
  const [users, setUsers] = useState<UsersI[]>([]);  
  const user: User = JSON.parse(localStorage.getItem("user") || "{}"); 
  const [deleteConfirm, setdeleteConfirm] = useState(false);
  const [id, setid] = useState(0);
  const [newStatus, setNewStatus] = useState("");const options = [
  { value: 'pending', label: 'pending' },
  { value: 'done', label: 'done' },
  { value: 'redo', label: 'redo' },
  { value: 'completed', label: 'completed' }
]
  

   const fetchUsers = async () => {
    if (!user || !user.username) {
      setUsers([]);
      return;
    }
    const res = await API.get("users/");
    setUsers(res.data);
  };
 
 const confirmdelete = (id:any) => {
    setid(id); 
    deleteuser(id)
  };
  const canceldelete = ( ) => {
    setid(0); 
    setdeleteConfirm(false);
  };

  const deleteuser = async (id:number) => {
   fetch(`http://127.0.0.1:8000/api/users/${id}/`, {
  method: "DELETE", 
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
})
  .then((res) => {
    if (res.ok) {
      alert("User deleted successfully");
      fetchUsers();
    } else {
      alert("Failed to delete user");
    }
  }); 
  };

   const Updateuser = (user: UsersI) => {
    user.is_staff=true
    API.put(
  `/users/${user.id}/`,
  user
)
.then(res =>{ console.log("Updated user:", res.data);
  fetchUsers();
})
.catch(err => console.error(err.response.data));
     };
 

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="container">
      <div className="tasks-header">
        <h1 className="heading">
          Tasks Dashboard - {user?.username} ({user?.role})
        </h1>
        </div>
   {users.length === 0 ? (
    <p className="no-tasks">No users registered.</p>
  ) : (<table className="user-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user, index) => (
          <tr key={index}>
            <td>{user.username}</td>
            <td>{user.email}</td>
            <td>
              {user.is_superuser
                ? "Admin"
                : user.is_staff
                ? "Staff"
                : "User"}
            </td>
            <td>
              <button className="btn-edit" onClick={()=>Updateuser(user)}>
                    Update 
              </button>
              <button className="btn-delete mr2" onClick={()=>confirmdelete(user.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
  }
 </div> 
  );
};

export default Users;
