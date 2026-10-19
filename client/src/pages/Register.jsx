import React from 'react';
import { SignUp } from '@clerk/react';
import { Link } from 'react-router-dom';

export default function Register() {
  return (
    <div className="max-w-md mx-auto px-4 py-12 flex flex-col items-center">
      <div className="w-full flex justify-center mb-6">
        <SignUp
          routing="path"
          path="/register"
          signInUrl="/login"
          fallbackRedirectUrl="/"
        />
      </div>
      <p className="text-center text-xs text-slate-500 mt-2">
        Already have an account?{' '}
        <Link to="/login" className="text-[#245D9C] font-semibold hover:underline">
          Sign In here
        </Link>
      </p>
    </div>
  );
}
