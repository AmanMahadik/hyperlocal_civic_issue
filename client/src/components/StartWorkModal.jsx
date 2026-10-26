import React, { useState } from 'react';
import { PlayCircle, X, Wrench, Clock, CheckCircle2 } from 'lucide-react';

export default function StartWorkModal({ isOpen, onClose, onConfirm, issue, loading = false }) {
  const [crewCount, setCrewCount] = useState('4 Field Workers & 1 Equipment Operator');
  const [estimatedHours, setEstimatedHours] = useState('2-4 hours');
  const [siteNote, setSiteNote] = useState(
    `Field squad arrived on site at ${issue?.address || 'location'}. Heavy equipment deployed and resolution work actively underway.`
  );

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm({
      note: `Crew Check-In: ${siteNote} [Team: ${crewCount} | Est. Duration: ${estimatedHours}]`
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center text-indigo-700 font-bold text-base">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center mr-2 text-indigo-700">
              <Wrench className="w-4 h-4" />
            </div>
            Confirm Field Crew Arrival & Start Work
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-500 mt-3 leading-relaxed">
          Record that the municipal squad has physically reported to the site and commenced ground operations.
        </p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              On-Site Crew Size & Personnel
            </label>
            <input
              type="text"
              value={crewCount}
              onChange={(e) => setCrewCount(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-300 p-2.5"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Estimated Completion Window
            </label>
            <div className="relative">
              <Clock className="w-3.5 h-3.5 absolute left-2.5 top-3 text-slate-400" />
              <input
                type="text"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(e.target.value)}
                placeholder="e.g. 2-3 hours / by end of day"
                className="w-full text-xs rounded-lg border border-slate-300 pl-8 p-2.5"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Field Operations Status Note *
            </label>
            <textarea
              rows={3}
              value={siteNote}
              onChange={(e) => setSiteNote(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />
          </div>

          {/* Action buttons */}
          <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm disabled:opacity-50 transition"
            >
              <PlayCircle className="w-3.5 h-3.5 mr-1.5" />
              {loading ? 'Recording Arrival...' : 'Confirm Site Arrival (Mark In Progress)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
