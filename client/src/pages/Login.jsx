import React from 'react';
import { SignIn } from '@clerk/react';
import { Link } from 'react-router-dom';

export default function Login() {
  return (
    <div className="max-w-md mx-auto px-4 py-12 flex flex-col items-center">
      <div className="w-full flex justify-center mb-6">
        <SignIn
          routing="path"
          path="/login"
          signUpUrl="/register"
          fallbackRedirectUrl="/"
        />
      </div>
      <p className="text-center text-xs text-slate-500 mt-2">
        Need assistance or returning to the map?{' '}
        <Link to="/" className="text-[#245D9C] font-semibold hover:underline">
          Go back to Home
        </Link>
      </p>
    </div>
  );
}
