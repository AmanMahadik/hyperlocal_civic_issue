import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import PriorityBadge from '../../components/PriorityBadge';
import RejectModal from '../../components/RejectModal';
import { ShieldCheck, Check, X, MapPin, Calendar, ExternalLink } from 'lucide-react';

export default function VerificationQueue() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectingId, setRejectingId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/login');
    }
  }, [isAdmin, navigate]);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/queue');
      if (res.data.success) {
        setQueue(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching admin queue:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleVerify = async (id) => {
    try {
      setActionLoading(true);
      const res = await api.patch(`/issues/${id}/verify`, {
        note: 'Verified from Quick Review Queue'
      });
      if (res.data.success) {
        setQueue((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Verification failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectConfirm = async (reason) => {
    if (!rejectingId) return;
    try {
      setActionLoading(true);
      const res = await api.patch(`/issues/${rejectingId}/reject`, { reason });
      if (res.data.success) {
        setQueue((prev) => prev.filter((item) => item._id !== rejectingId));
        setRejectingId(null);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Rejection failed');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <RejectModal
        isOpen={!!rejectingId}
        onClose={() => setRejectingId(null)}
        onConfirm={handleRejectConfirm}
        loading={actionLoading}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center">
            <ShieldCheck className="w-6 h-6 mr-2 text-amber-600" />
            PCMC Verification Queue ({queue.length})
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review incoming citizen reports. Filter out fake, duplicate, or out-of-boundary submissions before dispatching work.
          </p>
        </div>
      </div>

      {loading ? (
        <p className="text-center py-12 text-slate-500">Loading pending verification queue...</p>
      ) : queue.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
          <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
          <h3 className="font-semibold text-slate-800 text-lg">Verification Queue Clear!</h3>
          <p className="text-xs text-slate-500 mt-1">
            All submitted issues have been processed and moved into the departmental workflow.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="divide-y divide-slate-100">
            {queue.map((issue) => {
              const imgUrl =
                issue.images && issue.images.length > 0
                  ? issue.images[0].url
                  : 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=300';

              return (
                <div
                  key={issue._id}
                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 transition"
                >
                  <div className="flex items-start space-x-4">
                    <img
                      src={imgUrl}
                      alt="Proof"
                      className="w-20 h-20 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <PriorityBadge priority={issue.priority} />
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-pcmc-50 text-pcmc-700">
                          {issue.category?.name}
                        </span>
                        <span className="text-xs text-slate-400">
                          Dept: {issue.category?.department}
                        </span>
                      </div>

                      <Link
                        to={`/issues/${issue._id}`}
                        className="text-base font-bold text-slate-900 hover:text-pcmc-600 transition flex items-center"
                      >
                        {issue.title}
                        <ExternalLink className="w-3.5 h-3.5 ml-1.5 text-slate-400" />
                      </Link>

                      <p className="text-xs text-slate-600 line-clamp-1">
                        {issue.description}
                      </p>

                      <div className="flex items-center space-x-4 text-xs text-slate-500 pt-1">
                        <span className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1 text-slate-400" />
                          Ward {issue.ward?.number} ({issue.ward?.name})
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1 text-slate-400" />
                          {new Date(issue.createdAt).toLocaleDateString('en-IN', {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                          })}
                        </span>
                        <span>Reporter: {issue.reporter?.name}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="flex items-center space-x-2 self-end md:self-center">
                    <button
                      onClick={() => handleVerify(issue._id)}
                      disabled={actionLoading}
                      className="inline-flex items-center px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition"
                    >
                      <Check className="w-3.5 h-3.5 mr-1" />
                      Verify
                    </button>
                    <button
                      onClick={() => setRejectingId(issue._id)}
                      disabled={actionLoading}
                      className="inline-flex items-center px-3.5 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-semibold rounded-lg transition"
                    >
                      <X className="w-3.5 h-3.5 mr-1" />
                      Reject...
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
