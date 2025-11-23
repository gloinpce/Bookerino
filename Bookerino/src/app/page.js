"use client";

import { useUser } from "@stackframe/stack";
import Link from "next/link";

export default function Home() {
  const user = useUser();

  if (user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to Bookerino, {user.displayName || user.primaryEmail}!
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Your hotel management dashboard is ready
            </p>

            <div className="bg-white shadow rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900">Room Management</h3>
                  <p className="text-blue-700">Manage your hotel rooms</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-900">Bookings</h3>
                  <p className="text-green-700">View and manage reservations</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-900">Analytics</h3>
                  <p className="text-purple-700">View booking analytics</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => user.signOut()}
              className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Sign Out
            </button>
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
