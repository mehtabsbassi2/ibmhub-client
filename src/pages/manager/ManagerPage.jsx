import React, { useEffect, useState } from "react";
import { getUsers } from "../../api/api";
import { useNavigate } from "react-router-dom";
import { ExternalLink } from "lucide-react";

const ManagerPage = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate()
  useEffect(() => {
    const fetchUsers = async () => {
      const res = await getUsers();
      if (Array.isArray(res)) {
        setUsers(res);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-ibmblue mb-8 text-left">
        Team Overview
      </h1>

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
              <tr
      key={user.id}
      onClick={() => navigate(`/users/admin/${user.id}`)}
      className="cursor-pointer hover:bg-gray-100"
    >
                <td>{idx + 1}</td>
                <td>{user.name}</td>
                <td>{user.job_title}</td>
                <td>{user.band_level}</td>
                <td>{user.department}</td>
                <td>{user.target_role || "—"}</td>
                <td>{user.points}</td>
                <td>
                  <ExternalLink size={18} className="text-ibmblue" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagerPage;
