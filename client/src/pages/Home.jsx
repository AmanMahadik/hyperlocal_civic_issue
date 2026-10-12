import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import IssueCard from '../components/IssueCard';
import MapView from '../components/MapView';
import { Search, Filter, Layers, MapPin, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [categories, setCategories] = useState([]);
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('split'); // 'split' | 'map' | 'list'

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory) params.category = selectedCategory;
      if (selectedWard) params.ward = selectedWard;
      if (selectedStatus) params.status = selectedStatus;
      if (searchQuery) params.search = searchQuery;

      const [issuesRes, catRes, wardsRes] = await Promise.all([
        api.get('/issues', { params }),
        api.get('/categories'),
        api.get('/wards')
      ]);

      if (issuesRes.data.success) setIssues(issuesRes.data.data);
      if (catRes.data.success) setCategories(catRes.data.data);
      if (wardsRes.data.success) setWards(wardsRes.data.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedCategory, selectedWard, selectedStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  const handleUpvote = async (issueId) => {
    if (!user) {
      alert('Please log in to upvote issues.');
      return;
    }
    try {
      const res = await api.post(`/issues/${issueId}/upvote`);
      if (res.data.success) {
        setIssues((prev) =>
          prev.map((iss) =>
            iss._id === issueId
              ? {
                  ...iss,
                  upvoteCount: res.data.data.upvoteCount,
                  priority: res.data.data.priority,
                  upvotes: res.data.data.hasUpvoted
                    ? [...iss.upvotes, user._id]
                    : iss.upvotes.filter((id) => id !== user._id)
                }
              : iss
          )
        );
      }
    } catch (err) {
      console.error('Upvote failed:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Hero / Banner */}
      <div className="bg-gradient-to-r from-pcmc-700 to-pcmc-900 text-white rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="max-w-3xl">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white mb-3">
            Pimpri-Chinchwad Smart Civic Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Transparent Civic Action across PCMC Wards
          </h1>
          <p className="mt-2 text-sm sm:text-base text-pcmc-100">
            Report road damages, overflowing garbage, drainage blocks, and streetlight issues with photos and GPS pins. Track real-time verification and departmental resolution.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by issue title, landmark or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-pcmc-500 focus:border-pcmc-500 outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-pcmc-600 text-white text-sm font-medium rounded-lg hover:bg-pcmc-700 transition"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 outline-none focus:ring-1 focus:ring-pcmc-500"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Ward Filter */}
            <select
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              className="border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 outline-none focus:ring-1 focus:ring-pcmc-500"
            >
              <option value="">All PCMC Wards</option>
              {wards.map((w) => (
                <option key={w._id} value={w._id}>
                  Ward {w.number} - {w.name}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 outline-none focus:ring-1 focus:ring-pcmc-500"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending Verification</option>
              <option value="verified">Verified</option>
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
              <option value="reopened">Reopened</option>
            </select>

            {(selectedCategory || selectedWard || selectedStatus || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('');
                  setSelectedWard('');
                  setSelectedStatus('');
                  setSearchQuery('');
                }}
                className="text-rose-600 hover:underline px-2 py-1 font-medium"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* View toggle */}
          <div className="flex items-center space-x-1 bg-slate-100 p-0.5 rounded-lg text-xs">
            <button
              onClick={() => setViewMode('split')}
              className={`px-3 py-1 rounded-md font-medium transition ${
                viewMode === 'split' ? 'bg-white shadow text-slate-900' : 'text-slate-600'
              }`}
            >
              Split View
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1 rounded-md font-medium transition ${
                viewMode === 'map' ? 'bg-white shadow text-slate-900' : 'text-slate-600'
              }`}
            >
              Full Map
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded-md font-medium transition ${
                viewMode === 'list' ? 'bg-white shadow text-slate-900' : 'text-slate-600'
              }`}
            >
              Cards Only
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center space-y-2">
          <RefreshCw className="w-6 h-6 animate-spin text-pcmc-600" />
          <p className="text-sm">Loading PCMC civic issues...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Map Section */}
          {(viewMode === 'split' || viewMode === 'map') && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <span className="font-medium text-slate-700 flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-pcmc-600" /> PCMC Interactive Map ({issues.length} active pins)
                </span>
                <span>Click any pin to inspect issue and department</span>
              </div>
              <MapView
                issues={issues}
                height={viewMode === 'map' ? '580px' : '380px'}
              />
            </div>
          )}

          {/* Issue Cards Grid */}
          {(viewMode === 'split' || viewMode === 'list') && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-800">
                  Civic Reports ({issues.length})
                </h2>
              </div>

              {issues.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
                  <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="font-semibold text-slate-700">No issues found matching your filters</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Try clearing filters or search criteria.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {issues.map((issue) => (
                    <IssueCard
                      key={issue._id}
                      issue={issue}
                      onUpvote={handleUpvote}
                      hasUpvoted={
                        user &&
                        issue.upvotes &&
                        issue.upvotes.some((uid) => uid === user._id || uid?._id === user._id)
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
