import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import IssueCard from '../components/IssueCard';
import MapView from '../components/MapView';
import {
  AlertTriangle,
  Trash2,
  Droplets,
  Activity,
  Zap,
  Building,
  ShieldAlert,
  Bug,
  Compass,
  HelpCircle,
  PlusCircle,
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  Camera,
  FileCheck,
  ArrowRight,
  TrendingUp,
  Layers,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function Home() {
  const { user } = useAuth();
  const { lang, t } = useLanguage();
  const navigate = useNavigate();

  const [issues, setIssues] = useState([]);
  const [categories, setCategories] = useState([]);
  const [wards, setWards] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [trackSearchId, setTrackSearchId] = useState('');
  const [mapOrList, setMapOrList] = useState('both'); // 'both' | 'map' | 'list'

  // Service categories master list for section D
  const civicServicesList = [
    {
      code: 'ROAD',
      name: 'Road Damage & Potholes',
      nameMr: 'रस्त्यांचे खड्डे व नुकसान',
      desc: 'Potholes, cave-ins, open trenches, broken asphalt & missing manhole covers.',
      icon: AlertTriangle,
      dept: 'Road Department'
    },
    {
      code: 'GARBAGE',
      name: 'Garbage Collection & Waste',
      nameMr: 'कचरा गोळा करणे व स्वच्छता',
      desc: 'Overflowing dustbins, roadside dumping, uncollected community waste.',
      icon: Trash2,
      dept: 'Solid Waste Management'
    },
    {
      code: 'WATER_SUPPLY',
      name: 'Water Supply Problems',
      nameMr: 'पाणीपुरवठा व गळती',
      desc: 'Pipeline bursts, contaminated tap water, low pressure or dry lines.',
      icon: Activity,
      dept: 'Water Supply Dept'
    },
    {
      code: 'DRAINAGE',
      name: 'Drainage & Sewage Issues',
      nameMr: 'ड्रेनेज व सांडपाणी समस्या',
      desc: 'Blocked stormwater drains, overflowing sewage, road water-logging.',
      icon: Droplets,
      dept: 'Drainage & Sewerage'
    },
    {
      code: 'STREETLIGHT',
      name: 'Streetlight Failures',
      nameMr: 'पथदिवे व विजेच्या समस्या',
      desc: 'Dark road stretches, non-functional light poles, dangerous hanging wires.',
      icon: Zap,
      dept: 'Electrical Department'
    },
    {
      code: 'FOOTPATH',
      name: 'Footpaths & Pedestrian Access',
      nameMr: 'पादचारी मार्ग व पदपथ',
      desc: 'Broken footpath tiles, unauthorized barricades, missing slabs.',
      icon: Compass,
      dept: 'Civil Works Dept'
    },
    {
      code: 'ENCROACHMENT',
      name: 'Illegal Encroachments',
      nameMr: 'अनधिकृत अतिक्रमण',
      desc: 'Illegal hawkers on main roads, public footpath blockage, illegal sheds.',
      icon: ShieldAlert,
      dept: 'Anti-Encroachment Dept'
    },
    {
      code: 'MOSQUITO',
      name: 'Public Health & Hygiene',
      nameMr: 'आरोग्य व डास उत्पत्ती',
      desc: 'Stagnant water pools, mosquito breeding hazards, unhygienic public spots.',
      icon: Bug,
      dept: 'Health Department'
    },
    {
      code: 'PUBLIC_TOILET',
      name: 'Public Infrastructure & Toilets',
      nameMr: 'सार्वजनिक स्वच्छतागृहे',
      desc: 'Unhygienic community toilets, broken taps, lack of water or sanitation.',
      icon: Building,
      dept: 'Sanitation Dept'
    },
    {
      code: 'OTHER',
      name: 'Other Civic Grievances',
      nameMr: 'इतर नागरी तक्रारी',
      desc: 'Fallen trees, stray animals, park damage or general civic issues.',
      icon: HelpCircle,
      dept: 'Citizen Grievance Cell'
    }
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory) params.category = selectedCategory;
      if (selectedWard) params.ward = selectedWard;
      if (selectedStatus) params.status = selectedStatus;
      if (searchQuery) params.search = searchQuery;

      const [issuesRes, catRes, wardsRes, statsRes] = await Promise.all([
        api.get('/issues', { params }),
        api.get('/categories'),
        api.get('/wards'),
        api.get('/admin/stats').catch(() => ({ data: { success: false } }))
      ]);

      if (issuesRes.data.success) setIssues(issuesRes.data.data);
      if (catRes.data.success) setCategories(catRes.data.data);
      if (wardsRes.data.success) setWards(wardsRes.data.data);
      if (statsRes.data?.success) setStats(statsRes.data.data);
    } catch (err) {
      console.error('Error loading homepage data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedCategory, selectedWard, selectedStatus]);

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (!trackSearchId.trim()) return;
    navigate(`/track?id=${encodeURIComponent(trackSearchId.trim())}`);
  };

  return (
    <div id="main-content" className="space-y-16">
      
      {/* ========================================================= */}
      {/* C. LARGE HERO BANNER (Official Municipal Impact)         */}
      {/* ========================================================= */}
      <section className="relative w-full min-h-[540px] lg:min-h-[600px] flex items-center bg-[#15171D] overflow-hidden">
        {/* Background Urban Photograph with municipal tone */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1920&auto=format&fit=crop&q=80"
            alt="PCMC Civic Infrastructure"
            className="w-full h-full object-cover object-center filter brightness-90"
          />
          {/* Municipal Blue & Dark Translucent Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#15171D]/95 via-[#15171D]/80 to-[#245D9C]/50 backdrop-blur-[1px]"></div>
          {/* Subtle civic watermark / graphic lines */}
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-[#245D9C] via-[#B79A68] to-[#245D9C]"></div>
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-3xl space-y-6">
            
            {/* Tagline / Portal Badge */}
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#B79A68] text-xs font-bold tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-[#B79A68] animate-ping mr-1"></span>
              Pimpri-Chinchwad Municipal Corporation Region
            </div>

            {/* Bold Headline aligned to lower-left */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
              {t('heroHeadline')}
            </h1>

            {/* Supporting Description */}
            <p className="text-base sm:text-lg text-slate-200 font-normal leading-relaxed max-w-2xl">
              {t('heroSub')}
            </p>

            {/* Two Prominent Call-to-Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/report"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-[#245D9C] hover:bg-[#1a4778] transition shadow-lg shadow-[#245D9C]/30 border border-white/20"
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                {t('heroCTA1')}
              </Link>
              
              <Link
                to="/track"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-bold text-sm text-[#15171D] bg-white hover:bg-slate-100 transition shadow-lg border border-slate-200"
              >
                <Search className="w-5 h-5 mr-2 text-[#245D9C]" />
                {t('heroCTA2')}
              </Link>
            </div>

            {/* Fast Quick Track Input in Hero */}
            <div className="pt-4 max-w-md">
              <form onSubmit={handleTrackSubmit} className="flex items-center bg-white/10 backdrop-blur-md p-1 rounded-xl border border-white/20">
                <input
                  type="text"
                  placeholder="Enter Complaint ID (e.g. PCMC-2026-1042)..."
                  value={trackSearchId}
                  onChange={(e) => setTrackSearchId(e.target.value)}
                  className="bg-transparent text-white placeholder-slate-400 text-xs px-3 py-2 outline-none flex-1 font-mono"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#B79A68] hover:bg-[#967b4d] text-white text-xs font-bold rounded-lg transition"
                >
                  Track
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* D. CIVIC SERVICES SECTION (Grid of 10 Categories)       */}
      {/* ========================================================= */}
      <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <div className="inline-block px-3 py-1 rounded-full bg-[#245D9C]/10 text-[#245D9C] font-bold text-xs uppercase tracking-wider">
            Municipal Department Services
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#15171D] tracking-tight">
            {t('servicesTitle')}
          </h2>
          <p className="text-sm text-[#64748B]">
            {t('servicesDesc')}
          </p>
        </div>

        {/* 10 Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {civicServicesList.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={service.code}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between group hover:border-[#245D9C]/50"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#e9f1fa] text-[#245D9C] flex items-center justify-center mb-4 group-hover:bg-[#245D9C] group-hover:text-white transition">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-sm text-[#15171D] mb-1 group-hover:text-[#245D9C] transition">
                    {lang === 'mr' ? service.nameMr : service.name}
                  </h3>
                  <div className="text-[11px] font-semibold text-[#B79A68] mb-2 uppercase tracking-wide">
                    {service.dept}
                  </div>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    {service.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100">
                  <Link
                    to={`/report?cat=${service.code}`}
                    className="inline-flex items-center text-xs font-bold text-[#245D9C] group-hover:text-[#1a4778] transition"
                  >
                    <span>Report this Issue</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================= */}
      {/* E. HOW IT WORKS (4-Step Horizontal Stepper)              */}
      {/* ========================================================= */}
      <section className="bg-white py-14 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#B79A68]">
              Standard Operating Procedure
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#15171D]">
              {t('howItWorksTitle')}
            </h2>
            <p className="text-sm text-[#64748B]">
              {t('howItWorksSub')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Step 1 */}
            <div className="space-y-3 relative">
              <div className="w-12 h-12 rounded-xl bg-[#245D9C] text-white flex items-center justify-center font-extrabold text-lg shadow-md">
                <Camera className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#245D9C]">Step 1</div>
              <h3 className="text-base font-bold text-[#15171D]">{t('step1Title')}</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                {t('step1Desc')}
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-3 relative">
              <div className="w-12 h-12 rounded-xl bg-[#245D9C] text-white flex items-center justify-center font-extrabold text-lg shadow-md">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#245D9C]">Step 2</div>
              <h3 className="text-base font-bold text-[#15171D]">{t('step2Title')}</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                {t('step2Desc')}
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-3 relative">
              <div className="w-12 h-12 rounded-xl bg-[#B79A68] text-white flex items-center justify-center font-extrabold text-lg shadow-md">
                <FileCheck className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#B79A68]">Step 3</div>
              <h3 className="text-base font-bold text-[#15171D]">{t('step3Title')}</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                {t('step3Desc')}
              </p>
            </div>

            {/* Step 4 */}
            <div className="space-y-3 relative">
              <div className="w-12 h-12 rounded-xl bg-[#218653] text-white flex items-center justify-center font-extrabold text-lg shadow-md">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#218653]">Step 4</div>
              <h3 className="text-base font-bold text-[#15171D]">{t('step4Title')}</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                {t('step4Desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* F. CIVIC COMPLAINT STATISTICS (Live Dashboard Cards)     */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-[#15171D]">
              {t('statsTitle')}
            </h2>
            <p className="text-xs text-[#64748B] mt-1">
              {t('statsSub')}
            </p>
          </div>
          <Link
            to="/dashboard"
            className="text-xs font-bold text-[#245D9C] hover:underline inline-flex items-center"
          >
            Detailed Ward Analytics &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Total Reported
            </div>
            <div className="text-3xl font-extrabold text-[#15171D] mt-2">
              {stats?.totalIssues ?? issues.length}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">All PCMC Localities</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm bg-amber-50/20">
            <div className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
              Under Review
            </div>
            <div className="text-3xl font-extrabold text-amber-900 mt-2">
              {stats?.statusCounts?.pending ?? issues.filter((i) => i.status === 'pending').length}
            </div>
            <div className="text-[10px] text-amber-600 mt-1">Pending Officer Check</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-indigo-200 shadow-sm bg-indigo-50/20">
            <div className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">
              In Progress
            </div>
            <div className="text-3xl font-extrabold text-indigo-900 mt-2">
              {(stats?.statusCounts?.assigned || 0) + (stats?.statusCounts?.in_progress || 0)}
            </div>
            <div className="text-[10px] text-indigo-600 mt-1">Department Field Squads</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm bg-emerald-50/20">
            <div className="text-[11px] font-bold text-[#218653] uppercase tracking-wider">
              Resolved & Closed
            </div>
            <div className="text-3xl font-extrabold text-emerald-900 mt-2">
              {(stats?.statusCounts?.resolved || 0) + (stats?.statusCounts?.closed || 0)}
            </div>
            <div className="text-[10px] text-emerald-600 mt-1">Verified with Proof</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm col-span-2 md:col-span-1">
            <div className="text-[11px] font-bold text-[#B79A68] uppercase tracking-wider">
              Avg Turnaround
            </div>
            <div className="text-3xl font-extrabold text-[#15171D] mt-2">
              {stats?.avgResolutionHours || 24} <span className="text-xs font-semibold text-slate-500">hrs</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">SLA Benchmark</div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* G. INTERACTIVE CIVIC ISSUE MAP                            */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-[#15171D] flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-[#245D9C]" />
                {t('mapTitle')}
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                {t('mapSub')}
              </p>
            </div>

            {/* Filter Dropdowns on Map */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 outline-none"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedWard}
                onChange={(e) => setSelectedWard(e.target.value)}
                className="border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 outline-none"
              >
                <option value="">All PCMC Wards</option>
                {wards.map((w) => (
                  <option key={w._id} value={w._id}>
                    Ward {w.number} ({w.name})
                  </option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 outline-none"
              >
                <option value="">All Statuses</option>
                <option value="pending">Under Review</option>
                <option value="verified">Verified</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          <MapView issues={issues} height="440px" />
        </div>
      </section>

      {/* ========================================================= */}
      {/* H. RECENT CIVIC ISSUES TRANSPARENCY FEED                  */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-[#15171D]">
              {t('recentTitle')}
            </h2>
            <p className="text-xs text-[#64748B] mt-1">
              {t('recentSub')}
            </p>
          </div>
          <Link
            to="/report"
            className="inline-flex items-center px-4 py-2 bg-[#245D9C] hover:bg-[#1a4778] text-white text-xs font-bold rounded-xl transition"
          >
            <PlusCircle className="w-4 h-4 mr-1.5" /> Report New Problem
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-500">
            Loading recent issues...
          </div>
        ) : issues.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
            <p className="font-semibold text-slate-700">No issues matching selected filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {issues.slice(0, 6).map((issue) => (
              <IssueCard key={issue._id} issue={issue} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
