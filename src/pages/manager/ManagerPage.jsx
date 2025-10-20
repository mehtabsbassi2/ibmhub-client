import React, { useEffect, useState } from "react";
import { addUserToAdmin, getAvailableUsersForAdmin } from "../../api/api";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  MoreVertical,
  UserPlus,
  Eye,
  Users,
  Loader2,
} from "lucide-react";
import { MYUSERS } from "../../util/Routes";
import { getProfile } from "../../redux/userSlice";
import { toastSuccess, toastError } from "../../components/Toastify";

const ManagerPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openMenu, setOpenMenu] = useState(null);

  const navigate = useNavigate();
  const profile = useSelector(getProfile);

  // Fetch available users (not in my team)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await getAvailableUsersForAdmin(profile.id);
        if (Array.isArray(res)) {
          setUsers(res);
        } else {
          setUsers([]);
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [profile.id]);

  const handleView = (id) => {
    navigate(`/users/admin/${id}`);
    setOpenMenu(null);
  };

  const handleToMyUsers = async (id) => {
    try {
      const payload = { adminId: profile.id, userId: id };
      const res = await addUserToAdmin(payload);

      if (res?.message === "User added successfully") {
        toastSuccess("User added successfully");
        setUsers((prev) => prev.filter((u) => u.id !== id));
      } else {
        toastError(res?.message || "Failed to add user");
      }
    } catch (error) {
      console.error("Add user error:", error);
      toastError("Failed to add user");
    } finally {
      setOpenMenu(null);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-ibmblue">Available Users</h1>

        <button
          onClick={() => navigate(MYUSERS)}
          className="flex items-center gap-2 bg-ibmblue text-white px-4 py-2 rounded-lg shadow hover:bg-blue-800 transition"
        >
          <Users size={18} />
          My Team
        </button>
      </div>

      {/* Loader */}
      {loading ? (
        <div className="flex justify-center p-8">
          <span className="loading loading-bars loading-xl text-ibmblue"></span>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center text-gray-500 py-12 bg-white rounded-lg shadow">
          <p className="text-lg font-medium">No users available to add right now.</p>
          <p className="text-sm text-gray-400 mt-2">
            All users might already be assigned to admins.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-auto">
          <table className="table table-zebra w-full">
            <thead className="bg-ibmblue text-white">
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
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors relative"
                >
                  <td>{idx + 1}</td>
                  <td className="font-medium">{user.name}</td>
                  <td>{user.job_title}</td>
                  <td>{user.band_level}</td>
                  <td>{user.department}</td>
                  <td>{user.target_role || "—"}</td>
                  <td>{user.points}</td>
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
                          onClick={() => handleToMyUsers(user.id)}
                          className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          <UserPlus size={16} className="text-green-600" />
                          Add to My Team
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

export default ManagerPage;
