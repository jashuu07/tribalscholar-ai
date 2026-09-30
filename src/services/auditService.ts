import { AuditLog, UserRole } from '../types';

export function createAuditLog(entry: {
  userId: string;
  userName: string;
  userRole: UserRole | 'SYSTEM_AI';
  action: string;
  applicationId?: string;
  applicationNumber?: string;
  documentId?: string;
  aiFinding?: string;
  officerDecision?: string;
  reason?: string;
}): AuditLog {
  return {
    id: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    userId: entry.userId,
    userName: entry.userName,
    userRole: entry.userRole,
    action: entry.action,
    applicationId: entry.applicationId,
    applicationNumber: entry.applicationNumber,
    documentId: entry.documentId,
    aiFinding: entry.aiFinding,
    officerDecision: entry.officerDecision,
    reason: entry.reason,
    ipAddress: '10.244.18.91 (NIC-GovNet)',
  };
}
