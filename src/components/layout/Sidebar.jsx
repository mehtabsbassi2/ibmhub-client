import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
import { FaUserCircle,FaUsers } from "react-icons/fa";
import { PiQuestionFill } from "react-icons/pi";
import { FiLogOut } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "../../util/superbaseClient";
import { getProfile, logout } from "../../redux/userSlice";
import { DRAFTS, MANAGER, PROFILE, QUESTIONS_PAGE } from "../../util/Routes";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const profile = useSelector(getProfile);

  const navLinks = [
    { name: "Career Dashboard ", path: "/", icon: <AiFillHome size={20} /> },
    { name: "Q & A Hub", path: QUESTIONS_PAGE, icon: <PiQuestionFill size={20} /> },
    { name: "Profile", path: PROFILE, icon: <FaUserCircle size={20} /> },
  ];

  // Conditionally push Users Overview if ADMIN
  if (profile?.accountType === "ADMIN") {
    navLinks.push({
      name: "Manager Dashboard",
      path: MANAGER,
      icon: <FaUsers size={20} />,
    });
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    dispatch(logout());
    navigate("/login");
  };

  const linkClass = (path) =>
    `w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-all duration-150 ${
      location.pathname === path
        ? "bg-ibmblue text-white"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <aside className="w-[250px] min-w-[250px] max-w-[250px] border-r border-ibmborder flex flex-col bg-white">
      <div>
        <h1 className="text-2xl font-bold text-ibmblue px-6 py-6">
          IBM Developer Career Hub
        </h1>
        <nav className="flex flex-col gap-1 px-2">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path} className={linkClass(link.path)}>
              {link.icon}
              {link.name}
            </Link>
          ))}
        </nav>
      </div>

      <div className="px-2 pb-6">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 mt-12 text-sm font-medium text-gray-700 hover:bg-red-500 hover:text-white rounded-md transition-colors"
        >
          <FiLogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
