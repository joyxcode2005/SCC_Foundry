import React, { useState } from "react";
import { supabase } from "../config";
import { Link } from "react-router-dom";


export default function Register() {
    const [formData, setFormData] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        phone: "",
        collegeRoll: "",
        department: "",
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        // Sign up the user in Supabase Auth AND pass the metadata for your trigger
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
                data: {
                    first_name: formData.firstName,
                    middle_name: formData.middleName || null,
                    last_name: formData.lastName,
                    phone: formData.phone,
                    college_roll: formData.collegeRoll,
                    department: formData.department,
                }
            }
        });

        if (authError) {
            setError(authError.message);
            setLoading(false);
            return;
        }

        if (!authData?.user) {
            setError('User registration failed. Please try again.');
            setLoading(false);
            return;
        }

        // If it gets here, it was successful!
        setMessage('Registration successful! Please check your email to verify your account.');
        setLoading(false);
    }

    return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
            <div className="w-full max-w-2xl p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-900">Student Registration</h2>

                {error && <div className="p-3 text-sm text-red-600 bg-red-100 rounded">{error}</div>}
                {message && <div className="p-3 text-sm text-green-600 bg-green-100 rounded">{message}</div>}

                <form onSubmit={handleRegister} className="space-y-4">

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">First Name *</label>
                            <input type="text" name="firstName" required onChange={handleChange}
                                className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Middle Name</label>
                            <input type="text" name="middleName" onChange={handleChange}
                                className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Last Name *</label>
                            <input type="text" name="lastName" required onChange={handleChange}
                                className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">College Roll *</label>
                            <input type="text" name="collegeRoll" required onChange={handleChange} placeholder="e.g. 21CS01"
                                className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Department *</label>
                            <input type="text" name="department" required onChange={handleChange} placeholder="e.g. Computer Science"
                                className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone *</label>
                            <input type="tel" name="phone" required onChange={handleChange}
                                className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email *</label>
                            <input type="email" name="email" required onChange={handleChange}
                                className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password *</label>
                            <input type="password" name="password" required onChange={handleChange} minLength={6}
                                className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-4 py-2 mt-6 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <div className="text-sm text-center text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 hover:underline">
                        Log in here
                    </Link>
                </div>
            </div>
        </div>
    )
}
