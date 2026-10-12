import React from 'react';
import { Link } from 'react-router-dom';
import CivicLogo from './CivicLogo';
import { useLanguage } from '../context/LanguageContext';
import { Phone, Mail, MapPin, Globe, Shield, ExternalLink } from 'lucide-react';

export default function Footer() {
  const { lang, setLang, t } = useLanguage();

  return (
    <footer className="bg-[#15171D] text-slate-400 text-sm border-t border-white/10 mt-16">
      {/* Top Banner Disclaimer */}
      <div className="bg-[#1e2129] py-3 border-b border-white/10 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2 text-[#B79A68]">
            <Shield className="w-4 h-4 flex-shrink-0" />
            <span className="font-semibold tracking-wide">
              {t('disclaimer')}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-slate-400 text-[11px]">
            <span>Official PCMC Portal:</span>
            <a
              href="https://www.pcmcindia.gov.in"
              target="_blank"
              rel="noreferrer"
              className="text-[#B79A68] hover:underline inline-flex items-center font-medium"
            >
              pcmcindia.gov.in <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Multi-Column Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Column 1: Identity & Description */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <CivicLogo size="md" />
              <div>
                <span className="text-white font-extrabold text-lg block">
                  PCMC Civic Connect
                </span>
                <span className="text-xs text-[#B79A68] font-medium block">
                  Hyperlocal Civic Issue Reporter
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed pr-6">
              A transparent, citizen-centric platform for reporting localized civic problems across Pimpri-Chinchwad, empowering residents and municipal staff with photo verification, geolocation, and auditable status resolution.
            </p>
            <div className="space-y-1 text-xs text-slate-400 pt-2">
              <div className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-[#B79A68]" />
                <span>Pimpri-Chinchwad Municipal Area, Pune, Maharashtra 411018</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-[#B79A68]" />
                <span>Helpline: 1800-233-1234 / 020-67333333 (Placeholder)</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3 text-xs">
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px] border-b border-white/10 pb-2">
              Civic Navigation
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-white transition">Home</Link>
              </li>
              <li>
                <Link to="/#services" className="hover:text-white transition">Civic Services</Link>
              </li>
              <li>
                <Link to="/report" className="hover:text-white transition text-[#B79A68] font-medium">Report an Issue</Link>
              </li>
              <li>
                <Link to="/track" className="hover:text-white transition">Track Complaint Status</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition">Public Dashboard</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition">About Project & Scope</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Top Civic Categories */}
          <div className="space-y-3 text-xs">
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px] border-b border-white/10 pb-2">
              Issue Categories
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/report?cat=ROAD" className="hover:text-white transition">Road Damage & Potholes</Link>
              </li>
              <li>
                <Link to="/report?cat=GARBAGE" className="hover:text-white transition">Garbage & Sanitation</Link>
              </li>
              <li>
                <Link to="/report?cat=DRAINAGE" className="hover:text-white transition">Drainage & Sewage</Link>
              </li>
              <li>
                <Link to="/report?cat=WATER_SUPPLY" className="hover:text-white transition">Water Supply & Leakage</Link>
              </li>
              <li>
                <Link to="/report?cat=STREETLIGHT" className="hover:text-white transition">Streetlight Failures</Link>
              </li>
              <li>
                <Link to="/report?cat=MOSQUITO" className="hover:text-white transition">Public Health Hazards</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Language & Help */}
          <div className="space-y-3 text-xs">
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px] border-b border-white/10 pb-2">
              Language & Access
            </h4>
            <p className="text-[11px] text-slate-400">
              Select your preferred language for navigating the portal:
            </p>
            <div className="flex flex-col space-y-1.5 pt-1">
              <button
                onClick={() => setLang('en')}
                className={`text-left px-2.5 py-1.5 rounded text-xs transition flex items-center justify-between ${
                  lang === 'en' ? 'bg-[#245D9C] text-white font-bold' : 'hover:bg-white/5 text-slate-300'
                }`}
              >
                <span>English</span>
                {lang === 'en' && <span>✓</span>}
              </button>
              <button
                onClick={() => setLang('mr')}
                className={`text-left px-2.5 py-1.5 rounded text-xs transition flex items-center justify-between ${
                  lang === 'mr' ? 'bg-[#245D9C] text-white font-bold' : 'hover:bg-white/5 text-slate-300'
                }`}
              >
                <span>मराठी (Marathi)</span>
                {lang === 'mr' && <span>✓</span>}
              </button>
              <button
                onClick={() => setLang('hi')}
                className={`text-left px-2.5 py-1.5 rounded text-xs transition flex items-center justify-between ${
                  lang === 'hi' ? 'bg-[#245D9C] text-white font-bold' : 'hover:bg-white/5 text-slate-300'
                }`}
              >
                <span>हिन्दी (Hindi)</span>
                {lang === 'hi' && <span>✓</span>}
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Legal / Copyright */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} PCMC Civic Connect • Designed for Pimpri-Chinchwad Municipal Region.
          </div>
          <div className="flex items-center space-x-6 text-[11px]">
            <Link to="/about" className="hover:text-slate-300 transition">Accessibility Statement</Link>
            <Link to="/about" className="hover:text-slate-300 transition">Privacy & Citizen Consent</Link>
            <Link to="/about" className="hover:text-slate-300 transition">Terms of Prototype</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
