import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../../api/api";
import { toastError, toastSuccess } from "../../components/Toastify";
import { ArrowLeft } from "lucide-react";
import { supabase } from "../../util/superbaseClient";
import { MANAGER } from "../../util/Routes";

const CreateNewUserPage = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [bandLevel, setBandLevel] = useState("");
  const [department, setDepartment] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});

  // Auto-generate password when firstName changes
  useEffect(() => {
    if (firstName.trim()) {
      setPassword(firstName.toLowerCase() + "@ibmhub");
    } else {
      setPassword("");
    }
  }, [firstName]);

  const validate = () => {
    const newErrors = {};

    if (!firstName.trim()) newErrors.firstName = "First name is required.";
    if (!lastName.trim()) newErrors.lastName = "Last name is required.";

    if (!email.trim()) newErrors.email = "Email is required.";
    else {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email.trim())) {
        newErrors.email = "Enter a valid email address.";
      }
    }

    if (!password.trim()) newErrors.password = "Password is required.";

    if (!jobTitle.trim()) newErrors.jobTitle = "Job Title is required.";
    else if (jobTitle.trim().length < 2 || jobTitle.trim().length > 100) {
      newErrors.jobTitle = "Job Title must be between 2 and 100 characters.";
    }

    const bandLevelNum = parseInt(bandLevel.toString().trim(), 10);
    if (!bandLevel) newErrors.bandLevel = "Band Level is required.";
    else if (isNaN(bandLevelNum) || bandLevelNum < 6 || bandLevelNum > 10) {
      newErrors.bandLevel = "Band Level must be a number between 6 and 10.";
    }

    if (!department.trim()) newErrors.department = "Department is required.";
    if (!targetRole.trim()) newErrors.targetRole = "Target Role is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      console.log("UserNew",data)
      const payload = {
        id:data.user.id,
        email: data.user.email,
        name: firstName.trim() + " "+ lastName.trim(),
        job_title: jobTitle.trim(),
        band_level: parseInt(bandLevel, 10),
        department: department.trim(),
        target_role: targetRole.trim(),
      };

      await createUser(payload);

      toastSuccess("User created successfully ✅");
      navigate(MANAGER);
    } catch (err) {
      console.error("Failed to create user:", err);
      toastError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ibmlight p-6 flex flex-col items-center">
      {/* Header with Back + Title */}
      <div className="w-full max-w-4xl mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-ibmblue">Create New User</h2>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-ibmblue hover:underline"
        >
          <ArrowLeft size={20} /> Back
        </button>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-md p-8 max-w-4xl w-full"
        noValidate
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column */}
          <div className="space-y-4">
            {/* First Name */}
            <div>
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={`input input-bordered w-full ${
                  errors.firstName ? "input-error" : ""
                }`}
              />
              {errors.firstName && (
                <p className="text-red-600 text-sm">{errors.firstName}</p>
              )}
            </div>

         

            {/* Email */}
            <div>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`input input-bordered w-full ${
                  errors.email ? "input-error" : ""
                }`}
              />
              {errors.email && (
                <p className="text-red-600 text-sm">{errors.email}</p>
              )}
            </div>

              {/* Job Title */}
            <div>
              <input
                type="text"
                placeholder="Job Title (e.g. Frontend Developer)"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className={`input input-bordered w-full ${
                  errors.jobTitle ? "input-error" : ""
                }`}
              />
              {errors.jobTitle && (
                <p className="text-red-600 text-sm">{errors.jobTitle}</p>
              )}
            </div>

            {/* Password (auto-generated, not editable) */}
            <div>
              <input
                type="text"
                placeholder="Password"
                value={password}
                readOnly
                className="input input-bordered w-full bg-gray-100 text-gray-600 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500">
                Auto-generated from first name (lowercase@ibmhub)
              </p>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4">

             {/* Last Name */}
            <div>
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={`input input-bordered w-full ${
                  errors.lastName ? "input-error" : ""
                }`}
              />
              {errors.lastName && (
                <p className="text-red-600 text-sm">{errors.lastName}</p>
              )}
            </div>
            

            {/* Band Level */}
            <div>
              <input
                type="number"
                placeholder="Band Level (6-10)"
                value={bandLevel}
                onChange={(e) => setBandLevel(e.target.value)}
                className={`input input-bordered w-full ${
                  errors.bandLevel ? "input-error" : ""
                }`}
                min={6}
                max={10}
              />
              {errors.bandLevel && (
                <p className="text-red-600 text-sm">{errors.bandLevel}</p>
              )}
            </div>

            {/* Department */}
            <div>
              <input
                type="text"
                placeholder="Department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className={`input input-bordered w-full ${
                  errors.department ? "input-error" : ""
                }`}
              />
              {errors.department && (
                <p className="text-red-600 text-sm">{errors.department}</p>
              )}
            </div>

            {/* Target Role */}
            <div>
              <input
                type="text"
                placeholder="Target Role"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className={`input input-bordered w-full ${
                  errors.targetRole ? "input-error" : ""
                }`}
              />
              {errors.targetRole && (
                <p className="text-red-600 text-sm">{errors.targetRole}</p>
              )}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-8 w-full btn bg-ibmblue text-white hover:bg-ibmblue/90 disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create User"}
        </button>
      </form>
    </div>
  );
};

export default CreateNewUserPage;
