

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
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import "react-circular-progressbar/dist/styles.css";
import {
  addUserSkills,
  addUserTargetRole,
  deleteUserSkill,
  deleteUserTargetRole,
  getDashboard,
  getUserBadges,
  getUserSkills,
  getUserTargetRoles,
  getUserTargetRolesWithUserSkills,
  toogleAddmin,
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
  const [isAddTargetRole, setIsAddTargetRole] = useState(false);
  const [newRole, setNewRole] = useState("");
  const [newTimeline, setNewTimeline] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddSkill, setIsAddSkill] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [qaActivity, setQActivity] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [rolesWithSkills, setRolesWithSkills] = useState([]);
  const [loadingRolesWithSkills, setLoadingRolesWithSkills] = useState(true);
  const [expandedRoleId, setExpandedRoleId] = useState(null);
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);
  const [badges, setBadges] = useState([]);

  const [editForm, setEditForm] = useState({
    name: profile.name || "",
    band_level: profile.band_level || "",
    job_title: profile.job_title || "",
    department: profile.department || "",
    target_role: "",
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
      } else {
        toastError("An error occured, try again!!");
      }
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  useEffect(() => {
    const fetchBadges = async () => {
      const res = await getUserBadges(profile.id);
      setBadges(res);
    };
    fetchBadges();
  }, [profile.id]);

  useEffect(() => {
    if (rolesWithSkills.length > 0 && !editForm.target_role) {
      setEditForm((prev) => ({
        ...prev,
        target_role: rolesWithSkills[0].role_name,
      }));
    }
  }, [rolesWithSkills]);

  const refetchRolesWithSkills = async () => {
    try {
      setLoadingRolesWithSkills(true);
      const data = await getUserTargetRolesWithUserSkills(profile.id);
      setRolesWithSkills(data);
    } catch (err) {
      console.error("Error refreshing roles with skills:", err);
    } finally {
      setLoadingRolesWithSkills(false);
    }
  };

  const daysUntil = (date) => {
    if (!date) return null;
    const today = new Date();
    const diffTime = date - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

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
          const date = isoDate.split("T")[0];
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
    const fetchRolesWithSkills = async () => {
      try {
        setLoadingRolesWithSkills(true);
        const data = await getUserTargetRolesWithUserSkills(profile.id);
        console.log("Roles with skills:", data);
        setRolesWithSkills(data);
      } catch (err) {
        console.error("Error loading roles with skills:", err);
      } finally {
        setLoadingRolesWithSkills(false);
      }
    };

    if (profile?.id) fetchRolesWithSkills();
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
        // Refetch the roles with skills to update the UI immediately
        await refetchRolesWithSkills();
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

    const entered = skillInput.trim();
    if (!entered) return;

    const allExisting = rolesWithSkills.flatMap((r) =>
      (r.skills || []).map((s) => s.skill_name.toLowerCase())
    );

    if (allExisting.includes(entered.toLowerCase())) {
      toastError("Skill already exists.");
      return;
    }

    try {
      const res = await addUserSkills({
        authorId: profile.id,
        targetRoleId: selectedRoleId,
        skillNames: [entered],
      });

      if (res.status === 201) {
        toastSuccess("Skill added successfully!");
        await refetchRolesWithSkills();
      } else {
        toastError("Failed to add skill.");
      }
    } catch (err) {
      console.error(err);
      toastError("Something went wrong.");
    } finally {
      setIsAddSkill(false);
      setSkillInput("");
      setSelectedRoleId("");
    }
  };

  const safeQaActivity = Array.isArray(qaActivity) ? qaActivity : [];

  return (
    <div className="p-6 bg-ibmlight min-h-screen">
      <div className="bg-white p-6 rounded shadow space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-ibmblue flex items-center gap-2">
            <UserCheck size={22} /> Career Profile
          </h1>
        </div>

        <div className="flex flex-col items-center gap-20 ">
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
            </div>
            <div className="absolute right-15 top-0">
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

        {/* 🏅 User Badges */}
        <section className="mt-6">
          <h2 className="text-lg font-semibold text-ibmblue flex items-center gap-2">
            <UserCheck size={18} /> Career Badges
          </h2>

          {!badges || badges.length === 0 ? (
            <p className="text-gray-500 mt-2">No badges earned yet.</p>
          ) : (
            <div className="flex flex-wrap gap-3 mt-3 bg-white border border-ibmblue p-4 rounded-xl mr-8">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className="px-3 py-1 rounded-full text-xs font-semibold shadow-sm flex items-center gap-2"
                  style={{
                    backgroundColor: badge.color || "#1f70c1",
                    color: "#fff",
                  }}
                >
                  {badge.image && (
                    <img
                      src={badge.image}
                      alt={badge.name}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                  )}
                  <span>{badge.name}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 🎯 CONSOLIDATED Target Roles with Skills Section */}
        <section className="mt-8">
          <div className="flex justify-between items-center pr-10">
            <h2 className="text-lg font-semibold text-ibmblue flex items-center gap-2">
              <Target size={18} className="text-ibmblue" /> Target Roles & Skills
            </h2>
           
          </div>

          {loadingRolesWithSkills ? (
            <div className="flex justify-center p-6">
              <span className="loading loading-bars loading-xl text-ibmblue"></span>
            </div>
          ) : rolesWithSkills.length === 0 ? (
            <div>
               <p className="text-gray-500 mt-2">
              No target roles yet. Click "Add Target Role" to get started.
            </p>
             <div
              onClick={() => setIsAddTargetRole(true)}
              className="flex w-[150px] p-2 rounded mt-5 border border-ibmblue items-center cursor-pointer hover:opacity-80 transition"
            >
              <h1 className="text-sm">Add Target Role</h1>
              <Plus size={24} className="text-ibmblue" />
            </div>
            </div>
           
          ) : (
            <>
            <div className="mt-4 bg-white border border-ibmblue rounded-xl p-4 space-y-4 mr-8">
              {rolesWithSkills.map((role) => (
                <div
                  key={role.id}
                  className="border border-gray-200 rounded-lg"
                >
                  {/* Accordion Header */}
                  <div
                    className="flex items-center justify-between p-3 cursor-pointer bg-gray-50 hover:bg-gray-100 rounded-t-lg transition"
                    onClick={() =>
                      setExpandedRoleId(
                        expandedRoleId === role.id ? null : role.id
                      )
                    }
                  >
                    <div className="flex items-center gap-2">
                      <Briefcase size={16} className="text-ibmblue" />
                      <span className="font-medium text-gray-800 capitalize">
                        {role.role_name}
                      </span>
                      {role.timeline && (
                        <span className="text-xs text-gray-500">
                          (by {new Date(role.timeline).toLocaleDateString()})
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRoleId(role.id);
                          setIsAddSkill(true);
                        }}
                        className="text-ibmblue text-sm font-medium hover:underline flex items-center gap-1"
                      >
                        Add Skill <Plus size={16} />
                      </button>

                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          try {
                            const res = await deleteUserTargetRole(role.id);
                            if (res.status === 200) {
                              toastSuccess(res.data.message);
                              await refetchRolesWithSkills();
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

                      {expandedRoleId === role.id ? (
                        <ChevronUp size={18} className="text-ibmblue" />
                      ) : (
                        <ChevronDown size={18} className="text-ibmblue" />
                      )}
                    </div>
                  </div>

                  {/* Accordion Body */}
                  {expandedRoleId === role.id && (
                    <div className="p-4 bg-white border-t border-gray-200 rounded-b-lg">
                      {role.skills && role.skills.length > 0 ? (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {role.skills.map((skill) => (
                            <div
                              key={skill.id}
                              className="flex items-center gap-1 bg-ibmblue text-white text-xs px-3 py-1 rounded-full"
                            >
                              <span>{skill.skill_name}</span>
                              <button
                                onClick={async () => {
                                  try {
                                    const res = await deleteUserSkill(skill.id);
                                    if (res.status === 200) {
                                      toastSuccess(res.data.message);
                                      await refetchRolesWithSkills();
                                    } else {
                                      toastError("Failed to delete skill.");
                                    }
                                  } catch {
                                    toastError("Server error.");
                                  }
                                }}
                                className="hover:text-red-400 transition"
                                title="Remove skill"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 ml-6">
                          No skills linked yet. Click "Add Skill" to add your first skill.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
             <div
              onClick={() => setIsAddTargetRole(true)}
              className="flex w-[150px] p-2 rounded mt-5 border border-ibmblue items-center cursor-pointer hover:opacity-80 transition"
            >
              <h1 className="text-sm">Add Target Role</h1>
              <Plus size={24} className="text-ibmblue" />
            </div>
            </>
            
          )}
        </section>

        <section className="bg-white rounded-lg p-6 mt-6 text-xs">
          <ActivityHeatmap data={safeQaActivity} />
        </section>
      </div>

      {/* Add Target Role Modal */}
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
                  showYearDropdown
                  showMonthDropdown
                  dropdownMode="select"
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

      {/* Edit Profile Modal */}
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
                  {rolesWithSkills.map((role) => (
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
                  <select
                    name="band_level"
                    value={editForm.band_level}
                    onChange={handleEditChange}
                    className="w-full flex-1 border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="">-- Select Band Level --</option>
                    {[
                      "3",
                      "4",
                      "TN",
                      "5",
                      "6",
                      "6a",
                      "6b",
                      "7",
                      "7a",
                      "7b",
                      "8",
                      "9",
                      "10",
                      "D",
                      "C",
                      "B",
                      "A",
                    ].map((band) => (
                      <option key={band} value={band}>
                        {band}
                      </option>
                    ))}
                  </select>
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
                    showYearDropdown
                    showMonthDropdown
                    dropdownMode="select"
                  />
                </div>
                {editForm.target_timeline &&
                  daysUntil(editForm.target_timeline) < 90 && (
                    <p className="text-yellow-400 text-sm mt-1">
                      The date you have set seems quite close, try a date
                      further away. Remember, there's no rush when it comes to
                      achieving your goals!
                    </p>
                  )}
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

      {/* Add Skill Modal */}
      {isAddSkill && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-ibmblue">Add Skill</h3>
              <button
                onClick={() => setIsAddSkill(false)}
                className="text-gray-500 text-2xl"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Enter Skill
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    className="flex-1 border border-gray-300 rounded px-3 py-2"
                    placeholder="Type a skill"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  className="btn"
                  onClick={() => {
                    setIsAddSkill(false);
                    setSkillInput("");
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn bg-ibmblue text-white"
                  onClick={saveSkills}
                >
                  Add
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
