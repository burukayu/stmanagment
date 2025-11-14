import React, { useEffect, useState } from "react";
import API from "../api";
import {  User ,UsersI} from "../types";  
import {ToastProvider} from "../ToastProvider"
import { AwardIcon } from "lucide-react";

const Users: React.FC = () => {
  const [users, setUsers] = useState<UsersI[]>([]);  
  const [IAUsers, setIAUsers]= useState<UsersI[]>([]);
  const user: User = JSON.parse(localStorage.getItem("user") || "{}"); 
  const [deleteConfirm, setdeleteConfirm] = useState(false);
  const [id, setid] = useState(0);
  const [isActives, setisActives] =useState(true)
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
    const res = await API.get("users/Active");
    setUsers(res.data);
    setisActives(true)
  };

  const getInactiveUsers =async ()=>{
if(!user || !user.username){
  setIAUsers([]);
  return;
}
const res= await API.get("users/Inactive/").then((res)=>{
setIAUsers(res.data)
setisActives(false)})
.catch((err)=>{

})
  };
 
 const confirmdelete = ( ) => { 
    deleteuser(id)
  };
  const canceldelete = ( ) => {
    setid(0); 
    setdeleteConfirm(false);
  };

  const deleteuser = async (id:number) => {
   fetch(`http://127.0.0.1:8000/api/users/delup/${id}/`, {
  method: "DELETE", 
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
})
  .then((res) => {
    setid(0);
    setdeleteConfirm(false);
    if (res.ok) {
      alert("User deleted successfully");
      fetchUsers();
    } else {
      alert("Failed to delete user");
    }
  }); 
  };
const showdelet = async (user:UsersI)=>{
  setdeleteConfirm(true);
  setid(user.id)
};
   const Updateuser = (user: UsersI) => { 
    API.put(
  `/users/delup/${user.id}/`,
  user
)
.then(res =>{ console.log("Updated user:", res.data);
  fetchUsers();
})
.catch(err => console.error(err.response.data));
     };
 
const Activateuser =async (user:any)=>{
  API.put(`user/activate/${user.id}/`).then((res)=>{

  }).catch((error)=>{
    
  })
}
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
        <button className="btn-tab" onClick={()=>fetchUsers()}>Active Users</button>
        <button className="btn-tab" onClick={()=>getInactiveUsers()}>In Active users</button>
        {isActives?(<>
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
              <button className="btn-delete mr2" onClick={()=>showdelet(user) }>Delete</button>
            
                          </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
  }</> ):(<>
   {IAUsers.length === 0 ? (
    <p className="no-tasks">No deactive user.</p>
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
        {IAUsers.map((user, index) => (
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
            <td><button className="btn-edit" onClick={()=>Activateuser(user)}>
                    Activate 
              </button></td>
          </tr>
        ))}
      </tbody>
    </table>
  )
  }</> )}{deleteConfirm && (
        <div className="popup-overlay">
          <div className="popup">
            <h4>Confirm Deletion</h4>
            <p>
              Change status of user <strong>{ }</strong>{" "}
              <strong>{newStatus}</strong>?
            </p>
            <div className="popup-actions">
              <button className="btn btn-m1-yse" onClick={()=>confirmdelete()}>Yes</button>
              <button className="btn btn-m-no" onClick={canceldelete}>No</button>
            </div>
          </div>
        </div>
      )}
 </div> 
  );
};

export default Users;
