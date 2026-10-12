import React from 'react';
import StatusBadge from './StatusBadge';
import { CheckCircle2, Clock, User, ShieldCheck } from 'lucide-react';

export default function Timeline({ history = [] }) {
  if (!history || history.length === 0) {
    return <p className="text-sm text-slate-500 italic">No history recorded yet.</p>;
  }

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {history.map((item, index) => {
          const isLast = index === history.length - 1;
          const formattedDate = new Date(item.at).toLocaleString('en-IN', {
            dateStyle: 'medium',
            timeStyle: 'short'
          });

          return (
            <li key={item._id || index}>
              <div className="relative pb-8">
                {!isLast && (
                  <span
                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200"
                    aria-hidden="true"
                  />
                )}
                <div className="relative flex space-x-3 items-start">
                  <div>
                    <span className="h-8 w-8 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-600 shadow-sm">
                      <Clock className="w-4 h-4 text-slate-500" />
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 pt-1">
                    <div className="flex items-center justify-between">
                      <StatusBadge status={item.status} size="sm" />
                      <span className="text-xs text-slate-400 font-mono">
                        {formattedDate}
                      </span>
                    </div>

                    {item.note && (
                      <p className="mt-1 text-sm text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        {item.note}
                      </p>
                    )}

                    <div className="mt-1 text-xs text-slate-500 flex items-center">
                      <User className="w-3 h-3 mr-1 text-slate-400" />
                      <span>
                        Updated by{' '}
                        <strong className="text-slate-700">
                          {item.changedBy?.name || 'Authorized Staff'}
                        </strong>
                        {item.changedBy?.role === 'admin' && (
                          <span className="ml-1 text-amber-600 font-medium">
                            (PCMC Admin)
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
