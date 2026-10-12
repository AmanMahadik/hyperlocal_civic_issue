import React from 'react';
import { Link } from 'react-router-dom';
import CivicLogo from '../components/CivicLogo';
import {
  Shield,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Clock,
  Layers,
  ArrowRight,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Hero / Overview */}
      <div className="text-center space-y-3">
        <CivicLogo size="lg" />
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#15171D] pt-2">
          About PCMC Civic Connect
        </h1>
        <p className="text-sm text-[#64748B] max-w-2xl mx-auto leading-relaxed">
          A modern, open-governance project prototype delivering hyperlocal civic problem reporting, photo-verified triage, and transparent resolution tracking across Pimpri-Chinchwad.
        </p>
      </div>

      {/* Mandatory Prototype Status Disclaimer */}
      <div className="p-5 rounded-2xl bg-[#B79A68]/15 border-2 border-[#B79A68]/40 text-[#15171D] space-y-2">
        <div className="flex items-center space-x-2 font-bold text-sm text-[#967b4d]">
          <Shield className="w-5 h-5 flex-shrink-0" />
          <span>Project Prototype & Academic Notice</span>
        </div>
        <p className="text-xs text-[#202936] leading-relaxed">
          <strong>Important:</strong> This web application is an educational engineering prototype developed to demonstrate hyperlocal civic problem tracking and verification workflow architecture. It is <strong>not</strong> an official government portal of the Pimpri-Chinchwad Municipal Corporation (PCMC). For official government filings and municipal services, please visit the verified official portal at{' '}
          <a
            href="https://www.pcmcindia.gov.in"
            target="_blank"
            rel="noreferrer"
            className="text-[#245D9C] font-semibold underline inline-flex items-center"
          >
            pcmcindia.gov.in <ExternalLink className="w-3 h-3 ml-1" />
          </a>.
        </p>
      </div>

      {/* Problem Statement & Hyperlocal Need */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6">
        <h2 className="text-xl font-bold text-[#15171D]">
          The Civic Challenge in Urban Municipalities
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[#64748B] leading-relaxed">
          <div className="space-y-2">
            <h3 className="font-bold text-slate-800 text-sm">Citizen Blindspots</h3>
            <p>
              In rapidly expanding twin-city areas like Pimpri-Chinchwad, everyday civic problems—such as overflowing stormwater drains during monsoons, deep road potholes, or non-functional streetlights—are often reported over fragmented helplines without a clear way for citizens to track whether municipal teams have taken action.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-slate-800 text-sm">Administrative Triage</h3>
            <p>
              Municipal corporation offices receive hundreds of calls, but lack precise geolocation data, visual before-and-after proof, or automatic duplicate detection. Work orders can be delayed when complaints lack photographic context.
            </p>
          </div>
        </div>
      </div>

      {/* Core Architectural Pillars */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-[#15171D]">
          How PCMC Civic Connect Solves This
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#e9f1fa] text-[#245D9C] flex items-center justify-center font-bold">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#15171D]">Hyperlocal Geo-Tagging</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Every complaint is pinned with exact GPS coordinates. The backend performs point-in-polygon verification against PCMC ward boundaries.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#B79A68]/15 text-[#967b4d] flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#15171D]">Smart Duplicate Warning</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              When an issue of the same category is already active within 50 to 100 meters, citizens are alerted to upvote the existing report rather than duplicating municipal paperwork.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#218653] flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#15171D]">Photo Proof Resolution</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Resolving an issue requires PCMC field officers to upload an after-repair photo. Citizens can inspect the fix and confirm or reopen if incomplete.
            </p>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-[#15171D] flex items-center">
          <HelpCircle className="w-5 h-5 mr-2 text-[#245D9C]" />
          Frequently Asked Questions
        </h2>

        <div className="space-y-4 text-xs divide-y divide-slate-100">
          <div className="pt-3">
            <h4 className="font-bold text-slate-800 text-sm mb-1">
              What wards are currently covered in the system?
            </h4>
            <p className="text-[#64748B]">
              The prototype covers all 8 administrative divisions of PCMC: Nigdi-Pradhikaran, Akurdi-Ravet, Chinchwad Station-Thergaon, Pimpri-Morwadi, Bhosari-Indrayani Nagar, Sangvi-Pimple Saudagar, Wakad-Hinjawadi, and Moshi-Dighi.
            </p>
          </div>

          <div className="pt-3">
            <h4 className="font-bold text-slate-800 text-sm mb-1">
              Is an account required to report a civic issue?
            </h4>
            <p className="text-[#64748B]">
              Yes. Citizen authentication prevents spam and allows you to track all your submitted complaints under "My Reports", upvote neighborhood issues, and confirm or reopen resolved works.
            </p>
          </div>

          <div className="pt-3">
            <h4 className="font-bold text-slate-800 text-sm mb-1">
              How does the SLA resolution deadline work?
            </h4>
            <p className="text-[#64748B]">
              Each category has a target Service Level Agreement (SLA)—for example, 2 days for overflowing drainage or water leakage, and 3–4 days for road pothole repair. Overdue complaints are automatically flagged on the administrative dashboard.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
