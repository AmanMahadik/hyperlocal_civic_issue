import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import IssueCard from '../components/IssueCard';
import { FileText, PlusCircle, AlertCircle } from 'lucide-react';

export default function MyReports() {
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMine = async () => {
      try {
        const res = await api.get('/issues/mine');
        if (res.data.success) {
          setIssues(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching my reports:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchMine();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center text-slate-600">
        <p>Please log in to track your reported civic issues.</p>
        <Link to="/login" className="text-pcmc-600 font-semibold underline mt-2 inline-block">
          Log in
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center">
            <FileText className="w-6 h-6 mr-2 text-pcmc-600" />
            My Reported Issues ({issues.length})
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track status updates, PCMC officer assignments, and verify resolutions.
          </p>
        </div>

        <Link
          to="/report"
          className="inline-flex items-center px-4 py-2 bg-pcmc-600 hover:bg-pcmc-700 text-white font-medium text-sm rounded-xl shadow-sm transition"
        >
          <PlusCircle className="w-4 h-4 mr-2" /> Report Another Issue
        </Link>
      </div>

      {loading ? (
        <p className="text-center text-slate-500 py-12">Loading your reports...</p>
      ) : issues.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
          <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <h3 className="font-semibold text-slate-700">No issues reported yet</h3>
          <p className="text-xs text-slate-500 mt-1">
            Spotted a pothole, open drain or garbage pile in your locality?
          </p>
          <Link
            to="/report"
            className="mt-4 inline-flex items-center px-4 py-2 bg-pcmc-600 text-white text-xs font-semibold rounded-lg hover:bg-pcmc-700"
          >
            Report Your First Issue
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {issues.map((issue) => (
            <IssueCard key={issue._id} issue={issue} />
          ))}
        </div>
      )}
    </div>
  );
}
