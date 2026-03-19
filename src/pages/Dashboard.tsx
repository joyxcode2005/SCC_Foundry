
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config'; // Adjust path if your config is elsewhere

// Adjust this path and extension (.png, .svg, etc.) to match your actual logo file
import logo from '../assets/logo.png'; 

export default function Dashboard() {
    const navigate = useNavigate();

    // A simple function to log the user out and return them to the login screen
    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="flex flex-col items-center w-full max-w-2xl p-12 space-y-2 bg-white rounded-lg shadow-md">
                
                {/* Logo Section */}
                <div className="flex items-center justify-center w-64 h-64">
                    <img 
                        src={logo} 
                        alt="Foundry Logo" 
                        className="object-contain w-full h-full"
                    />
                </div>

                {/* Welcome Text */}
                <h1 className="text-4xl font-extrabold text-center text-gray-900 tracking-tight">
                    Foundry Dashboard
                </h1>

                <p className="text-gray-500 text-center">
                    Welcome to the student portal.
                </p>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="px-6 py-2 mt-8 text-sm font-medium text-red-600 transition-colors border border-red-200 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                    Log Out
                </button>
            </div>
        </div>
    );
}