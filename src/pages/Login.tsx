import React, { useState } from 'react';
import { supabase } from '../config'; 
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react'; 
import toast from 'react-hot-toast';

export default function Login() {
    const [collegeRoll, setCollegeRoll] = useState('');
    const [password, setPassword] = useState('');
    
    // New state to track if the password should be visible
    const [showPassword, setShowPassword] = useState(false);
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Call the RPC function to get the email associated with the college roll
        const { data: email, error: rpcError } = await supabase
            .rpc('get_email_by_roll', { roll_input: collegeRoll });

        if (rpcError || !email) {
            setError('Invalid College Roll or Password');
            setLoading(false);
            return;
        }

        // Now that we have the email, we can attempt to sign in
        const { error: authError } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (authError) {
            setError('Invalid College Roll or Password');
            setLoading(false);
            return;
        }
        
        toast.success('Logged in successfully!');
        navigate('/dashboard');
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-900">Student Login</h2>
                
                {error && (
                    <div className="p-3 text-sm text-red-600 bg-red-100 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">College Roll</label>
                        <input 
                            type="text" 
                            required 
                            value={collegeRoll}
                            onChange={(e) => setCollegeRoll(e.target.value)}
                            className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 uppercase" 
                            placeholder="e.g. 21CS01"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <div className="relative mt-1">
                            <input 
                                // Toggle between text and password type
                                type={showPassword ? "text" : "password"} 
                                required 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                // Added pr-10 so the text doesn't type underneath the icon
                                className="w-full px-3 py-2 pr-10 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-4 py-2 mt-6 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                        {loading ? 'Logging in...' : 'Log In'}
                    </button>
                </form>

                <div className="text-sm text-center text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-blue-600 hover:underline">
                        Register here
                    </Link>
                </div>
            </div>
        </div>
    );
}