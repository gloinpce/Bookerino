"use client";

import { SignIn, useStackApp, useUser } from "@stackframe/stack";
import Link from "next/link";

export default function SignInPage() {
  const app = useStackApp();
  const user = useUser();

  // If user is already signed in, redirect to dashboard
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Already signed in as {user.displayName || user.primaryEmail}
            </h2>
            <p className="mt-2 text-gray-600">
              You are already authenticated.
            </p>
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
            Sign in to Bookerino
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Access your hotel management dashboard
          </p>
          <div className="mt-4 text-center text-xs text-gray-500">
            <p>SDK Features: useStackApp, useUser hooks</p>
            <p>Components: SignIn, CurrentUser management</p>
          </div>
        </div>

        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <SignIn />
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              href="/auth/sign-up"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Create one here
            </Link>
          </p>
        </div>

        {/* SDK Information Panel */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">SDK Integration Active</h3>
          <div className="text-xs text-blue-700 space-y-1">
            <p>• StackClientApp configured with project ID</p>
            <p>• Server-side StackServerApp with Next.js cookies</p>
            <p>• CurrentUser hook for authentication state</p>
            <p>• ContactChannel support for email communication</p>
          </div>
        </div>
      </div>
    </div>
  );
}
