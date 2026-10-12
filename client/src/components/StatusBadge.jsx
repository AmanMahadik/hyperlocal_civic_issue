import React from 'react';

const statusConfig = {
  pending: {
    label: 'Pending Verification',
    bg: 'bg-amber-50 text-amber-700 border-amber-200'
  },
  verified: {
    label: 'Verified',
    bg: 'bg-blue-50 text-blue-700 border-blue-200'
  },
  assigned: {
    label: 'Assigned',
    bg: 'bg-purple-50 text-purple-700 border-purple-200'
  },
  in_progress: {
    label: 'In Progress',
    bg: 'bg-indigo-50 text-indigo-700 border-indigo-200'
  },
  resolved: {
    label: 'Resolved',
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  },
  closed: {
    label: 'Closed',
    bg: 'bg-slate-100 text-slate-700 border-slate-200'
  },
  rejected: {
    label: 'Rejected',
    bg: 'bg-rose-50 text-rose-700 border-rose-200'
  },
  reopened: {
    label: 'Reopened',
    bg: 'bg-orange-50 text-orange-700 border-orange-200'
  }
};

export default function StatusBadge({ status, size = 'sm' }) {
  const config = statusConfig[status] || {
    label: status,
    bg: 'bg-slate-50 text-slate-600 border-slate-200'
  };

  const sizeClasses = size === 'lg' ? 'px-3 py-1 text-sm' : 'px-2.5 py-0.5 text-xs';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${config.bg} ${sizeClasses}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70"></span>
      {config.label}
    </span>
  );
}
