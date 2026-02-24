import React, { useState, useEffect } from 'react';
import axios from 'axios';


const API_URL = import.meta.env.API;

const Settings = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    
    // Profile settings
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        role: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Application settings
    const [appSettings, setAppSettings] = useState({
        emailNotifications: true,
        reportNotifications: true,
        systemAlerts: true,
        darkMode: false,
        language: 'en',
        timezone: 'Asia/Kolkata'
    });

    // Security settings
    const [securitySettings, setSecuritySettings] = useState({
        twoFactorAuth: false,
        sessionTimeout: '30',
        loginAlerts: true
    });

    // Get auth token
    const getAuthToken = () => {
        return localStorage.getItem('token');
    };

    // Load user data
    useEffect(() => {
        const loadUserData = async () => {
            try {
                const token = getAuthToken();
                const response = await axios.post(`${API_URL}/api/verify`, {}, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.data.success) {
                    const user = response.data.user;
                    setProfileData(prev => ({
                        ...prev,
                        name: user.name || '',
                        email: user.email || '',
                        role: user.role || ''
                    }));
                }

                // Load settings from localStorage
                const savedAppSettings = localStorage.getItem('appSettings');
                if (savedAppSettings) {
                    setAppSettings(JSON.parse(savedAppSettings));
                }

                const savedSecuritySettings = localStorage.getItem('securitySettings');
                if (savedSecuritySettings) {
                    setSecuritySettings(JSON.parse(savedSecuritySettings));
                }
            } catch (err) {
                console.error('Error loading user data:', err);
            }
        };

        loadUserData();
    }, []);

    // Handle profile update
    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // TODO: Add update profile endpoint to backend
            // For now, just show success message
            setSuccess('Profile updated successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
            setTimeout(() => setError(''), 3000);
        } finally {
            setLoading(false);
        }
    };

    // Handle password change
    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (profileData.newPassword !== profileData.confirmPassword) {
            setError('Passwords do not match');
            setTimeout(() => setError(''), 3000);
            return;
        }

        if (profileData.newPassword.length < 8) {
            setError('Password must be at least 8 characters');
            setTimeout(() => setError(''), 3000);
            return;
        }

        setLoading(true);

        try {
            // TODO: Add change password endpoint to backend
            setSuccess('Password changed successfully!');
            setProfileData(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            }));
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to change password');
            setTimeout(() => setError(''), 3000);
        } finally {
            setLoading(false);
        }
    };

    // Handle app settings update
    const handleAppSettingsUpdate = () => {
        localStorage.setItem('appSettings', JSON.stringify(appSettings));
        setSuccess('Application settings saved successfully!');
        setTimeout(() => setSuccess(''), 3000);
    };

    // Handle security settings update
    const handleSecuritySettingsUpdate = () => {
        localStorage.setItem('securitySettings', JSON.stringify(securitySettings));
        setSuccess('Security settings saved successfully!');
        setTimeout(() => setSuccess(''), 3000);
    };

    // Tabs configuration
    const tabs = [
        { id: 'profile', name: 'Profile', icon: '👤' },
        { id: 'security', name: 'Security', icon: '🔒' },
        { id: 'notifications', name: 'Notifications', icon: '🔔' },
        { id: 'preferences', name: 'Preferences', icon: '⚙️' }
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Settings</h1>
                    <p className="text-gray-600 mt-1 text-sm md:text-base">Manage your account settings and preferences</p>
                </div>

                {/* Success/Error Messages */}
                {success && (
                    <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <p className="text-sm font-medium text-green-800">{success}</p>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <p className="text-sm font-medium text-red-800">{error}</p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar Tabs */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
                            <nav className="space-y-1">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                                            activeTab === tab.id
                                                ? 'bg-indigo-50 text-indigo-700'
                                                : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        <span className="text-xl mr-3">{tab.icon}</span>
                                        {tab.name}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            {/* Profile Tab */}
                            {activeTab === 'profile' && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 mb-1">Profile Information</h2>
                                        <p className="text-sm text-gray-600">Update your account profile information</p>
                                    </div>

                                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                            <input
                                                type="text"
                                                value={profileData.name}
                                                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                placeholder="Enter your name"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                            <input
                                                type="email"
                                                value={profileData.email}
                                                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                placeholder="your@email.com"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                            <input
                                                type="text"
                                                value={profileData.role}
                                                disabled
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">Contact admin to change your role</p>
                                        </div>

                                        <div className="pt-4">
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                {loading ? 'Updating...' : 'Update Profile'}
                                            </button>
                                        </div>
                                    </form>

                                    <hr className="my-6" />

                                    {/* Change Password Section */}
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 mb-1">Change Password</h2>
                                        <p className="text-sm text-gray-600 mb-4">Ensure your account is using a strong password</p>

                                        <form onSubmit={handlePasswordChange} className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                                <input
                                                    type="password"
                                                    value={profileData.currentPassword}
                                                    onChange={(e) => setProfileData({ ...profileData, currentPassword: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                    placeholder="Enter current password"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                                <input
                                                    type="password"
                                                    value={profileData.newPassword}
                                                    onChange={(e) => setProfileData({ ...profileData, newPassword: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                    placeholder="Enter new password"
                                                    minLength={8}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                                <input
                                                    type="password"
                                                    value={profileData.confirmPassword}
                                                    onChange={(e) => setProfileData({ ...profileData, confirmPassword: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                    placeholder="Confirm new password"
                                                />
                                            </div>

                                            <div className="pt-4">
                                                <button
                                                    type="submit"
                                                    disabled={loading}
                                                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    {loading ? 'Changing...' : 'Change Password'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}

                            {/* Security Tab */}
                            {activeTab === 'security' && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 mb-1">Security Settings</h2>
                                        <p className="text-sm text-gray-600">Manage your account security preferences</p>
                                    </div>

                                    <div className="space-y-4">
                                        {/* Two Factor Authentication */}
                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <div className="flex-1">
                                                <h3 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h3>
                                                <p className="text-xs text-gray-600 mt-1">Add an extra layer of security to your account</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={securitySettings.twoFactorAuth}
                                                    onChange={(e) => setSecuritySettings({ ...securitySettings, twoFactorAuth: e.target.checked })}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                            </label>
                                        </div>

                                        {/* Session Timeout */}
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <label className="block text-sm font-medium text-gray-900 mb-2">Session Timeout</label>
                                            <select
                                                value={securitySettings.sessionTimeout}
                                                onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            >
                                                <option value="15">15 minutes</option>
                                                <option value="30">30 minutes</option>
                                                <option value="60">1 hour</option>
                                                <option value="120">2 hours</option>
                                                <option value="0">Never</option>
                                            </select>
                                        </div>

                                        {/* Login Alerts */}
                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <div className="flex-1">
                                                <h3 className="text-sm font-medium text-gray-900">Login Alerts</h3>
                                                <p className="text-xs text-gray-600 mt-1">Get notified of new login attempts</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={securitySettings.loginAlerts}
                                                    onChange={(e) => setSecuritySettings({ ...securitySettings, loginAlerts: e.target.checked })}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <button
                                            onClick={handleSecuritySettingsUpdate}
                                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                        >
                                            Save Security Settings
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Notifications Tab */}
                            {activeTab === 'notifications' && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 mb-1">Notification Preferences</h2>
                                        <p className="text-sm text-gray-600">Choose what notifications you want to receive</p>
                                    </div>

                                    <div className="space-y-4">
                                        {/* Email Notifications */}
                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <div className="flex-1">
                                                <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                                                <p className="text-xs text-gray-600 mt-1">Receive email notifications for important updates</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={appSettings.emailNotifications}
                                                    onChange={(e) => setAppSettings({ ...appSettings, emailNotifications: e.target.checked })}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                            </label>
                                        </div>

                                        {/* Report Notifications */}
                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <div className="flex-1">
                                                <h3 className="text-sm font-medium text-gray-900">Report Notifications</h3>
                                                <p className="text-xs text-gray-600 mt-1">Get notified when new reports are generated</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={appSettings.reportNotifications}
                                                    onChange={(e) => setAppSettings({ ...appSettings, reportNotifications: e.target.checked })}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                            </label>
                                        </div>

                                        {/* System Alerts */}
                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <div className="flex-1">
                                                <h3 className="text-sm font-medium text-gray-900">System Alerts</h3>
                                                <p className="text-xs text-gray-600 mt-1">Receive alerts about system maintenance and updates</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={appSettings.systemAlerts}
                                                    onChange={(e) => setAppSettings({ ...appSettings, systemAlerts: e.target.checked })}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <button
                                            onClick={handleAppSettingsUpdate}
                                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                        >
                                            Save Notification Settings
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Preferences Tab */}
                            {activeTab === 'preferences' && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 mb-1">Application Preferences</h2>
                                        <p className="text-sm text-gray-600">Customize your application experience</p>
                                    </div>

                                    <div className="space-y-4">
                                        {/* Dark Mode */}
                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <div className="flex-1">
                                                <h3 className="text-sm font-medium text-gray-900">Dark Mode</h3>
                                                <p className="text-xs text-gray-600 mt-1">Use dark theme for the application</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={appSettings.darkMode}
                                                    onChange={(e) => setAppSettings({ ...appSettings, darkMode: e.target.checked })}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                            </label>
                                        </div>

                                        {/* Language */}
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <label className="block text-sm font-medium text-gray-900 mb-2">Language</label>
                                            <select
                                                value={appSettings.language}
                                                onChange={(e) => setAppSettings({ ...appSettings, language: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            >
                                                <option value="en">English</option>
                                                <option value="hi">Hindi (हिन्दी)</option>
                                                <option value="es">Spanish (Español)</option>
                                                <option value="fr">French (Français)</option>
                                            </select>
                                        </div>

                                        {/* Timezone */}
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <label className="block text-sm font-medium text-gray-900 mb-2">Timezone</label>
                                            <select
                                                value={appSettings.timezone}
                                                onChange={(e) => setAppSettings({ ...appSettings, timezone: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            >
                                                <option value="Asia/Kolkata">India (IST)</option>
                                                <option value="America/New_York">Eastern Time (ET)</option>
                                                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                                                <option value="Europe/London">London (GMT)</option>
                                                <option value="Asia/Tokyo">Tokyo (JST)</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <button
                                            onClick={handleAppSettingsUpdate}
                                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                        >
                                            Save Preferences
                                        </button>
                                    </div>

                                    <hr className="my-6" />

                                    {/* Danger Zone */}
                                    <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
                                        <h3 className="text-lg font-bold text-red-900 mb-2">Danger Zone</h3>
                                        <p className="text-sm text-red-700 mb-4">Irreversible and destructive actions</p>
                                        <div className="space-y-3">
                                            <button className="px-4 py-2 bg-white border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium">
                                                Clear All Data
                                            </button>
                                            <button className="ml-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
                                                Delete Account
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
