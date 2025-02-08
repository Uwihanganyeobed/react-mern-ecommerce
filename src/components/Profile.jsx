import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { useUser } from '../context/userContext';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { auth } from '../services/api';

const Profile = () => {
  const { user, resendVerification } = useAuth();
  const { updateProfile } = useUser();
  const [loading, setLoading] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Get user initials
  const getInitials = (name) => {
    if (!name) return '';
    const names = name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  useEffect(() => {
    if (user) {
      console.log('User object:', user);
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(formData);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }
    setLoading(true);
    try {
      await auth.changePassword(passwordData.currentPassword, passwordData.newPassword);
      toast.success('Password changed successfully!');
      setShowChangePassword(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      await resendVerification();
      toast.success('Verification email sent successfully!');
    } catch (error) {
      toast.error('Failed to resend verification email');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ClipLoader color="#4F46E5" size={50} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Profile Header with Avatar */}
          <div className="flex items-center justify-center mb-8">
            <div className="relative">
              <div className="relative w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-xl font-semibold text-indigo-600">
                {getInitials(user.name)}
                <UserCircleIcon className="absolute inset-0 w-full h-full text-indigo-600 opacity-20" />
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                disabled
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="flex justify-between items-center">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {loading ? <ClipLoader color="#ffffff" size={20} /> : 'Update Profile'}
              </button>
            </div>
          </form>

          <div className="mt-6 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900">Security Settings</h3>
            <div className="mt-4 space-y-4">
              {!showChangePassword ? (
                <button
                  onClick={() => setShowChangePassword(true)}
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  Change Password
                </button>
              ) : (
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      id="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      id="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      id="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      {loading ? <ClipLoader color="#ffffff" size={20} /> : 'Change Password'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowChangePassword(false)}
                      className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              <div>
                <p className="text-sm text-gray-500">
                  Email verification status: 
                  <span className={`ml-2 ${user?.isEmailVerified ? 'text-green-600' : 'text-red-600'}`}>
                    {user?.isEmailVerified ? 'Verified' : 'Not Verified'}
                  </span>
                </p>
                {!user?.isEmailVerified && (
                  <button
                    onClick={handleResendVerification}
                    className="mt-2 text-sm text-indigo-600 hover:text-indigo-500"
                  >
                    Resend Verification Email
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 