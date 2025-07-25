import React, { useState } from 'react';
import { supabase } from "../../util/superbaseClient"
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { setAuthUser, setProfile } from '../../redux/userSlice';
import { SIGN_UP_PAGE, UPDATE_PROFILE } from '../../util/Routes';
import { getUserById } from '../../api/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }
  

    dispatch(setAuthUser(data.user));
  console.log("USER",data.user)
    try {
        
      const res = await getUserById(data.user.id)
        console.log("USERDB",res)

      
      if (res) {
        dispatch(setProfile(res));
        navigate('/');
      } else {
        navigate(UPDATE_PROFILE);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      navigate(UPDATE_PROFILE);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ibmlight px-4 py-10">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-ibmblue text-center mb-6">Welcome Back</h2>

        <form onSubmit={handleLogin}>
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
            Login
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to={SIGN_UP_PAGE} className="text-ibmblue hover:underline font-medium">
            Sign up here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
