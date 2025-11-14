import React, { useEffect, useState } from "react";
import { getUsersForadmin, RemoveUserToAdmin } from "../../api/api";
import { useNavigate } from "react-router-dom";
import {
  MoreVertical,
  Eye,
  UserMinus,
   Users,
  Loader2,
} from "lucide-react";
import { MANAGER, MYUSERS } from "../../util/Routes";
import { useSelector } from "react-redux";
import { getProfile } from "../../redux/userSlice";
import { toastError, toastSuccess } from "../../components/Toastify";

const MyTeamUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openMenu, setOpenMenu] = useState(null);
  const navigate = useNavigate();
  const profile = useSelector(getProfile);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getUsersForadmin(profile.id);
      setUsers(Array.isArray(res) ? res : []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddClick = () => navigate(MANAGER);

  const handleView = (id) => {
    navigate(`/users/admin/${id}`);
    setOpenMenu(null);
  };

  const handleDeleteUser = async (id) => {
    try {
      const payload = { adminId: profile.id, userId: id };
      const res = await RemoveUserToAdmin(payload);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      toastSuccess(res?.message || "User removed successfully");
    } catch (error) {
      console.error("Failed to remove user:", error);
      toastError("Failed to remove user");
    } finally {
      setOpenMenu(null);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-ibmblue">Team Overview</h1>

        <button
        
           onClick={() => navigate(MYUSERS)}
          className="flex items-center gap-2 bg-ibmblue text-white px-4 py-2 rounded-lg shadow hover:bg-blue-800 transition"
        >
          <Users size={18} />
          Other users
          
        </button>
      </div>

      {/* Loader */}
      {loading ? (
        <div className="flex justify-center p-8">
          <span className="loading loading-bars loading-xl text-ibmblue"></span>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center text-gray-500 py-12 bg-white rounded-lg shadow">
          <p className="text-lg font-medium">
            No users added yet.
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Click “Back” to add users to your team.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow ">
          <table className="table table-zebra w-full h-full ">
            <thead className="bg-ibmblue text-white">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Job Title</th>
                <th>Band Level</th>
                <th>Department</th>
                <th>Target Role</th>
                <th>Points</th>
                 <th>Badges</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td>{idx + 1}</td>
                  <td className="font-medium">{user.name}</td>
                  <td>{user.job_title}</td>
                  <td>{user.band_level}</td>
                  <td>{user.department}</td>
                  <td>{user.target_role || "—"}</td>
                  <td>{user.points}</td>
                   <td>{user.badges?.length || 0}</td>
                  <td className="relative">
                    <button
                      className="p-1.5 rounded hover:bg-gray-200 transition"
                      onClick={() =>
                        setOpenMenu(openMenu === user.id ? null : user.id)
                      }
                    >
                      <MoreVertical size={18} className="text-ibmblue" />
                    </button>

                    {openMenu === user.id && (
                      <div className="absolute right-0 mt-2 w-40 bg-white shadow-xl border rounded-lg z-20">
                        <button
                          onClick={() => handleView(user.id)}
                          className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          <Eye size={16} className="text-ibmblue" />
                          View Profile
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          <UserMinus size={16} />
                          Remove User
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyTeamUsers;
