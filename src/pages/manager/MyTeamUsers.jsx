import React, { useEffect, useState } from "react";
import { getUsersForadmin, RemoveUserToAdmin } from "../../api/api";
import { useNavigate } from "react-router-dom";
import { Plus, MoreVertical } from "lucide-react";
import { MANAGER } from "../../util/Routes";
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
      if (Array.isArray(res)) setUsers(res);
      else setUsers([]);
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
      console.log("Res:", res);

      // ✅ remove user from local state immediately
      setUsers((prev) => prev.filter((u) => u.id !== id));

      // ✅ show toast with fallback message
      toastSuccess(res?.message || "User removed successfully");
    } catch (error) {
      console.error("Failed to remove user:", error);
      toastError("Failed to remove user");
    } finally {
      setOpenMenu(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-ibmblue mb-8 text-left">
          Team Overview
        </h1>
        <div className="flex gap-4 justify-end items-center">
          <h1 className="underline text-ibmblue">My Users</h1>
          <button
            onClick={handleAddClick}
            className="btn flex items-center gap-2 bg-ibmblue text-white hover:bg-ibmblue/90"
          >
            Back
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-6">
          <span className="loading loading-bars loading-xl text-ibmblue"></span>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          No users added yet. Click “Back” to add users.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Job Title</th>
                <th>Band Level</th>
                <th>Department</th>
                <th>Target Role</th>
                <th>Points</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td>{idx + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.job_title}</td>
                  <td>{user.band_level}</td>
                  <td>{user.department}</td>
                  <td>{user.target_role || "—"}</td>
                  <td>{user.points}</td>
                  <td className="relative">
                    <button
                      className="p-1 rounded hover:bg-gray-200"
                      onClick={() =>
                        setOpenMenu(openMenu === user.id ? null : user.id)
                      }
                    >
                      <MoreVertical size={18} className="text-ibmblue" />
                    </button>

                    {openMenu === user.id && (
                      <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-md z-10">
                        <button
                          onClick={() => handleView(user.id)}
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          Remove
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
