import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import Timeline from '../components/Timeline';
import {
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  AlertCircle,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  FileText,
  UserCheck
} from 'lucide-react';

export default function TrackComplaint() {
  const [searchParams] = useSearchParams();
  const initialId = searchParams.get('id') || '';

  const [complaintId, setComplaintId] = useState(initialId);
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (idToSearch) => {
    const query = idToSearch || complaintId;
    if (!query || !query.trim()) return;

    setLoading(true);
    setError('');
    setIssue(null);

    try {
      // First try direct ID lookup
      let res;
      try {
        res = await api.get(`/issues/${query.trim()}`);
      } catch (err) {
        // If not a valid ObjectId or 404, fallback to search by text/title
        const searchRes = await api.get('/issues', {
          params: { search: query.trim(), limit: 1 }
        });
        if (searchRes.data.success && searchRes.data.data.length > 0) {
          const matchedId = searchRes.data.data[0]._id;
          res = await api.get(`/issues/${matchedId}`);
        } else {
          throw new Error('Complaint ID not found in PCMC system.');
        }
      }

      if (res && res.data.success) {
        setIssue(res.data.data);
      } else {
        setError('No complaint found matching this ID. Please double check.');
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Complaint ID not found. Please verify the ID or check recent reports.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialId) {
      handleSearch(initialId);
    }
  }, [initialId]);

  // Compute status step index
  const statusSteps = [
    { key: 'pending', label: 'Submitted & Under Review' },
    { key: 'verified', label: 'Verified by Officer' },
    { key: 'assigned', label: 'Assigned to Squad' },
    { key: 'in_progress', label: 'Work In Progress' },
    { key: 'resolved', label: 'Resolved on Site' },
    { key: 'closed', label: 'Confirmed & Closed' }
  ];

  const getStepIndex = (status) => {
    switch (status) {
      case 'pending': return 0;
      case 'verified': return 1;
      case 'assigned': return 2;
      case 'in_progress': return 3;
      case 'resolved': return 4;
      case 'closed': return 5;
      default: return 0;
    }
  };

  const currentStepIdx = issue ? getStepIndex(issue.status) : 0;
  const isRejected = issue && issue.status === 'rejected';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[#B79A68]">
          Citizen Grievance Redressal
        </span>
        <h1 className="text-3xl font-extrabold text-[#15171D]">
          Track Your Civic Complaint
        </h1>
        <p className="text-xs sm:text-sm text-[#64748B] max-w-lg mx-auto">
          Enter your unique complaint reference ID or issue keyword to view real-time department verification and resolution status.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="e.g. 675c91... or issue keyword"
              value={complaintId}
              onChange={(e) => setComplaintId(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#245D9C] focus:border-[#245D9C] outline-none font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-[#245D9C] hover:bg-[#1a4778] text-white font-bold text-sm rounded-xl transition shadow-sm disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Track Status'}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center">
            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Result Display */}
      {issue && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-8">
          
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center space-x-2 text-xs font-mono text-[#B79A68] mb-1">
                <span>Complaint Reference ID:</span>
                <strong className="text-[#15171D] bg-slate-100 px-2 py-0.5 rounded">
                  {issue._id}
                </strong>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#15171D]">
                {issue.title}
              </h2>
            </div>
            <div className="flex items-center space-x-2">
              <StatusBadge status={issue.status} size="lg" />
              <PriorityBadge priority={issue.priority} />
            </div>
          </div>

          {/* Stepper Progress Bar */}
          {!isRejected ? (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Resolution Workflow Progress
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                {statusSteps.map((st, idx) => {
                  const isCompleted = idx <= currentStepIdx;
                  const isCurrent = idx === currentStepIdx;

                  return (
                    <div
                      key={st.key}
                      className={`p-2.5 rounded-xl border text-center transition ${
                        isCurrent
                          ? 'border-[#245D9C] bg-[#e9f1fa] text-[#245D9C]'
                          : isCompleted
                          ? 'border-emerald-300 bg-emerald-50/50 text-[#218653]'
                          : 'border-slate-200 bg-slate-50 text-slate-400'
                      }`}
                    >
                      <div className="text-xs font-bold mb-1">Step {idx + 1}</div>
                      <div className="text-[11px] font-semibold leading-tight line-clamp-2">
                        {st.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-1">
              <div className="font-bold flex items-center">
                <ShieldAlert className="w-4 h-4 mr-1.5 text-rose-600" />
                Complaint Rejected
              </div>
              <p>
                <strong>Reason:</strong> {issue.rejectionReason || 'Complaint does not meet PCMC verification criteria.'}
              </p>
            </div>
          )}

          {/* Details Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-[#64748B] pt-2">
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-slate-700 block">Civic Category:</span>
                <span className="text-slate-900 font-medium">{issue.category?.name}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-700 block">Assigned Department:</span>
                <span className="text-slate-900 font-medium">{issue.category?.department}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-700 block">Locality / Ward:</span>
                <span className="text-slate-900 font-medium">
                  {issue.ward ? `Ward ${issue.ward.number} (${issue.ward.name})` : 'PCMC Region'}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <span className="font-semibold text-slate-700 block">Registration Date:</span>
                <span className="text-slate-900 font-medium">
                  {new Date(issue.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                </span>
              </div>
              {issue.dueDate && (
                <div>
                  <span className="font-semibold text-slate-700 block">Target Resolution SLA:</span>
                  <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded">
                    {new Date(issue.dueDate).toLocaleDateString('en-IN')}
                  </span>
                </div>
              )}
              {issue.address && (
                <div>
                  <span className="font-semibold text-slate-700 block">Landmark / Street:</span>
                  <span className="text-slate-900 font-medium">{issue.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Photos: Reported Photo vs Resolution Photo */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-[#15171D]">Photographic Verification</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-slate-500 font-semibold block mb-2">
                  Original Citizen Report Photo
                </span>
                {issue.images && issue.images.length > 0 ? (
                  <img
                    src={issue.images[0].url}
                    alt="Reported condition"
                    className="w-full h-48 object-cover rounded-xl border border-slate-200"
                  />
                ) : (
                  <div className="h-48 bg-slate-100 rounded-xl flex items-center justify-center text-xs text-slate-400">
                    No image attached
                  </div>
                )}
              </div>

              <div>
                <span className="text-xs text-emerald-700 font-bold block mb-2">
                  PCMC Resolution Proof After-Photo
                </span>
                {issue.resolutionImages && issue.resolutionImages.length > 0 ? (
                  <img
                    src={issue.resolutionImages[0].url}
                    alt="Resolution proof"
                    className="w-full h-48 object-cover rounded-xl border-2 border-emerald-400"
                  />
                ) : (
                  <div className="h-48 bg-slate-50 border border-dashed border-slate-200 rounded-xl flex items-center justify-center text-xs text-slate-400 text-center p-4">
                    Resolution photo will be uploaded once department completes ground repair.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Status Timeline */}
          <div className="pt-6 border-t border-slate-100 space-y-4">
            <h3 className="text-sm font-bold text-[#15171D]">Official Audit Trail</h3>
            <Timeline history={issue.statusHistory} />
          </div>

          {/* Link to Full Discussion / Detail */}
          <div className="pt-4 flex justify-end">
            <Link
              to={`/issues/${issue._id}`}
              className="inline-flex items-center text-xs font-bold text-[#245D9C] hover:underline"
            >
              Open Full Discussion & Upvoting Page &rarr;
            </Link>
          </div>

        </div>
      )}
    </div>
  );
}
