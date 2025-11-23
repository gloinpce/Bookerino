"use client";

import { SignUp, useStackApp, useUser } from "@stackframe/stack";
import Link from "next/link";

export default function SignUpPage() {
  const app = useStackApp();
  const user = useUser();

  // If user is already signed in, show account info
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Welcome, {user.displayName || user.primaryEmail}!
            </h2>
            <p className="mt-2 text-gray-600">
              Your account has been created successfully.
            </p>

            <div className="mt-6 bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Account Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Email:</span>
                  <span className="font-medium">{user.primaryEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Display Name:</span>
                  <span className="font-medium">{user.displayName || 'Not set'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">User ID:</span>
                  <span className="font-mono text-xs">{user.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Signed Up:</span>
                  <span className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <Link
                href="/"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Go to Dashboard
              </Link>
              <button
                onClick={() => user.signOut()}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your Bookerino account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Start managing your hotel bookings today
          </p>
          <div className="mt-4 text-center text-xs text-gray-500">
            <p>SDK Features: ServerUser, CurrentUser, ContactChannel</p>
            <p>User registration with automatic profile creation</p>
          </div>
        </div>

        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <SignUp />
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/auth/sign-in"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign in here
            </Link>
          </p>
        </div>

        {/* SDK Information Panel */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-green-900 mb-2">Account Creation Features</h3>
          <div className="text-xs text-green-700 space-y-1">
            <p>• Automatic user profile creation</p>
            <p>• ServerUser data stored securely</p>
            <p>• ContactChannel setup for email communication</p>
            <p>• Team membership capabilities (ready for expansion)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
