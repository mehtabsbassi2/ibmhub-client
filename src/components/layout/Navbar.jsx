import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { getQuestions } from '../../api/api';
import { setQuestions } from '../../redux/questionSlice';
import { useSelector } from 'react-redux';
import {  getProfile } from '../../redux/userSlice';
import { useNavigate } from 'react-router-dom';
import { PROFILE } from '../../util/Routes';

const Navbar = () => {
  const dispatch = useDispatch();
  const profile = useSelector(getProfile)
  const [search, setSearch] = useState('');
  const navigate = useNavigate()

  const handleSearch = async (e) => {
    e.preventDefault();
    if (search.trim()) {
      await fetchQuestions();
    }
  };

  const handleProfile =()=>{
    navigate(PROFILE)
  }

  const fetchQuestions = async () => {
    try {
      const res = await getQuestions({ search });
      dispatch(setQuestions({ questions: res.questions || []}));
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  return (
    <div className="w-full h-[100px] px-6 flex items-center justify-end border-b border-ibmborder bg-white shadow-sm">
      {/* Search Bar */}
      {/* <form
        onSubmit={handleSearch}
        className="flex items-center gap-2 bg-ibmlight rounded px-3 py-2 w-[40%] max-w-[480px]"
      >
        <FaSearch className="text-gray-500 text-sm" />
        <input
          type="text"
          placeholder="Search questions, tags, users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent focus:outline-none text-sm text-gray-800 placeholder:text-gray-500"
        />
      </form> */}

      {/* Profile Section */}
      <div onClick={handleProfile} className="flex items-center gap-3 cursor-pointer">
        <span className="text-sm font-medium hidden md:block text-gray-700">{profile?.name}</span>
        <img
          src="https://www.gravatar.com/avatar?d=mp"
          alt="Profile"
          className="w-9 h-9 rounded-full object-cover border border-gray-300"
        />
      </div>
    </div>
  );
};

export default Navbar;
