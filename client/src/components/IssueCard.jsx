import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import { ThumbsUp, MapPin, Calendar, Building, MessageSquare, ExternalLink } from 'lucide-react';

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
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between group">
      <div>
        {/* Image Thumbnail & Overlays */}
        <div className="relative h-48 bg-slate-100 overflow-hidden">
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
        <div className="p-4 space-y-2">
          {/* Reference ID & Date */}
          <div className="flex items-center justify-between text-[11px] text-[#64748B]">
            <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-[#245D9C] font-semibold">
              ID: {issue._id.substring(issue._id.length - 8).toUpperCase()}
            </span>
            <span className="flex items-center">
              <Calendar className="w-3 h-3 mr-1 text-slate-400" />
              {formattedDate}
            </span>
          </div>

          <Link to={`/issues/${issue._id}`}>
            <h3 className="font-bold text-[#15171D] text-sm line-clamp-1 group-hover:text-[#245D9C] transition">
              {issue.title}
            </h3>
          </Link>

          <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed">
            {issue.description}
          </p>

          <div className="flex items-center text-xs text-slate-500 space-x-2 pt-1">
            <span className="px-2 py-0.5 rounded bg-[#e9f1fa] text-[#245D9C] font-semibold text-[11px] truncate">
              {issue.category?.name || 'Civic Issue'}
            </span>
            <span className="truncate flex items-center text-[11px]">
              <MapPin className="w-3 h-3 text-slate-400 mr-1 flex-shrink-0" />
              {issue.ward ? `Ward ${issue.ward.number}` : 'PCMC Area'}
            </span>
          </div>
        </div>
      </div>

      {/* Footer / Actions */}
      <div className="px-4 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs">
        <button
          onClick={() => onUpvote && onUpvote(issue._id)}
          className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-bold transition ${
            hasUpvoted
              ? 'bg-[#245D9C] text-white'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <ThumbsUp className="w-3.5 h-3.5" />
          <span>{issue.upvoteCount || 0}</span>
          <span className="hidden sm:inline">Upvote</span>
        </button>

        <Link
          to={`/issues/${issue._id}`}
          className="text-[#245D9C] hover:text-[#1a4778] font-bold inline-flex items-center"
        >
          <span>Track Status</span>
          <ExternalLink className="w-3.5 h-3.5 ml-1" />
        </Link>
      </div>
    </div>
  );
}
