import { useState } from "react";
import {
  FaUsers,
  FaUserPlus,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

const Sidebar = ({ setShowForm }) => {
  const [openUsers, setOpenUsers] = useState(false);

  return (
    <div className="w-64 bg-black text-white hidden md:flex flex-col min-h-screen">
      <div className="flex flex-col p-4 gap-2 mt-5">
        {/* USERS DROPDOWN */}
        <button
          onClick={() => setOpenUsers(!openUsers)}
          className="flex items-center justify-between hover:bg-gray-800 p-3 rounded-lg transition"
        >
          <div className="flex items-center gap-3">
            <FaUsers />
            <span>Users</span>
          </div>

          {openUsers ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
        </button>

        {/* DROPDOWN ITEMS */}
        {openUsers && (
          <div className="ml-6 flex flex-col gap-2">
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-3 hover:bg-gray-800 p-2 rounded-lg transition text-sm"
            >
              <FaUserPlus />
              Add User
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
