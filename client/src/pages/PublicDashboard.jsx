import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import MapView from '../components/MapView';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  BarChart2,
  PieChart as PieIcon,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Layers,
  RefreshCw
} from 'lucide-react';

export default function PublicDashboard() {
  const [stats, setStats] = useState(null);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [statsRes, issuesRes] = await Promise.all([
          api.get('/admin/stats').catch(() => ({ data: { success: false } })),
          api.get('/issues?limit=50')
        ]);

        if (statsRes.data?.success) setStats(statsRes.data.data);
        if (issuesRes.data?.success) setIssues(issuesRes.data.data);
      } catch (err) {
        console.error('Failed to load dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-500 flex flex-col items-center justify-center space-y-2">
        <RefreshCw className="w-6 h-6 animate-spin text-[#245D9C]" />
        <p className="text-sm">Aggregating PCMC civic telemetry...</p>
      </div>
    );
  }

  const { totalIssues = 0, statusCounts = {}, categoryCounts = [], wardCounts = [], slaBreaches = 0, avgResolutionHours = 24 } =
    stats || {};

  // Colors for charts
  const STATUS_COLORS = {
    pending: '#D99A24',
    verified: '#245D9C',
    in_progress: '#4f46e5',
    resolved: '#218653',
    closed: '#64748B',
    rejected: '#C83D43'
  };

  const statusChartData = Object.entries(statusCounts)
    .filter(([_, count]) => count > 0)
    .map(([status, count]) => ({
      name: status.replace('_', ' ').toUpperCase(),
      count,
      color: STATUS_COLORS[status] || '#245D9C'
    }));

  const categoryChartData = categoryCounts.slice(0, 6).map((c) => ({
    name: c.name.length > 18 ? c.name.substring(0, 16) + '...' : c.name,
    count: c.count
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Page Header */}
      <div className="space-y-1">
        <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#245D9C]/10 text-[#245D9C] font-bold text-xs uppercase tracking-wider">
          Open Governance & Accountability
        </div>
        <h1 className="text-3xl font-extrabold text-[#15171D] tracking-tight">
          PCMC Public Civic Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-[#64748B]">
          Transparent, ward-level analytics on complaint resolution, departmental response times, and citizen engagement.
        </p>
      </div>

      {/* Primary Telemetry Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-[11px] font-bold text-slate-500 uppercase">Total Grievances</div>
          <div className="text-3xl font-extrabold text-[#15171D] mt-1.5">{totalIssues}</div>
          <div className="text-[10px] text-slate-400 mt-1">Logged across PCMC</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm bg-amber-50/20">
          <div className="text-[11px] font-bold text-amber-700 uppercase">Under Review</div>
          <div className="text-3xl font-extrabold text-amber-900 mt-1.5">{statusCounts.pending || 0}</div>
          <div className="text-[10px] text-amber-600 mt-1">Pending officer triage</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm bg-emerald-50/20">
          <div className="text-[11px] font-bold text-[#218653] uppercase">Resolved / Closed</div>
          <div className="text-3xl font-extrabold text-emerald-900 mt-1.5">
            {(statusCounts.resolved || 0) + (statusCounts.closed || 0)}
          </div>
          <div className="text-[10px] text-emerald-600 mt-1">Verified with after-photo</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-[11px] font-bold text-[#B79A68] uppercase">Avg Resolution Time</div>
          <div className="text-3xl font-extrabold text-[#15171D] mt-1.5">
            {avgResolutionHours} <span className="text-sm font-normal text-slate-500">hours</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">From report to ground repair</div>
        </div>
      </div>

      {/* Visual Analytics Charts (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Category Distribution Bar Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#15171D] flex items-center">
              <BarChart2 className="w-4 h-4 mr-2 text-[#245D9C]" />
              Grievances by Category
            </h3>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Top Categories</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryChartData}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#245D9C" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Breakdown Pie Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#15171D] flex items-center">
              <PieIcon className="w-4 h-4 mr-2 text-[#B79A68]" />
              Current Status Distribution
            </h3>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Workflow States</span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            {statusChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusChartData}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {statusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-slate-400 italic">No status data to display</div>
            )}
          </div>
        </div>

      </div>

      {/* Ward Telemetry Breakdown Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-[#15171D] flex items-center">
          <MapPin className="w-4 h-4 mr-2 text-[#245D9C]" />
          Ward-Level Civic Incident Density
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Ward #</th>
                <th className="py-3 px-4">Locality / Electoral Ward</th>
                <th className="py-3 px-4">Zone Division</th>
                <th className="py-3 px-4 text-right">Reported Issues</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {wardCounts.map((w) => (
                <tr key={w._id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-bold text-slate-900">Ward {w.number}</td>
                  <td className="py-3 px-4 font-medium text-slate-800">{w.name}</td>
                  <td className="py-3 px-4 text-slate-500">{w.zone}</td>
                  <td className="py-3 px-4 text-right font-extrabold text-[#245D9C]">
                    {w.count}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Map of Active Complaints */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-[#15171D] flex items-center">
          <Layers className="w-4 h-4 mr-2 text-[#245D9C]" />
          Live Geo-located Complaints
        </h3>
        <MapView issues={issues} height="420px" />
      </div>

    </div>
  );
}
