import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProfile, setProfile } from "../../redux/userSlice";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useNavigate } from "react-router-dom";
import {
  Target,
  BarChart2,
  Brain,
  Plus,
  User,
  UserCheck,
  Pencil,
  Briefcase,
  Building2,
  CalendarClock,
  X,
} from "lucide-react";
import "react-circular-progressbar/dist/styles.css";
import {
  addUserSkills,
  addUserTargetRole,
  deleteUserSkill,
  deleteUserTargetRole,
  getDashboard,
  getUserSkills,
  getUserTargetRoles,
  updateProfile,
} from "../../api/api";
import { toastError, toastSuccess } from "../../components/Toastify";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import ActivityHeatmap from "../home/ActivityHeatmap";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Profile = () => {
  const profile = useSelector(getProfile);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
 const [loadRoles, setLoadRoles] = useState(true);
  const [isAddTargetRole, setIsAddTargetRole] = useState(false);
  const [targetRoles, setTargetRoles] = useState([]);
  const [newRole, setNewRole] = useState("");
  const [newTimeline, setNewTimeline] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddSkill, setIsAddSkill] = useState(false);
  const [newSkills, setNewSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [qaActivity, setQActivity] = useState([]);
const [selectedRoleId, setSelectedRoleId] = useState("");

  const [editForm, setEditForm] = useState({
    name: profile.name || "",
    band_level: profile.band_level || "",
    job_title: profile.job_title || "",
    department: profile.department || "",
    target_role: targetRoles.length > 0 ? targetRoles[0].role_name : "",
    target_timeline: profile.target_timeline
      ? new Date(profile.target_timeline)
      : null,
    email: profile.email,
  });
  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await updateProfile(profile.email, editForm);
      if (res.status === 200) {
        toastSuccess("Updated Successfully!");
        setIsEditOpen(false);
        dispatch(setProfile(res.data));
        //window.location.reload(); // or trigger a re-fetch
      } else {
        toastError("An error occured, try again!!");
      }
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  useEffect(() => {
  if (targetRoles.length > 0 && !editForm.target_role) {
    setEditForm((prev) => ({ ...prev, target_role: targetRoles[0].role_name }));
  }
}, [targetRoles]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getUserSkills(profile.id);
        const skills = response || [];
        setSkills(skills);
      } catch (err) {
        console.error("Failed to load career data", err);
      } finally {
        setLoading(false);
      }
    };

    if (profile?.id) fetchData();
  }, [profile]);

  const technicalSkills = skills.filter(
    (s) => !["communication", "leadership"].includes(s.skill_name.toLowerCase())
  );
  const softSkills = skills.filter((s) =>
    ["communication", "leadership"].includes(s.skill_name.toLowerCase())
  );

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await getDashboard(profile.id);

        const activityMap = {};
        const addActivity = (isoDate) => {
          const date = isoDate.split("T")[0]; // Format: YYYY-MM-DD
          activityMap[date] = (activityMap[date] || 0) + 1;
        };

        res.recentQuestions?.forEach((q) => addActivity(q.createdAt));
        res.recentAnswers?.forEach((a) => addActivity(a.createdAt));

        const activityData = Object.entries(activityMap).map(
          ([date, count]) => ({
            date,
            count,
          })
        );

        setQActivity(activityData);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      }
    };

    if (profile?.id) fetchDashboard();
  }, [profile]);

  useEffect(() => {
    const fetchUserTargetRoles = async () => {
      try {
        setLoadRoles(true)
        const roles = await getUserTargetRoles(profile.id);
        console.log("Roles", roles);
        setTargetRoles(roles);
      } catch (error) {
        console.error("Error loading target roles", error);
      }finally{
        setLoadRoles(false)
      }
    };

    if (profile?.id) {
      fetchUserTargetRoles();
    }
  }, [profile?.id]);

  const saveNewRole = async () => {
    try {
      const res = await addUserTargetRole({
        userId: profile.id,
        role_name: newRole,
        timeline: newTimeline,
      });
      console.log("Res add", res);
      if (res.status === 201) {
        toastSuccess("Target role added!");
        setTargetRoles((prev) => [...prev, res.data]);
      } else {
        toastError("Failed to add role.");
      }
    } catch (err) {
      toastError("Something went wrong.");
    } finally {
      setIsAddTargetRole(false);
      setNewRole("");
      setNewTimeline(null);
    }
  };

  const saveSkills = async () => {
  if (!selectedRoleId) {
    toastError("Please select a target role first.");
    return;
  }
  try {
    const res = await addUserSkills({
      authorId: profile.id,
      targetRoleId: selectedRoleId,   // ✅ include roleId
      skillNames: newSkills,
    });
    if (res.status === 201) {
      toastSuccess("Skills added successfully!");
      const addedSkills = res.data; 
      setSkills((prev) => [...prev, ...addedSkills]);
    } else {
      toastError("Failed to add skills.");
    }
  } catch (err) {
    toastError("Something went wrong.");
  } finally {
    setIsAddSkill(false);
    setNewSkills([]);
    setSkillInput("");
    setSelectedRoleId(""); // reset
  }
};

  const safeQaActivity = Array.isArray(qaActivity) ? qaActivity : [];
  return (
    <div className="p-6 bg-ibmlight min-h-screen">
      <div className="bg-white p-6 rounded shadow space-y-6">
        <h1 className="text-2xl font-bold text-ibmblue flex items-center gap-2">
          <UserCheck size={22} /> Career Profile
        </h1>

        <div className="flex flex-col items-center gap-20">
          {/* Career Details */}
          <div className="w-full h-full relative">
            <div className="w-full h-full space-y-2 text-gray-800 text-sm flex flex-col justify-evenly">
              <p>
                <User size={14} className="inline mr-1 text-ibmblue" />
                <strong>Name:</strong> {profile.name}
              </p>
              <p>
                <Briefcase size={14} className="inline mr-1 text-ibmblue" />
                <strong>Current Role:</strong> {profile.job_title}
              </p>
              <p>
                <BarChart2 size={14} className="inline mr-1 text-ibmblue" />
                <strong>Band Level:</strong> {profile.band_level}
              </p>
              <p>
                <Building2 size={14} className="inline mr-1 text-ibmblue" />
                <strong>Department:</strong> {profile.department}
              </p>
              <p>
                <Target size={14} className="inline mr-1 text-ibmblue" />
                <strong>Target Role:</strong> {profile.target_role}
              </p>
            </div>
            <div className="absolute right-10 top-0">
              <Pencil
                size={24}
                className="text-ibmblue cursor-pointer"
                onClick={() => setIsEditOpen(true)}
              />
            </div>
          </div>
        </div>
        <section>
          <p>
            <CalendarClock size={14} className="inline mr-1 text-ibmblue" />
            <strong>Target Timeline:</strong>{" "}
            {profile.target_timeline
              ? new Date(profile.target_timeline).toLocaleDateString()
              : "Not set"}
          </p>
        </section>

        <section className="mt-6">
          <div className="flex justify-between items-center pr-10">
            <h2 className="text-lg font-semibold text-ibmblue flex items-center gap-2">
              <Target size={18} className="text-ibmblue" /> Target Roles
            </h2>
            <Plus
              size={24}
              className="text-ibmblue cursor-pointer"
              onClick={() => setIsAddTargetRole(true)}
            />
          </div>

          {loadRoles ? (
            <div className="flex justify-center p-6"><span className="loading loading-bars loading-xl text-ibmblue"></span></div>)
             : <div className="bg-white mr-8  rounded-xl  space-y-4 mt-4">
            {targetRoles.length === 0 ? (
              <p>No roles set</p>
            ) : (
              <ul className="border p-4 rounded-xl border-ibmblue divide-y divide-gray-200">
                {targetRoles.map((role) => (
                  <li
                    key={role.id}
                    className="flex items-center justify-between py-3 px-1 rounded hover:bg-gray-50 transition"
                  >
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {role.role_name}{" "}
                      {role.timeline && (
                        <span className="text-xs text-gray-500">
                          (by {new Date(role.timeline).toLocaleDateString()})
                        </span>
                      )}
                    </span>
                    <button
                      onClick={async () => {
                        try {
                          const res = await deleteUserTargetRole(role.id);
                          console.log("Deleted Role", res);
                          if (res.status === 200) {
                            toastSuccess(res.data.message);
                            setTargetRoles((prev) =>
                              prev.filter((r) => r.id !== role.id)
                            );
                          } else {
                            toastError("Delete failed.");
                          }
                        } catch (err) {
                          toastError("Server error.");
                        }
                      }}
                      className="text-red-500 hover:text-red-600 transition"
                      title="Remove role"
                    >
                      <X size={20} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>}
        </section>

        <div>
  <div className="flex justify-between pr-10">
    <h2 className="text-lg font-semibold text-ibmblue flex items-center gap-2">
      <Brain size={18} className="text-ibmblue" /> Skills Matrix
    </h2>
    <Plus
      size={24}
      className="text-ibmblue cursor-pointer"
      onClick={() => setIsAddSkill(true)}
    />
  </div>

  {/* Show list only when there are skills */}
  {(technicalSkills.length > 0 || softSkills.length > 0) && (
    <>
      {loading ? (
        <div className="flex justify-center p-6">
          <span className="loading loading-bars loading-xl text-ibmblue"></span>
        </div>
      ) : (
        <div className="bg-white mr-8 border border-ibmblue rounded-xl p-4 space-y-4 mt-4">
          <ul className="divide-y divide-gray-200">
            {[...technicalSkills, ...softSkills].map((skill) => (
              <li
                key={skill.skill_name}
                className="flex items-center justify-between py-3 px-1 rounded hover:bg-gray-50 transition"
              >
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {skill.skill_name}
                </span>
                <button
                  onClick={async () => {
                    try {
                      const res = await deleteUserSkill(skill.id);
                      if (res.status === 200) {
                        toastSuccess(res.data.message);
                        setSkills((prev) =>
                          prev.filter(
                            (s) => s.skill_name !== skill.skill_name
                          )
                        );
                      } else {
                        toastError("Delete failed.");
                      }
                    } catch (err) {
                      toastError("Server error.");
                    }
                  }}
                  className="text-red-500 hover:text-red-600 transition"
                  title="Remove skill"
                >
                  <X size={20} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  )}
</div>



        <section className="bg-white rounded-lg  p-6  mt-6 text-xs">
          <ActivityHeatmap data={safeQaActivity} />
        </section>

        {/* 🗣️ Recent Q&A Activity */}
      </div>

      {isAddTargetRole && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-ibmblue">
                Add Target Role
              </h3>
              <button
                onClick={() => setIsAddTargetRole(false)}
                className="text-gray-500 text-2xl"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Role Name
                </label>
                <input
                  type="text"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="e.g. Senior Developer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Target Timeline
                </label>
                <DatePicker
                  selected={newTimeline}
                  onChange={(date) => setNewTimeline(date)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholderText="Select a target date"
                  dateFormat="yyyy-MM-dd"
                  minDate={new Date()}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  className="btn"
                  onClick={() => {
                    setIsAddTargetRole(false);
                    setNewRole("");
                    setNewTimeline(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn bg-ibmblue text-white"
                  onClick={saveNewRole}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isEditOpen && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-ibmblue">
                Edit Profile
              </h3>
              <button
                onClick={() => setIsEditOpen(false)}
                className="text-gray-500"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  name="name"
                  disabled
                  value={editForm.name}
                  onChange={handleEditChange}
                  className="w-full flex-1 border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Current Role
                </label>
                <input
                  type="text"
                  name="job_title"
                  value={editForm.job_title}
                  onChange={handleEditChange}
                  className="w-full flex-1 border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Department</label>
                <input
                  type="text"
                  name="department"
                  disabled
                  value={editForm.department}
                  onChange={handleEditChange}
                  className="w-full flex-1 border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
             <div>
  <label className="block text-sm font-medium">Target Role</label>
  <select
    name="target_role"
    value={editForm.target_role}
    onChange={handleEditChange}
    className="w-full flex-1 border border-gray-300 rounded-lg px-3 py-2"
  >
    <option value="">-- Select Target Role --</option>
    {targetRoles.map((role) => (
      <option key={role.id} value={role.role_name}>
        {role.role_name}
      </option>
    ))}
  </select>
</div>

              <div className="flex items-center gap-3">
                <div className="w-full">
                  <label className="block text-sm font-medium">
                    Band Level
                  </label>
                  <input
                    type="number"
                    name="band_level"
                    disabled
                    min={6}
                    max={10}
                    value={editForm.band_level}
                    onChange={handleEditChange}
                    className="w-full flex-1 border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div className="w-full">
                  <label className="block text-sm font-medium">
                    Target Timeline
                  </label>
                  <DatePicker
                    selected={editForm.target_timeline}
                    onChange={(date) =>
                      setEditForm({ ...editForm, target_timeline: date })
                    }
                    className="w-full flex-1 border border-gray-300 rounded-lg px-3 py-2"
                    placeholderText="Select a target date"
                    dateFormat="yyyy-MM-dd"
                    minDate={new Date()}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="btn"
                >
                  Cancel
                </button>
                <button type="submit" className="btn bg-ibmblue text-white">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isAddSkill && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-ibmblue">Add Skills</h3>
              <button
                onClick={() => setIsAddSkill(false)}
                className="text-gray-500 text-2xl"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <div>
  <label className="block text-sm font-medium mb-1">
    Select Target Role
  </label>
  <select
    value={selectedRoleId}
    onChange={(e) => setSelectedRoleId(e.target.value)}
    className="w-full border border-gray-300 rounded px-3 py-2"
  >
    <option value="">-- Select a Role --</option>
    {targetRoles.map((role) => (
      <option key={role.id} value={role.id}>
        {role.role_name}
      </option>
    ))}
  </select>
</div>


                <label className="block text-sm font-medium mb-1">
                  Enter Skill
                </label>
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && skillInput.trim()) {
                      e.preventDefault();
                      const entered = skillInput.trim().toLowerCase();

                      const existingSkills = [
                        ...(skills || []),
                        ...newSkills,
                      ].map((s) =>
                        typeof s === "string"
                          ? s.toLowerCase()
                          : s.skill_name.toLowerCase()
                      );

                      if (existingSkills.includes(entered)) {
                        toastError("Skill already exists.");
                      } else {
                        setNewSkills([...newSkills, skillInput.trim()]);
                      }

                      setSkillInput("");
                    }
                  }}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Type skill and press Enter"
                />
              </div>

              {/* Preview tags */}
              {newSkills.length > 0 && (
                <div className="flex flex-wrap gap-2 text-sm">
                  {newSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-ibmblue text-white px-2 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  className="btn"
                  onClick={() => {
                    setIsAddSkill(false);
                    setNewSkills([]);
                    setSkillInput("");
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn bg-ibmblue text-white"
                  onClick={saveSkills}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
