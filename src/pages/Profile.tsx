import { useState, useEffect } from 'react';
import { supabase } from '../config';

// Updated interface to match your database schema
interface UserProfile {
    first_name: string;
    middle_name: string;
    last_name: string;
    phone: string;
    college_roll: string;
    department: string;
    role: string;
    email: string;
}

export default function Profile() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    
    const [profile, setProfile] = useState<UserProfile>({
        first_name: '',
        middle_name: '',
        last_name: '',
        phone: '',
        college_roll: '',
        department: '',
        role: 'MEMBER',
        email: ''
    });

    const [formData, setFormData] = useState<UserProfile>(profile);

    useEffect(() => {
        async function getProfile() {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                // Fetch from your custom 'users' table
                const { data, error } = await supabase
                    .from('users')
                    .select('first_name, middle_name, last_name, phone, college_roll, department, role, email')
                    .eq('id', user.id)
                    .single();

                if (!error && data) {
                    const fetchedProfile = {
                        first_name: data.first_name || '',
                        middle_name: data.middle_name || '',
                        last_name: data.last_name || '',
                        phone: data.phone || '',
                        college_roll: data.college_roll || '',
                        department: data.department || '',
                        role: data.role || 'MEMBER',
                        email: data.email || user.email || '',
                    };
                    setProfile(fetchedProfile);
                    setFormData(fetchedProfile);
                } else if (error && error.code !== 'PGRST116') {
                    console.error('Error loading user:', error.message);
                }
            }
            setLoading(false);
        }

        getProfile();
    }, []);

    const handleEditToggle = () => {
        setMessage({ type: '', text: '' }); 
        setFormData(profile); 
        setIsEditing(!isEditing);
    };

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('No user is currently logged in.');

            // Map the formData to your exact database columns
            const updates = {
                id: user.id,
                first_name: formData.first_name,
                middle_name: formData.middle_name || null, // Handle nullable field
                last_name: formData.last_name,
                phone: formData.phone,
                college_roll: formData.college_roll,
                department: formData.department,
                updated_at: new Date(),
            };

            const { error } = await supabase.from('users').upsert(updates);
            if (error) throw error;

            setProfile(formData);
            setIsEditing(false);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);

        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Error updating profile.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500 animate-pulse">Loading profile...</div>
            </div>
        );
    }

    // Helper to format the full name cleanly
    const fullName = [profile.first_name, profile.middle_name, profile.last_name]
        .filter(Boolean)
        .join(' ');

    return (
        <div className="max-w-4xl">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
                    <p className="mt-2 text-gray-600">Manage your personal and academic information.</p>
                </div>
                
                {!isEditing && (
                    <button
                        onClick={handleEditToggle}
                        className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        Edit Profile
                    </button>
                )}
            </div>

            {message.text && (
                <div className={`mb-6 p-4 rounded-md text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                    {message.text}
                </div>
            )}

            <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
                {!isEditing ? (
                    // ---------------- READ-ONLY VIEW ----------------
                    <div className="px-6 py-8 sm:p-10">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-medium leading-6 text-gray-900">Academic Details</h3>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                Role: {profile.role}
                            </span>
                        </div>
                        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                                <dd className="mt-1 text-base text-gray-900">{fullName || 'Not provided'}</dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">Email address</dt>
                                <dd className="mt-1 text-base text-gray-900">{profile.email || 'Not provided'}</dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">Phone</dt>
                                <dd className="mt-1 text-base text-gray-900">{profile.phone || 'Not provided'}</dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">College Roll</dt>
                                <dd className="mt-1 text-base text-gray-900 font-mono">{profile.college_roll || 'Not provided'}</dd>
                            </div>
                            <div className="sm:col-span-2">
                                <dt className="text-sm font-medium text-gray-500">Department</dt>
                                <dd className="mt-1 text-base text-gray-900">{profile.department || 'Not provided'}</dd>
                            </div>
                        </dl>
                    </div>
                ) : (
                    // ---------------- EDIT MODE FORM ----------------
                    <form onSubmit={handleUpdate} className="px-6 py-8 sm:p-10 space-y-6">
                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                            
                            {/* Name Fields */}
                            <div className="sm:col-span-2">
                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name *</label>
                                <input id="firstName" type="text" required value={formData.first_name} onChange={(e) => setFormData({...formData, first_name: e.target.value})} className="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="middleName" className="block text-sm font-medium text-gray-700">Middle Name</label>
                                <input id="middleName" type="text" value={formData.middle_name} onChange={(e) => setFormData({...formData, middle_name: e.target.value})} className="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name *</label>
                                <input id="lastName" type="text" required value={formData.last_name} onChange={(e) => setFormData({...formData, last_name: e.target.value})} className="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                            </div>

                            {/* Contact Fields */}
                            <div className="sm:col-span-3">
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number *</label>
                                <input id="phone" type="tel" required placeholder="+91 98765 43210" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                            </div>
                            <div className="sm:col-span-3">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                                <input id="email" type="email" disabled value={formData.email} className="block w-full px-4 py-2 mt-1 text-gray-500 bg-gray-100 border border-gray-300 rounded-md shadow-sm cursor-not-allowed sm:text-sm" />
                            </div>

                            {/* Academic Fields */}
                            <div className="sm:col-span-3">
                                <label htmlFor="collegeRoll" className="block text-sm font-medium text-gray-700">College Roll *</label>
                                <input id="collegeRoll" type="text" required value={formData.college_roll} onChange={(e) => setFormData({...formData, college_roll: e.target.value})} className="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-mono" />
                            </div>
                            <div className="sm:col-span-3">
                                <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department *</label>
                                <input id="department" type="text" required placeholder="Computer Science" value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} className="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                            </div>

                        </div>

                        <div className="flex justify-end pt-4 space-x-3 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={handleEditToggle}
                                disabled={saving}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-gray-900 border border-transparent rounded-md shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50"
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}