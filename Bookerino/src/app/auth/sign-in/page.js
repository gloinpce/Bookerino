"use client";

import { CredentialSignIn, OAuthButton, OAuthButtonGroup, useStackApp, useUser } from "@stackframe/stack";
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
            <p>Components: CredentialSignIn, OAuthButton, OAuthButtonGroup</p>
            <p>Hooks: useStackApp, useUser</p>
          </div>
        </div>

        {/* Email/Password Sign In */}
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Sign in with Email</h3>
            <CredentialSignIn />
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* OAuth Sign In */}
          <div className="mt-6">
            <OAuthButtonGroup />
          </div>
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

        {/* Components Information Panel */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Stack Auth Components</h3>
          <div className="text-xs text-blue-700 space-y-1">
            <p>• CredentialSignIn: Email/password authentication</p>
            <p>• OAuthButtonGroup: Multiple OAuth providers</p>
            <p>• useUser: Real-time user state management</p>
            <p>• useStackApp: App-level authentication methods</p>
          </div>
        </div>
      </div>
    </div>
  );
}
