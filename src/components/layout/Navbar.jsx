import React, { useState } from "react";
import { useSelector } from "react-redux";
import { getProfile } from "../../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { PROFILE } from "../../util/Routes";


const Navbar = () => {
  const profile = useSelector(getProfile);
  const [openMenu, setOpenMenu] = useState(false);
  const navigate = useNavigate()


  return (
    <div className="w-full h-[100px] px-6 flex items-center justify-end border-b border-ibmborder bg-white shadow-sm relative">
      {/* Profile Section with Dropdown */}
      <div
        onClick={() =>navigate(PROFILE)}
        className="flex items-center gap-2 cursor-pointer"
      >
        <span className="text-sm font-medium hidden md:block text-gray-700">
          {profile?.name || "Guest"}
        </span>
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
