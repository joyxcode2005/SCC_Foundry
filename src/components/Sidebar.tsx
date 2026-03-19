import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../config";
import logo from "../assets/logo.png";
import toast from "react-hot-toast";


export default function Sidebar() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        toast.success("Logged out successfully!");
        navigate("/login");
    };

    // Helper for Tailwind active states
    const navItemClass = ({ isActive }: { isActive: boolean }) =>
        `block px-4 py-2 mt-2 text-sm font-semibold rounded-lg ${isActive
            ? 'bg-gray-200 text-gray-900'
            : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
        }   `


    return (
        <aside className="flex flex-col w-64 h-screen px-4 py-8 overflow-y-auto bg-white border-r">
            <div className="flex items-center justify-center mb-8">
                <img src={logo} alt="Foundry Logo" className="object-contain w-16 h-16" />
                <span className="ml-3 text-2xl font-extrabold text-gray-900">Foundry</span>
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-col flex-1 mt-6">
                <NavLink to="/dashboard" end className={navItemClass}>Overview</NavLink>
                <NavLink to="/dashboard/leaderboard" className={navItemClass}>Leaderboard</NavLink>
                <NavLink to="/dashboard/tasks" className={navItemClass}>Tasks</NavLink>
                <NavLink to="/dashboard/projects" className={navItemClass}>Projects</NavLink>
                <NavLink to="/dashboard/profile" className={navItemClass}>Profile</NavLink>
            </nav>
            {/* Logout Area */}
            <div className="mt-auto">
                <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-sm font-medium text-red-600 transition-colors border border-red-200 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                    Log Out
                </button>
            </div>
        </aside>
    )
}