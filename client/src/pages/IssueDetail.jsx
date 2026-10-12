import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import Timeline from '../components/Timeline';
import RejectModal from '../components/RejectModal';
import MapView from '../components/MapView';
import {
  ThumbsUp,
  MapPin,
  Calendar,
  Building,
  User,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  RotateCcw,
  MessageSquare,
  Upload,
  AlertCircle
} from 'lucide-react';

export default function IssueDetail() {
  const { id } = useParams();
  const { user, isAdmin } = useAuth();

  const [issue, setIssue] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  // Admin resolution photo state
  const [resolutionFiles, setResolutionFiles] = useState([]);
  const [resolutionNote, setResolutionNote] = useState('');

  const fetchIssueData = async () => {
    try {
      const [issueRes, commentsRes] = await Promise.all([
        api.get(`/issues/${id}`),
        api.get(`/issues/${id}/comments`)
      ]);
      if (issueRes.data.success) setIssue(issueRes.data.data);
      if (commentsRes.data.success) setComments(commentsRes.data.data);
    } catch (err) {
      console.error('Error fetching issue detail:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssueData();
  }, [id]);

  // Upvote
  const handleUpvote = async () => {
    if (!user) {
      alert('Please log in to upvote issues.');
      return;
    }
    try {
      const res = await api.post(`/issues/${id}/upvote`);
      if (res.data.success) {
        fetchIssueData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Add Comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      const res = await api.post(`/issues/${id}/comments`, { text: commentText });
      if (res.data.success) {
        setComments([...comments, res.data.data]);
        setCommentText('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Citizen Confirm or Reopen
  const handleConfirmOrReopen = async (action) => {
    const note = prompt(
      action === 'confirm'
        ? 'Add an optional closing remark:'
        : 'Please specify why the issue is still unresolved:'
    );
    if (action === 'reopen' && (!note || !note.trim())) {
      alert('Reopening requires a note describing why work was unsatisfactory.');
      return;
    }
    try {
      setActionLoading(true);
      const res = await api.post(`/issues/${id}/confirm`, { action, note });
      if (res.data.success) {
        fetchIssueData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  // Admin Actions
  const handleVerify = async () => {
    try {
      setActionLoading(true);
      const res = await api.patch(`/issues/${id}/verify`, {
        note: 'Issue verified by PCMC Admin'
      });
      if (res.data.success) fetchIssueData();
    } catch (err) {
      alert(err.response?.data?.message || 'Verification failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (reason) => {
    try {
      setActionLoading(true);
      const res = await api.patch(`/issues/${id}/reject`, { reason });
      if (res.data.success) {
        setShowRejectModal(false);
        fetchIssueData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Rejection failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAssign = async () => {
    try {
      setActionLoading(true);
      const res = await api.patch(`/issues/${id}/assign`, {
        assignedTo: user._id,
        note: `Assigned to ${issue.category?.department || 'Department Officer'}`
      });
      if (res.data.success) fetchIssueData();
    } catch (err) {
      alert(err.response?.data?.message || 'Assignment failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      setActionLoading(true);
      if (newStatus === 'resolved') {
        const formData = new FormData();
        formData.append('status', 'resolved');
        formData.append('note', resolutionNote || 'Work completed on site');
        resolutionFiles.forEach((file) => {
          formData.append('resolutionImages', file);
        });

        const res = await api.patch(`/issues/${id}/status`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (res.data.success) fetchIssueData();
      } else {
        const res = await api.patch(`/issues/${id}/status`, {
          status: newStatus,
          note: `Status moved to ${newStatus}`
        });
        if (res.data.success) fetchIssueData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Status update failed');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-slate-500">
        Loading issue details...
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-slate-600">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-2" />
        <h2 className="text-xl font-bold">Issue Not Found</h2>
        <Link to="/" className="text-pcmc-600 underline mt-2 inline-block">
          Return to map
        </Link>
      </div>
    );
  }

  const isReporter = user && issue.reporter?._id === user._id;
  const hasUpvoted =
    user &&
    issue.upvotes &&
    issue.upvotes.some((uid) => uid === user._id || uid?._id === user._id);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Reject Modal */}
      <RejectModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onConfirm={handleReject}
        loading={actionLoading}
      />

      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center space-x-3">
            <StatusBadge status={issue.status} size="lg" />
            <PriorityBadge priority={issue.priority} />
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700">
              {issue.category?.department}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleUpvote}
              className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
                hasUpvoted
                  ? 'bg-pcmc-600 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
              }`}
            >
              <ThumbsUp className="w-4 h-4" />
              <span>{issue.upvoteCount} Upvotes</span>
            </button>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          {issue.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">
          <span className="flex items-center">
            <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
            Ward {issue.ward?.number} ({issue.ward?.name})
          </span>
          <span className="flex items-center">
            <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
            Reported on {new Date(issue.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
          </span>
          <span className="flex items-center">
            <User className="w-3.5 h-3.5 mr-1 text-slate-400" />
            Reported by {issue.reporter?.name || 'Citizen'}
          </span>
          {issue.dueDate && (
            <span className="text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded">
              SLA Due: {new Date(issue.dueDate).toLocaleDateString('en-IN')}
            </span>
          )}
        </div>

        {issue.rejectionReason && (
          <div className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start">
            <ShieldAlert className="w-4 h-4 mr-2 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Rejection Notice from PCMC Staff:</strong>
              <p className="mt-0.5">{issue.rejectionReason}</p>
            </div>
          </div>
        )}
      </div>

      {/* Grid Layout: Photos & Details (Left) + Actions & Timeline (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Photos, Map, Description) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Photos */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900">Proof Photos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {issue.images && issue.images.length > 0 ? (
                issue.images.map((img, idx) => (
                  <a
                    key={idx}
                    href={img.url}
                    target="_blank"
                    rel="noreferrer"
                    className="h-64 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 group"
                  >
                    <img
                      src={img.url}
                      alt="Proof"
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  </a>
                ))
              ) : (
                <div className="h-48 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 text-sm">
                  No images uploaded
                </div>
              )}
            </div>

            {/* Resolution Proof Photos (if present) */}
            {issue.resolutionImages && issue.resolutionImages.length > 0 && (
              <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
                <span className="inline-flex items-center text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> PCMC Resolution After-Proof Photo
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {issue.resolutionImages.map((img, idx) => (
                    <a
                      key={idx}
                      href={img.url}
                      target="_blank"
                      rel="noreferrer"
                      className="h-64 rounded-xl overflow-hidden border-2 border-emerald-400 bg-emerald-50 group"
                    >
                      <img
                        src={img.url}
                        alt="Resolution Proof"
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Description & Address */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900">Issue Description</h2>
            <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
              {issue.description}
            </p>

            {issue.address && (
              <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <strong>Landmark / Location Reference:</strong> {issue.address}
              </div>
            )}
          </div>

          {/* Location Map */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-pcmc-600" /> Geospatial Location
            </h2>
            <MapView
              issues={[issue]}
              center={[issue.location.coordinates[1], issue.location.coordinates[0]]}
              zoom={15}
              height="280px"
            />
          </div>

          {/* Comments Section */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center">
              <MessageSquare className="w-4 h-4 mr-2 text-pcmc-600" /> Citizen Discussion ({comments.length})
            </h2>

            {user ? (
              <form onSubmit={handleAddComment} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Write a comment or update about this issue..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1 text-sm border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-pcmc-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-pcmc-600 text-white rounded-lg text-sm font-semibold hover:bg-pcmc-700 transition"
                >
                  Post
                </button>
              </form>
            ) : (
              <p className="text-xs text-slate-500 italic">
                <Link to="/login" className="text-pcmc-600 underline">Log in</Link> to post comments.
              </p>
            )}

            <div className="space-y-3 pt-2">
              {comments.map((c) => (
                <div key={c._id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-800">
                      {c.user?.name} {c.user?.role === 'admin' && '(PCMC Staff)'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(c.createdAt).toLocaleDateString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                    </span>
                  </div>
                  <p className="text-slate-700">{c.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (Admin Actions, Reporter Confirmation, Timeline) */}
        <div className="space-y-6">
          {/* Citizen Reporter Actions (Confirm / Reopen) */}
          {isReporter && issue.status === 'resolved' && (
            <div className="bg-emerald-50 rounded-2xl border-2 border-emerald-300 p-6 shadow-sm space-y-3">
              <h3 className="font-bold text-sm text-emerald-900 flex items-center">
                <CheckCircle2 className="w-5 h-5 mr-2 text-emerald-600" />
                Citizen Confirmation Required
              </h3>
              <p className="text-xs text-emerald-800">
                PCMC staff have marked this issue as resolved. Please inspect the site and confirm if the work was completed properly.
              </p>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => handleConfirmOrReopen('confirm')}
                  disabled={actionLoading}
                  className="flex-1 py-2 bg-emerald-600 text-white font-semibold text-xs rounded-lg hover:bg-emerald-700 shadow"
                >
                  Confirm & Close
                </button>
                <button
                  onClick={() => handleConfirmOrReopen('reopen')}
                  disabled={actionLoading}
                  className="flex-1 py-2 bg-rose-600 text-white font-semibold text-xs rounded-lg hover:bg-rose-700 shadow"
                >
                  Reopen Issue
                </button>
              </div>
            </div>
          )}

          {/* PCMC Admin Actions Panel */}
          {isAdmin && (
            <div className="bg-amber-50/70 rounded-2xl border-2 border-amber-200 p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-amber-900 flex items-center">
                <ShieldCheck className="w-5 h-5 mr-2 text-amber-600" />
                PCMC Official Action Panel
              </h3>

              {/* Status: pending */}
              {issue.status === 'pending' && (
                <div className="space-y-2">
                  <p className="text-xs text-amber-800">
                    Verify location inside PCMC limits and clarity of problem photo.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleVerify}
                      disabled={actionLoading}
                      className="flex-1 py-2 bg-pcmc-600 hover:bg-pcmc-700 text-white font-semibold text-xs rounded-lg shadow"
                    >
                      Verify & Approve
                    </button>
                    <button
                      onClick={() => setShowRejectModal(true)}
                      disabled={actionLoading}
                      className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-lg shadow"
                    >
                      Reject...
                    </button>
                  </div>
                </div>
              )}

              {/* Status: verified or reopened -> Assign */}
              {(issue.status === 'verified' || issue.status === 'reopened') && (
                <div className="space-y-2">
                  <p className="text-xs text-amber-800">
                    Assign issue to department field squad.
                  </p>
                  <button
                    onClick={handleAssign}
                    disabled={actionLoading}
                    className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-lg shadow"
                  >
                    Assign to {issue.category?.department}
                  </button>
                </div>
              )}

              {/* Status: assigned -> Move to in_progress */}
              {issue.status === 'assigned' && (
                <div className="space-y-2">
                  <button
                    onClick={() => handleStatusUpdate('in_progress')}
                    disabled={actionLoading}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg shadow"
                  >
                    Start Work (Mark In Progress)
                  </button>
                </div>
              )}

              {/* Status: in_progress -> Resolve */}
              {issue.status === 'in_progress' && (
                <div className="space-y-3">
                  <p className="text-xs text-amber-800 font-medium">
                    Upload resolution photo proof:
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setResolutionFiles(Array.from(e.target.files))}
                    className="text-xs text-slate-700"
                  />
                  <input
                    type="text"
                    placeholder="Resolution notes (e.g. Patching done)"
                    value={resolutionNote}
                    onChange={(e) => setResolutionNote(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded p-1.5"
                  />
                  <button
                    onClick={() => handleStatusUpdate('resolved')}
                    disabled={actionLoading}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow"
                  >
                    Mark Resolved
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Status Lifecycle Timeline */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900">
              Audit & Status History
            </h3>
            <Timeline history={issue.statusHistory} />
          </div>
        </div>
      </div>
    </div>
  );
}
