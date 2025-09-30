import React, { useEffect, useState } from "react";
import { getUsers } from "../../api/api";
import { useNavigate } from "react-router-dom";
import { Plus, MoreVertical } from "lucide-react";
import { NEW_USER } from "../../util/Routes";

const ManagerPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openMenu, setOpenMenu] = useState(null); // track which row menu is open

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await getUsers();
        if (Array.isArray(res)) {
          setUsers(res);
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle add button click
  const handleAddClick = () => {
    navigate(NEW_USER);
  };

  const handleView = (id) => {
    navigate(`/users/admin/${id}`);
    setOpenMenu(null);
  };

  const handleDelete = (id) => {
    // TODO: call delete API
    console.log("Delete user", id);
    setOpenMenu(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-ibmblue mb-8 text-left">
          Team Overview
        </h1>
        <button
          onClick={handleAddClick}
          className="btn flex items-center gap-2 bg-ibmblue text-white hover:bg-ibmblue/90"
        >
          <Plus size={18} />
          Add
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-6">
          <span className="loading loading-bars loading-xl text-ibmblue"></span>
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

                    {/* Dropdown */}
                    {openMenu === user.id && (
                      <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-md  z-10">
                        <button
                          onClick={() => handleView(user.id)}
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          Delete
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
