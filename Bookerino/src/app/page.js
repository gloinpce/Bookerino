"use client";

import { useUser, useStackApp, UserButton } from "@stackframe/stack";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const user = useUser();
  const app = useStackApp();
  const [userProfile, setUserProfile] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Load user profile data when user is available
  useEffect(() => {
    if (user) {
      setUserProfile({
        id: user.id,
        displayName: user.displayName,
        primaryEmail: user.primaryEmail,
        createdAt: user.createdAt,
        lastActiveAt: user.lastActiveAt,
        profileImageUrl: user.profileImageUrl,
        // SDK provides additional user data
        hasPassword: user.hasPassword,
        otpEnabled: user.otpEnabled,
        emailVerified: user.primaryEmailVerified,
      });
    }
  }, [user]);

  const updateDisplayName = async () => {
    if (!user) return;

    const newName = prompt("Enter your new display name:");
    if (!newName || newName.trim() === "") return;

    setIsUpdating(true);
    try {
      await user.update({ displayName: newName.trim() });
      setUserProfile(prev => prev ? { ...prev, displayName: newName.trim() } : null);
    } catch (error) {
      console.error("Failed to update display name:", error);
      alert("Failed to update display name. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (user) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header with User Button */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">Bookerino</h1>
              </div>
              <div className="flex items-center space-x-4">
                <UserButton />
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to Bookerino, {user.displayName || user.primaryEmail}!
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Your hotel management dashboard is ready
            </p>

            {/* User Profile Card */}
            <div className="bg-white shadow rounded-lg p-6 mb-8 max-w-2xl mx-auto">
              <h2 className="text-2xl font-semibold mb-4">Your Profile</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Display Name</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-lg">{userProfile?.displayName || 'Not set'}</span>
                    <button
                      onClick={updateDisplayName}
                      disabled={isUpdating}
                      className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
                    >
                      {isUpdating ? 'Updating...' : 'Edit'}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-lg">{userProfile?.primaryEmail}</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                    userProfile?.emailVerified
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {userProfile?.emailVerified ? 'Verified' : 'Unverified'}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Account Created</label>
                  <p className="text-lg">{userProfile ? new Date(userProfile.createdAt).toLocaleDateString() : 'Loading...'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Active</label>
                  <p className="text-lg">{userProfile?.lastActiveAt ? new Date(userProfile.lastActiveAt).toLocaleDateString() : 'Today'}</p>
                </div>
              </div>
            </div>

            {/* SDK Features Demo */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 max-w-4xl mx-auto">
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">SDK Features Active</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-blue-900 mb-2">CurrentUser</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• User ID: {user.id.slice(0, 8)}...</li>
                    <li>• Profile updates</li>
                    <li>• Authentication state</li>
                    <li>• Email verification</li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-blue-900 mb-2">ContactChannel</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Email communication</li>
                    <li>• OTP/Magic links</li>
                    <li>• Password reset</li>
                    <li>• Account verification</li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-blue-900 mb-2">StackClientApp</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• OAuth integration</li>
                    <li>• Multi-auth methods</li>
                    <li>• Token management</li>
                    <li>• Secure sessions</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-semibold mb-4">Hotel Management Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900">Room Management</h3>
                  <p className="text-blue-700">Manage your hotel rooms and availability</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-900">Bookings</h3>
                  <p className="text-green-700">View and manage guest reservations</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-900">Analytics</h3>
                  <p className="text-purple-700">Track booking performance and revenue</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Link
                href="/profile"
                className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors inline-block"
              >
                View Full Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Bookerino
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Professional hotel booking and management system.
            Streamline your operations and delight your guests.
          </p>

          <div className="space-x-4">
            <Link
              href="/auth/sign-in"
              className="bg-blue-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors inline-block"
            >
              Sign In
            </Link>
            <Link
              href="/auth/sign-up"
              className="bg-white text-blue-600 px-8 py-3 rounded-md text-lg font-medium border border-blue-600 hover:bg-blue-50 transition-colors inline-block"
            >
              Create Account
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Easy Management
              </h3>
              <p className="text-gray-600">
                Manage rooms, bookings, and guests all in one place
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Real-time Updates
              </h3>
              <p className="text-gray-600">
                Get instant notifications and updates on all activities
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Secure & Reliable
              </h3>
              <p className="text-gray-600">
                Enterprise-grade security with 99.9% uptime guarantee
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
