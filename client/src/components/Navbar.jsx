import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useAccessibility } from '../context/AccessibilityContext';
import CivicLogo from './CivicLogo';
import {
  Phone,
  Volume2,
  Globe,
  PlusCircle,
  Search,
  BarChart2,
  Info,
  ShieldCheck,
  Menu,
  X,
  LogOut,
  User,
  LogIn,
  AlertCircle
} from 'lucide-react';

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const { lang, setLang, t } = useLanguage();
  const { fontSize, setFontSize } = useAccessibility();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 shadow-sm border-b border-slate-200">
      {/* ========================================================= */}
      {/* TOP UTILITY HEADER (Dark Charcoal / Municipal Standard)  */}
      {/* ========================================================= */}
      <div className="bg-[#15171D] text-slate-300 text-[11px] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between min-h-[36px] py-1 gap-2">
            
            {/* Left: Helpline & Urgent Notice */}
            <div className="flex items-center space-x-4">
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:p-2 focus:bg-[#245D9C] focus:text-white z-50 rounded"
              >
                {t('skipToContent')}
              </a>
              <div className="flex items-center space-x-1.5 text-white/90 font-medium">
                <Phone className="w-3 h-3 text-[#B79A68]" />
                <span>{t('helpline')}</span>
              </div>
              <span className="hidden md:inline-block text-white/20">|</span>
              <div className="hidden lg:flex items-center space-x-1.5 text-[#B79A68] font-medium truncate max-w-md">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#D99A24] animate-pulse"></span>
                <span className="truncate">{t('notice')}</span>
              </div>
            </div>

            {/* Right: Accessibility & Language Controls */}
            <div className="flex items-center space-x-3 ml-auto">
              {/* Font Resizing Controls A- A A+ */}
              <div className="flex items-center space-x-1 bg-white/5 px-2 py-0.5 rounded border border-white/10 text-xs">
                <span className="text-slate-400 mr-1 text-[10px]">Font:</span>
                <button
                  onClick={() => setFontSize('small')}
                  title="Smaller text"
                  className={`px-1 rounded hover:text-white transition ${
                    fontSize === 'small' ? 'bg-[#245D9C] text-white font-bold' : 'text-slate-300'
                  }`}
                >
                  A-
                </button>
                <button
                  onClick={() => setFontSize('normal')}
                  title="Default text"
                  className={`px-1 rounded hover:text-white transition ${
                    fontSize === 'normal' ? 'bg-[#245D9C] text-white font-bold' : 'text-slate-300'
                  }`}
                >
                  A
                </button>
                <button
                  onClick={() => setFontSize('large')}
                  title="Larger text"
                  className={`px-1 rounded hover:text-white transition ${
                    fontSize === 'large' ? 'bg-[#245D9C] text-white font-bold' : 'text-slate-300'
                  }`}
                >
                  A+
                </button>
              </div>

              {/* Language Switcher */}
              <div className="flex items-center space-x-1 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                <Globe className="w-3 h-3 text-[#B79A68] mr-1" />
                <button
                  onClick={() => setLang('en')}
                  className={`px-1.5 py-0.5 rounded transition ${
                    lang === 'en' ? 'bg-[#245D9C] text-white font-semibold' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setLang('mr')}
                  className={`px-1.5 py-0.5 rounded transition ${
                    lang === 'mr' ? 'bg-[#245D9C] text-white font-semibold' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  मराठी
                </button>
                <button
                  onClick={() => setLang('hi')}
                  className={`px-1.5 py-0.5 rounded transition ${
                    lang === 'hi' ? 'bg-[#245D9C] text-white font-semibold' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  हिन्दी
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MAIN NAVIGATION HEADER (Official Municipal Portal Look)  */}
      {/* ========================================================= */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Branding & Municipal Identity */}
            <Link to="/" className="flex items-center space-x-3.5 group">
              <CivicLogo size="md" />
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-xl sm:text-2xl text-[#15171D] tracking-tight group-hover:text-[#245D9C] transition">
                    {t('title')}
                  </span>
                  <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-[#B79A68]/15 text-[#967b4d] border border-[#B79A68]/30">
                    Prototype
                  </span>
                </div>
                <p className="text-xs text-[#64748B] font-medium leading-tight">
                  {t('subtitle')} • Pimpri-Chinchwad Municipal Area
                </p>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1">
              <Link
                to="/"
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                  isActive('/')
                    ? 'text-[#245D9C] bg-[#e9f1fa]'
                    : 'text-[#202936] hover:text-[#245D9C] hover:bg-slate-50'
                }`}
              >
                {t('navHome')}
              </Link>

              <Link
                to="/#services"
                className="px-3 py-2 rounded-lg text-sm font-semibold text-[#202936] hover:text-[#245D9C] hover:bg-slate-50 transition"
              >
                {t('navServices')}
              </Link>

              <Link
                to="/report"
                className={`inline-flex items-center px-3.5 py-2 rounded-lg text-sm font-bold transition shadow-sm ${
                  isActive('/report')
                    ? 'bg-[#245D9C] text-white'
                    : 'bg-[#245D9C] text-white hover:bg-[#1a4778]'
                }`}
              >
                <PlusCircle className="w-4 h-4 mr-1.5" />
                {t('navReport')}
              </Link>

              <Link
                to="/track"
                className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-semibold transition ${
                  isActive('/track')
                    ? 'text-[#245D9C] bg-[#e9f1fa]'
                    : 'text-[#202936] hover:text-[#245D9C] hover:bg-slate-50'
                }`}
              >
                <Search className="w-4 h-4 mr-1.5 text-[#B79A68]" />
                {t('navTrack')}
              </Link>

              <Link
                to="/dashboard"
                className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-semibold transition ${
                  isActive('/dashboard')
                    ? 'text-[#245D9C] bg-[#e9f1fa]'
                    : 'text-[#202936] hover:text-[#245D9C] hover:bg-slate-50'
                }`}
              >
                <BarChart2 className="w-4 h-4 mr-1.5 text-slate-400" />
                {t('navDashboard')}
              </Link>

              <Link
                to="/about"
                className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-semibold transition ${
                  isActive('/about')
                    ? 'text-[#245D9C] bg-[#e9f1fa]'
                    : 'text-[#202936] hover:text-[#245D9C] hover:bg-slate-50'
                }`}
              >
                {t('navAbout')}
              </Link>

              {/* Admin Officers Link */}
              {isAdmin && (
                <div className="flex items-center space-x-1 pl-2 border-l border-slate-200 ml-1">
                  <Link
                    to="/admin/queue"
                    className="inline-flex items-center px-3 py-2 rounded-lg text-xs font-bold bg-[#D99A24]/15 text-[#967b4d] border border-[#D99A24]/30 hover:bg-[#D99A24]/25"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 mr-1 text-[#D99A24]" />
                    {t('navAdminQueue')}
                  </Link>
                </div>
              )}
            </nav>

            {/* Auth / Account Profile / Login */}
            <div className="hidden lg:flex items-center space-x-3">
              {user ? (
                <div className="flex items-center space-x-3 pl-3 border-l border-slate-200">
                  <div className="text-right">
                    <div className="text-xs font-bold text-[#15171D] leading-tight">{user.name}</div>
                    <span className="text-[10px] font-semibold text-[#245D9C] uppercase tracking-wider block">
                      {user.role === 'admin' ? 'PCMC Officer' : 'Citizen'}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    title="Log out"
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="inline-flex items-center px-3.5 py-2 text-xs font-bold text-[#202936] hover:text-[#245D9C] hover:bg-slate-100 rounded-lg transition"
                  >
                    <LogIn className="w-3.5 h-3.5 mr-1.5" />
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center px-3.5 py-2 text-xs font-bold text-[#245D9C] bg-[#e9f1fa] hover:bg-blue-100 rounded-lg transition"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu hamburger button */}
            <div className="flex lg:hidden items-center space-x-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-700 hover:text-[#245D9C] hover:bg-slate-100 rounded-lg transition"
                aria-label="Toggle navigation"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              {t('navHome')}
            </Link>
            <Link
              to="/#services"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              {t('navServices')}
            </Link>
            <Link
              to="/report"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-bold bg-[#245D9C] text-white"
            >
              {t('navReport')}
            </Link>
            <Link
              to="/track"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              {t('navTrack')}
            </Link>
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              {t('navDashboard')}
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              {t('navAbout')}
            </Link>

            {isAdmin && (
              <div className="pt-2 border-t border-slate-100 space-y-1">
                <Link
                  to="/admin/queue"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-bold bg-amber-50 text-amber-800"
                >
                  {t('navAdminQueue')}
                </Link>
                <Link
                  to="/admin/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-800"
                >
                  {t('navAdminDash')}
                </Link>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100">
              {user ? (
                <div className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-lg">
                  <div>
                    <div className="text-sm font-bold text-slate-800">{user.name}</div>
                    <div className="text-xs text-slate-500 capitalize">{user.role}</div>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-xs text-rose-600 font-bold"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2 text-sm font-bold text-white bg-[#245D9C] rounded-lg"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
