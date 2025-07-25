import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getAuthUser } from '../../redux/userSlice';
import { createUser } from '../../api/api';
import {toastError,toastSuccess} from '../../components/Toastify';

const UpdateProfile = () => {
  const navigate = useNavigate();
  const supabaseUser = useSelector(getAuthUser);

  const [name, setName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [bandLevel, setBandLevel] = useState('');
  const [department, setDepartment] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    name: '',
    jobTitle: '',
    bandLevel: '',
    email: '',
  });

  const validate = () => {
    const newErrors = {};

    const trimmedName = name.trim();
    if (trimmedName.length < 2 || trimmedName.length > 50) {
      newErrors.name = 'Name must be between 2 and 50 characters.';
    }

    const trimmedJobTitle = jobTitle.trim();
    if (trimmedJobTitle.length < 2 || trimmedJobTitle.length > 100) {
      newErrors.jobTitle = 'Job Title must be between 2 and 100 characters.';
    }

    const bandLevelNum = parseInt(bandLevel.toString().trim(), 10);
    if (isNaN(bandLevelNum) || bandLevelNum < 6 || bandLevelNum > 10) {
      newErrors.bandLevel = 'Band Level must be a number between 6 and 10.';
    }

    // const emailPattern = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9-]+\.)?ibm\.com$/;
    // if (!emailPattern.test(supabaseUser.email)) {
    //   newErrors.email = 'Email must be a valid IBM email address.';
    // }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return; // Don't submit if validation fails
    }

    try {
      setLoading(true);

      const payload = {
        id: supabaseUser.id,
        email: supabaseUser.email,
        name: name.trim(),
        job_title: jobTitle.trim(),
        band_level: parseInt(bandLevel, 10),
        department: department.trim(),
        target_role: targetRole.trim(),
      };

      await createUser(payload);

      toastSuccess("Profile Saved")
      navigate('/');
    } catch (err) {
      console.error('Failed to save profile:', err);
      toastError("An error occurred. Please try again.")
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ibmlight flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-md p-6 w-full max-w-xl"
        noValidate
      >
        <h2 className="text-2xl font-semibold mb-6 text-ibmblue text-center">
        Complete  Your Profile
        </h2>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full border rounded p-2 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            {errors.name && (
              <p className="text-red-600 mt-1 text-sm">{errors.name}</p>
            )}
          </div>

          {/* Job Title */}
          <div>
            <input
              type="text"
              placeholder="Job Title (e.g. Frontend Developer)"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className={`w-full border rounded p-2 ${
                errors.jobTitle ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            {errors.jobTitle && (
              <p className="text-red-600 mt-1 text-sm">{errors.jobTitle}</p>
            )}
          </div>

          {/* Band Level */}
          <div>
            <input
              type="number"
              placeholder="Band Level (6-10)"
              value={bandLevel}
              onChange={(e) => setBandLevel(e.target.value)}
              className={`w-full border rounded p-2 ${
                errors.bandLevel ? 'border-red-500' : 'border-gray-300'
              }`}
              required
              min={6}
              max={10}
            />
            {errors.bandLevel && (
              <p className="text-red-600 mt-1 text-sm">{errors.bandLevel}</p>
            )}
          </div>

          {/* Department */}
          <div>
            <input
              type="text"
              placeholder="Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full border border-gray-300 rounded p-2"
            />
          </div>

          {/* Target Role */}
          <div>
            <input
              type="text"
              placeholder="Target Role"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full border border-gray-300 rounded p-2"
            />
          </div>

          {/* Email validation message */}
          {errors.email && (
            <p className="text-red-600 mt-1 text-sm">{errors.email}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full bg-ibmblue text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-60"
        >
          {loading ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
};

export default UpdateProfile;
