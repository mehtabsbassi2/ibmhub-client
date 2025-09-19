import React, { useState } from "react";
import { useSelector } from "react-redux";
import { getProfile } from "../../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { LOGIN_PAGE, MANAGER, PROFILE } from "../../util/Routes";
import { FaChevronDown } from "react-icons/fa";

const Navbar = () => {
  const profile = useSelector(getProfile);
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);

  const handleProfile = () => {
    navigate(PROFILE);
    setOpenMenu(false);
  };

  const handleSwitchAccount = () => {
  
    setOpenMenu(false);
    navigate(MANAGER)
  };

  return (
    <div className="w-full h-[100px] px-6 flex items-center justify-end border-b border-ibmborder bg-white shadow-sm relative">
      {/* Profile Section with Dropdown */}
      <div
        onClick={() => setOpenMenu(!openMenu)}
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
        <FaChevronDown className="text-gray-500 text-xs" />
      </div>

      {openMenu && (
        <div className="absolute top-[80px] right-6 w-48 bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden z-50">
          <button
            onClick={handleProfile}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
          >
            View Profile
          </button>
          <button
            onClick={handleSwitchAccount}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
          >
            Switch to Manager
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
