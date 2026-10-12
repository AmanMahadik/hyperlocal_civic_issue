import React from 'react';

const priorityConfig = {
  low: {
    label: 'Low',
    classes: 'bg-slate-100 text-slate-700'
  },
  medium: {
    label: 'Medium',
    classes: 'bg-blue-100 text-blue-800'
  },
  high: {
    label: 'High',
    classes: 'bg-amber-100 text-amber-800 font-semibold'
  },
  critical: {
    label: 'Critical Priority',
    classes: 'bg-red-100 text-red-800 font-bold animate-pulse'
  }
};

export default function PriorityBadge({ priority }) {
  const config = priorityConfig[priority] || priorityConfig.medium;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs tracking-wide uppercase ${config.classes}`}
    >
      {config.label}
    </span>
  );
}
