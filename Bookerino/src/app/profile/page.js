"use client";

import { useUser, useStackApp, AccountSettings, UserButton } from "@stackframe/stack";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function ProfilePage() {
  const user = useUser();
  const app = useStackApp();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      // Load user's teams (if available)
      // This would use Team and TeamUser types from SDK
      setLoading(false);
    }
  }, [user]);

  const handlePasswordReset = async () => {
    if (!user?.primaryEmail) return;

    try {
      setUpdatingPassword(true);
      const result = await app.sendForgotPasswordEmail(user.primaryEmail);
      if (result.status === "success") {
        alert("Password reset email sent! Check your inbox.");
      } else {
        alert("Failed to send password reset email.");
      }
    } catch (error) {
      console.error("Password reset error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleSendMagicLink = async () => {
    if (!user?.primaryEmail) return;

    try {
      const result = await app.sendMagicLinkEmail(user.primaryEmail);
      if (result.status === "success") {
        alert(`Magic link sent to ${user.primaryEmail}! Check your email.`);
      } else {
        alert("Failed to send magic link.");
      }
    } catch (error) {
      console.error("Magic link error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">You must be signed in to view your profile.</p>
          <Link
            href="/auth/sign-in"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
            <p className="text-gray-600">Manage your account settings and preferences</p>
          </div>

          <div className="px-6 py-6 space-y-8">
            {/* Header with User Button */}
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
                <p className="text-gray-600">Manage your account preferences and settings</p>
              </div>
              <UserButton />
            </div>

            {/* Account Settings Component */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Management</h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <AccountSettings />
              </div>
            </div>

            {/* User Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Information</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">User ID</dt>
                    <dd className="text-sm text-gray-900 font-mono">{user.id}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Display Name</dt>
                    <dd className="text-sm text-gray-900">{user.displayName || 'Not set'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="text-sm text-gray-900">
                      {user.primaryEmail}
                      {user.primaryEmailVerified && (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Verified
                        </span>
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Account Created</dt>
                    <dd className="text-sm text-gray-900">{new Date(user.createdAt).toLocaleDateString()}</dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* SDK Features */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">SDK Capabilities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900 mb-2">Authentication Methods</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-700">Password Authentication</span>
                      <span className={`px-2 py-1 rounded text-xs ${user.hasPassword ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {user.hasPassword ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-700">OTP Authentication</span>
                      <span className={`px-2 py-1 rounded text-xs ${user.otpEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {user.otpEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="font-medium text-green-900 mb-2">Account Actions</h3>
                  <div className="space-y-2">
                    <button
                      onClick={handlePasswordReset}
                      disabled={updatingPassword}
                      className="w-full text-left px-3 py-2 text-sm text-green-700 hover:bg-green-100 rounded disabled:opacity-50"
                    >
                      {updatingPassword ? 'Sending...' : 'Send Password Reset Email'}
                    </button>
                    <button
                      onClick={handleSendMagicLink}
                      className="w-full text-left px-3 py-2 text-sm text-green-700 hover:bg-green-100 rounded"
                    >
                      Send Magic Link
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Teams Section (Future Feature) */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Teams & Permissions</h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Coming Soon</h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>Team management and role-based permissions will be available in future updates. SDK supports:</p>
                      <ul className="mt-2 list-disc list-inside space-y-1">
                        <li>Team creation and membership</li>
                        <li>Role-based access control (RBAC)</li>
                        <li>Team permissions and profiles</li>
                        <li>Multi-user collaboration</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SDK Reference */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">SDK Reference</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">User Types</h4>
                    <ul className="text-gray-600 space-y-1">
                      <li>• CurrentUser</li>
                      <li>• ServerUser</li>
                      <li>• CurrentServerUser</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Communication</h4>
                    <ul className="text-gray-600 space-y-1">
                      <li>• ContactChannel</li>
                      <li>• ServerContactChannel</li>
                      <li>• SendEmailOptions</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Hooks</h4>
                    <ul className="text-gray-600 space-y-1">
                      <li>• useUser</li>
                      <li>• useStackApp</li>
                      <li>• useStackAuth</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back to Dashboard
            </Link>
            <button
              onClick={() => user.signOut()}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
