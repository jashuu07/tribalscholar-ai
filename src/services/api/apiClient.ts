/**
 * TribalScholar AI: REST API Service Layer
 * Abstracts backend operations for Schemes, Applications, OCR Document Intelligence,
 * Deficiencies, Selection, and Forensic Audit Trails.
 * Ready for production API decoupling (VITE_API_URL).
 */

import { Application, Scheme, AuditLog, NotificationItem, User, DocumentVerificationAI } from '../../types';
import { simulateAIDocumentProcessing } from '../aiDocService';
import { evaluateSchemeEligibility } from '../ruleEngine';

const API_BASE = import.meta.env.VITE_API_URL || '';

export const apiClient = {
  // Authentication & Session
  async getCurrentUser(users: User[], userId: string): Promise<User | undefined> {
    return users.find((u) => u.id === userId);
  },

  // Scheme Operations
  async getSchemes(schemes: Scheme[]): Promise<Scheme[]> {
    return schemes;
  },

  async evaluateEligibility(scheme: Scheme, candidateData: Record<string, any>) {
    return evaluateSchemeEligibility(scheme.ruleGroups, candidateData);
  },

  // Document AI Pipeline
  async processDocumentOCR(params: {
    docType: string;
    fileName: string;
    applicationData: Record<string, any>;
    isCorrectedUpload?: boolean;
  }): Promise<DocumentVerificationAI> {
    // In production: fetch(`${API_BASE}/api/v1/documents/process-ocr`, { method: 'POST', body: formData })
    return simulateAIDocumentProcessing(params);
  },

  // Applications
  async getApplications(applications: Application[]): Promise<Application[]> {
    return applications;
  },

  async getApplicationById(applications: Application[], id: string): Promise<Application | undefined> {
    return applications.find((a) => a.id === id);
  },
};
