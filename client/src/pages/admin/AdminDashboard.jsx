import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import {
  BarChart3,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Layers,
  MapPin,
  TrendingUp,
  RefreshCw
} from 'lucide-react';

export default function AdminDashboard() {
  const { isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/login');
    }
  }, [authLoading, isAdmin, navigate]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/stats');
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching admin statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && isAdmin) {
      fetchStats();
    }
  }, [authLoading, isAdmin]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-500 flex items-center justify-center space-x-2">
        <RefreshCw className="w-5 h-5 animate-spin text-pcmc-600" />
        <span>Loading PCMC Analytics...</span>
      </div>
    );
  }

  const { totalIssues, statusCounts, categoryCounts, wardCounts, slaBreaches, avgResolutionHours } =
    stats || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center">
          <BarChart3 className="w-6 h-6 mr-2 text-pcmc-600" />
          PCMC Civic Analytics & SLA Overview
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Ward-level operational metrics, status distribution, and grievance resolution times.
        </p>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase">
            Total Issues Reported
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">
            {totalIssues || 0}
          </div>
          <div className="text-xs text-slate-400 mt-1">Across all 8 PCMC Wards</div>
        </div>

        <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-200 shadow-sm">
          <div className="text-xs font-semibold text-amber-700 uppercase">
            Pending Verification
          </div>
          <div className="text-3xl font-extrabold text-amber-900 mt-2">
            {statusCounts?.pending || 0}
          </div>
          <div className="text-xs text-amber-600 mt-1">Requires admin review</div>
        </div>

        <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-200 shadow-sm">
          <div className="text-xs font-semibold text-emerald-700 uppercase">
            Resolved / Closed
          </div>
          <div className="text-3xl font-extrabold text-emerald-900 mt-2">
            {(statusCounts?.resolved || 0) + (statusCounts?.closed || 0)}
          </div>
          <div className="text-xs text-emerald-600 mt-1">Work finished with proof</div>
        </div>

        <div className="bg-rose-50/50 p-5 rounded-2xl border border-rose-200 shadow-sm">
          <div className="text-xs font-semibold text-rose-700 uppercase">
            SLA Breaches
          </div>
          <div className="text-3xl font-extrabold text-rose-900 mt-2">
            {slaBreaches || 0}
          </div>
          <div className="text-xs text-rose-600 mt-1">Past expected due date</div>
        </div>
      </div>

      {/* Second Row: Status Distribution & Resolution Time */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center">
            <Clock className="w-4 h-4 mr-2 text-pcmc-600" /> Average Resolution Time
          </h3>
          <div className="text-4xl font-extrabold text-slate-800">
            {avgResolutionHours || 0} <span className="text-lg font-normal text-slate-500">hours</span>
          </div>
          <p className="text-xs text-slate-500">
            Average turnaround time from citizen submission to departmental completion and photo proof.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm md:col-span-2 space-y-3">
          <h3 className="font-bold text-slate-900 text-sm">
            Status Breakdown
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-500 block">Pending</span>
              <strong className="text-lg text-amber-700">{statusCounts?.pending || 0}</strong>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-500 block">Verified</span>
              <strong className="text-lg text-blue-700">{statusCounts?.verified || 0}</strong>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-500 block">In Progress</span>
              <strong className="text-lg text-indigo-700">{statusCounts?.in_progress || 0}</strong>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-500 block">Rejected</span>
              <strong className="text-lg text-rose-700">{statusCounts?.rejected || 0}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Tables: Ward Summary and Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ward Distribution */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-pcmc-600" /> Ward-Wise Civic Problem Density
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Ward</th>
                  <th className="py-2.5 px-3">Name</th>
                  <th className="py-2.5 px-3">Zone</th>
                  <th className="py-2.5 px-3 text-right">Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {wardCounts && wardCounts.map((w) => (
                  <tr key={w._id} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-bold text-slate-800">
                      Ward {w.number}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700">{w.name}</td>
                    <td className="py-2.5 px-3 text-slate-500">{w.zone}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-pcmc-600">
                      {w.count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Category Trends */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center">
            <Layers className="w-5 h-5 mr-2 text-pcmc-600" /> Category Breakdown
          </h3>
          <div className="space-y-3">
            {categoryCounts && categoryCounts.map((cat) => {
              const percentage = totalIssues > 0 ? Math.round((cat.count / totalIssues) * 100) : 0;
              return (
                <div key={cat._id} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-700">{cat.name}</span>
                    <span className="text-slate-500 font-semibold">{cat.count} ({percentage}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-pcmc-600 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
