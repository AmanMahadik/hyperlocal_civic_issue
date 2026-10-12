import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  MapPin,
  PlusCircle,
  FileText,
  ShieldCheck,
  BarChart3,
  LogOut,
  User,
  LogIn
} from 'lucide-react';

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-pcmc-600 flex items-center justify-center text-white shadow">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <span className="font-bold text-lg text-slate-900 tracking-tight block">
                PCMC Civic Reporter
              </span>
              <span className="text-xs text-slate-500 font-medium block -mt-1">
                Pimpri-Chinchwad Municipal Corp
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:text-pcmc-600 hover:bg-slate-50"
            >
              Public Map & Feed
            </Link>

            <Link
              to="/report"
              className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium text-pcmc-700 bg-pcmc-50 hover:bg-pcmc-100 border border-pcmc-200"
            >
              <PlusCircle className="w-4 h-4 mr-1.5" />
              Report Issue
            </Link>

            {user && (
              <Link
                to="/my-reports"
                className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:text-pcmc-600 hover:bg-slate-50"
              >
                <FileText className="w-4 h-4 mr-1.5 text-slate-500" />
                My Reports
              </Link>
            )}

            {/* Admin Nav Items */}
            {isAdmin && (
              <div className="flex items-center space-x-1 pl-2 border-l border-slate-200 ml-2">
                <Link
                  to="/admin/queue"
                  className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200"
                >
                  <ShieldCheck className="w-4 h-4 mr-1.5" />
                  Verification Queue
                </Link>
                <Link
                  to="/admin/dashboard"
                  className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:text-pcmc-600 hover:bg-slate-50"
                >
                  <BarChart3 className="w-4 h-4 mr-1.5 text-slate-500" />
                  Admin Analytics
                </Link>
              </div>
            )}
          </nav>

          {/* Auth section */}
          <div className="flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-medium text-slate-800">{user.name}</div>
                  <div className="text-xs text-slate-500 capitalize flex items-center justify-end">
                    {user.role === 'admin' ? (
                      <span className="text-amber-600 font-semibold flex items-center">
                        <ShieldCheck className="w-3 h-3 mr-0.5 inline" /> PCMC Officer
                      </span>
                    ) : (
                      'Citizen'
                    )}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  title="Log out"
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="inline-flex items-center px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-pcmc-600 hover:bg-slate-100 rounded-lg transition"
                >
                  <LogIn className="w-4 h-4 mr-1.5" />
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-3.5 py-2 text-sm font-medium text-white bg-pcmc-600 hover:bg-pcmc-700 rounded-lg shadow-sm transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
