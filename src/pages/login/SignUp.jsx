import React, { useState } from 'react';
import { supabase } from '../../util/superbaseClient';
import { useNavigate, Link } from 'react-router-dom';
import { LOGIN_PAGE } from '../../util/Routes';
import { toastSuccess,toastError } from '../../components/Toastify';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      
      toastError(error.message)
    } else {
      toastSuccess("Account created! Please log in.")
      navigate(LOGIN_PAGE);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ibmlight px-4 py-10">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-ibmblue text-center mb-6">Create Your Account</h2>

        <form onSubmit={handleSignUp}>
          <input
            type="email"
            placeholder="Email"
            className="border border-gray-300 rounded w-full p-2 mb-4 focus:outline-ibmblue"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="border border-gray-300 rounded w-full p-2 mb-6 focus:outline-ibmblue"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="bg-ibmblue hover:bg-blue-700 text-white font-semibold w-full py-2 rounded transition duration-200"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to={LOGIN_PAGE} className="text-ibmblue hover:underline font-medium">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
