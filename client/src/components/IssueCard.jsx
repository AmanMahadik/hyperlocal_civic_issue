import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import { ThumbsUp, MapPin, Calendar, Building, MessageSquare } from 'lucide-react';

export default function IssueCard({ issue, onUpvote, hasUpvoted = false }) {
  const imageUrl =
    issue.images && issue.images.length > 0
      ? issue.images[0].url
      : 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=600&auto=format&fit=crop&q=60';

  const formattedDate = new Date(issue.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between">
      <div>
        {/* Image Thumbnail & Overlays */}
        <div className="relative h-48 bg-slate-100 overflow-hidden group">
          <img
            src={imageUrl}
            alt={issue.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            onError={(e) => {
              e.target.src =
                'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=600&auto=format&fit=crop&q=60';
            }}
          />
          <div className="absolute top-2.5 left-2.5">
            <StatusBadge status={issue.status} />
          </div>
          <div className="absolute top-2.5 right-2.5">
            <PriorityBadge priority={issue.priority} />
          </div>
        </div>

        {/* Content Details */}
        <div className="p-4">
          <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1.5 font-medium">
            <span className="text-pcmc-700 bg-pcmc-50 px-2 py-0.5 rounded">
              {issue.category?.name || 'Civic Issue'}
            </span>
            <span>•</span>
            <span className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {formattedDate}
            </span>
          </div>

          <Link to={`/issues/${issue._id}`}>
            <h3 className="font-semibold text-slate-900 text-base line-clamp-1 hover:text-pcmc-600 transition">
              {issue.title}
            </h3>
          </Link>

          <p className="text-sm text-slate-600 mt-1 line-clamp-2">
            {issue.description}
          </p>

          <div className="mt-3 flex items-center text-xs text-slate-500 space-x-3">
            <div className="flex items-center truncate">
              <MapPin className="w-3.5 h-3.5 text-slate-400 mr-1 flex-shrink-0" />
              <span className="truncate">
                {issue.ward ? `Ward ${issue.ward.number} (${issue.ward.name})` : 'PCMC Area'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer / Actions */}
      <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
        <button
          onClick={() => onUpvote && onUpvote(issue._id)}
          className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
            hasUpvoted
              ? 'bg-pcmc-600 text-white'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <ThumbsUp className="w-3.5 h-3.5" />
          <span>{issue.upvoteCount || 0}</span>
          <span className="hidden sm:inline">Upvote</span>
        </button>

        <Link
          to={`/issues/${issue._id}`}
          className="text-pcmc-600 hover:text-pcmc-700 font-medium hover:underline inline-flex items-center"
        >
          Track Progress &rarr;
        </Link>
      </div>
    </div>
  );
}
