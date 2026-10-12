const ROLES = {
  CITIZEN: 'citizen',
  ADMIN: 'admin',
  SUPERADMIN: 'superadmin'
};

const STATUSES = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
  ASSIGNED: 'assigned',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
  REOPENED: 'reopened'
};

const PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

// Valid status transitions
const ALLOWED_TRANSITIONS = {
  pending: ['verified', 'rejected'],
  verified: ['assigned', 'rejected'],
  assigned: ['in_progress', 'rejected'],
  in_progress: ['resolved'],
  resolved: ['closed', 'reopened'],
  reopened: ['assigned', 'in_progress'],
  rejected: [],
  closed: []
};

module.exports = {
  ROLES,
  STATUSES,
  PRIORITIES,
  ALLOWED_TRANSITIONS
};
