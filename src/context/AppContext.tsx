import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Scheme,
  Application,
  AuditLog,
  NotificationItem,
  ApplicationStatus,
  UploadedDocument,
  DeficiencyItem,
} from '../types';
import {
  INITIAL_SCHEMES,
  INITIAL_USERS,
  generateSeedApplications,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
} from '../data/seedData';
import { evaluateSchemeEligibility } from '../services/ruleEngine';
import { simulateAIDocumentProcessing } from '../services/aiDocService';
import { createAuditLog } from '../services/auditService';
import { createNotification } from '../services/notificationService';

interface AppContextType {
  currentUser: User;
  users: User[];
  schemes: Scheme[];
  applications: Application[];
  auditLogs: AuditLog[];
  notifications: NotificationItem[];
  currentRole: User['role'];
  language: 'EN' | 'HI';
  setLanguage: (lang: 'EN' | 'HI') => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  switchUser: (userId: string) => void;
  setRole: (role: User['role']) => void;
  
  // Scheme Management (Rule Engine Config)
  addScheme: (scheme: Scheme) => void;
  updateScheme: (scheme: Scheme) => void;
  deleteScheme: (schemeId: string) => void;

  // Application Lifecycle
  createApplication: (schemeId: string, formData: any) => Application;
  updateApplicationStatus: (
    applicationId: string,
    status: ApplicationStatus,
    officerRemarks?: string,
    score?: number
  ) => void;
  
  // Document AI & Verification
  uploadDocument: (
    applicationId: string,
    docType: string,
    file: { name: string; size: number; type: string },
    isCorrectedUpload?: boolean
  ) => void;
  officerReviewDocument: (
    applicationId: string,
    documentId: string,
    decision: 'APPROVED' | 'REJECTED' | 'DEFICIENCY_RAISED' | 'OVERRIDDEN',
    remarks: string,
    overrideReason?: string
  ) => void;

  // Deficiency Workflow
  resolveDeficiency: (
    applicationId: string,
    deficiencyId: string,
    correctionNote: string,
    correctedFileName?: string
  ) => void;

  // Audit and Notifications
  addAuditLog: (logData: Parameters<typeof createAuditLog>[0]) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  resetAllData: () => void;

  // Demo Interactive Flow Runner
  demoStep: number;
  setDemoStep: (step: number) => void;
  runDemoStep: (targetStep: number) => void;
  isDemoModalOpen: boolean;
  setIsDemoModalOpen: (open: boolean) => void;
}

const STORAGE_KEY_PREFIX = 'tribalscholar_ai_';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial data from localStorage if available, or initialize from seeds
  const [users] = useState<User[]>(INITIAL_USERS);
  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    return localStorage.getItem(`${STORAGE_KEY_PREFIX}userId`) || 'student-demo-1';
  });

  const currentUser = users.find((u) => u.id === currentUserId) || users[0];

  const [schemes, setSchemes] = useState<Scheme[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}schemes`);
    return saved ? JSON.parse(saved) : INITIAL_SCHEMES;
  });

  const [applications, setApplications] = useState<Application[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}applications`);
    return saved ? JSON.parse(saved) : generateSeedApplications();
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}auditLogs`);
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}notifications`);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [language, setLanguage] = useState<'EN' | 'HI'>('EN');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem(`${STORAGE_KEY_PREFIX}theme`) as 'light' | 'dark') || 'light';
  });
  const [demoStep, setDemoStep] = useState<number>(0);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState<boolean>(false);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem(`${STORAGE_KEY_PREFIX}theme`, next);
      return next;
    });
  };

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}theme`, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}userId`, currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}schemes`, JSON.stringify(schemes));
  }, [schemes]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}applications`, JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}auditLogs`, JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}notifications`, JSON.stringify(notifications));
  }, [notifications]);

  const switchUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setCurrentUserId(userId);
      addAuditLog({
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        action: 'USER_LOGIN',
        reason: `Switched active role to ${user.role} (${user.name})`,
      });
    }
  };

  const setRole = (role: User['role']) => {
    const user = users.find((u) => u.role === role);
    if (user) {
      switchUser(user.id);
    }
  };

  const addAuditLog = (logData: Parameters<typeof createAuditLog>[0]) => {
    const log = createAuditLog(logData);
    setAuditLogs((prev) => [log, ...prev]);
  };

  // Schemes
  const addScheme = (scheme: Scheme) => {
    setSchemes((prev) => [scheme, ...prev]);
    addAuditLog({
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      action: 'SCHEME_CREATED',
      reason: `Created new scheme: ${scheme.name} (${scheme.code}) with ${scheme.ruleGroups.length} rule groups`,
    });
  };

  const updateScheme = (scheme: Scheme) => {
    setSchemes((prev) => prev.map((s) => (s.id === scheme.id ? scheme : s)));
    addAuditLog({
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      action: 'SCHEME_UPDATED',
      reason: `Updated scheme configuration for ${scheme.code}`,
    });
  };

  const deleteScheme = (schemeId: string) => {
    setSchemes((prev) => prev.filter((s) => s.id !== schemeId));
    addAuditLog({
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      action: 'SCHEME_DELETED',
      reason: `Decommissioned scheme ${schemeId}`,
    });
  };

  // Create Application
  const createApplication = (schemeId: string, formData: any): Application => {
    const scheme = schemes.find((s) => s.id === schemeId) || schemes[0];
    const newId = `app-${scheme.code.toLowerCase()}-${Date.now().toString().slice(-4)}`;
    const appNo = `TS-2026-${scheme.code}-${Math.floor(1000 + Math.random() * 9000)}`;

    const candidateData = {
      category: 'ST',
      annualIncome: formData.annualIncome,
      educationLevel: formData.educationLevel,
      degreePercentage: formData.degreePercentage,
      age: formData.age || 26,
    };

    const eligibility = evaluateSchemeEligibility(scheme.ruleGroups, candidateData);

    const newApp: Application = {
      id: newId,
      applicationNumber: appNo,
      schemeId: scheme.id,
      schemeCode: scheme.code,
      schemeName: scheme.name,
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentEmail: currentUser.email,
      studentPhone: currentUser.phone,
      studentState: currentUser.state,
      stCommunity: currentUser.stCommunity || 'ST Tribe',
      status: 'SUBMITTED',
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      score: 82,
      formData: {
        annualIncome: formData.annualIncome,
        educationLevel: formData.educationLevel,
        degreeName: formData.degreeName || 'Post-Graduate Degree',
        universityName: formData.universityName || currentUser.university || 'Central University',
        degreePercentage: formData.degreePercentage || 70,
        age: formData.age || 26,
        stSubCaste: currentUser.stCommunity || 'ST Tribe',
        stCertificateNumber: currentUser.certificateNumber || 'ST/2025/1102',
        issuingDistrict: currentUser.district || 'Ranchi',
        issuingState: currentUser.state,
        bankAccountNumber: '98450192841',
        bankIfsc: 'SBIN0001092',
        bankName: 'State Bank of India',
        researchTitle: formData.researchTitle,
        foreignUniversity: formData.foreignUniversity,
        foreignCountry: formData.foreignCountry,
        greIeltsScore: formData.greIeltsScore,
      },
      documents: [],
      deficiencies: [],
      eligibilityEvaluation: eligibility,
      timeline: [
        {
          id: `tl-${Date.now()}-1`,
          stage: 'DRAFT',
          title: 'Draft Started',
          description: 'Candidate initialized application wizard',
          timestamp: new Date().toISOString(),
          actor: currentUser.name,
          actorRole: 'STUDENT',
        },
        {
          id: `tl-${Date.now()}-2`,
          stage: 'SUBMITTED',
          title: 'Application Submitted Online',
          description: 'Application submitted for scheme screening',
          timestamp: new Date().toISOString(),
          actor: currentUser.name,
          actorRole: 'STUDENT',
        },
      ],
    };

    setApplications((prev) => [newApp, ...prev]);

    addAuditLog({
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: 'STUDENT',
      action: 'APPLICATION_SUBMITTED',
      applicationId: newApp.id,
      applicationNumber: newApp.applicationNumber,
      reason: `Online application submitted for ${scheme.code}`,
    });

    const notif = createNotification(
      currentUser.id,
      'Application Submitted Successfully',
      `Your application ${newApp.applicationNumber} for ${scheme.name} has been received.`,
      'SUCCESS',
      newApp.id
    );
    setNotifications((prev) => [notif, ...prev]);

    return newApp;
  };

  // Upload Document with AI Processing
  const uploadDocument = (
    applicationId: string,
    docType: string,
    file: { name: string; size: number; type: string },
    isCorrectedUpload: boolean = false
  ) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== applicationId) return app;

        // Run Mock Document Intelligence OCR pipeline
        const aiResult = simulateAIDocumentProcessing({
          docType,
          fileName: file.name,
          applicationData: {
            ...app.formData,
            studentName: app.studentName,
          },
          isCorrectedUpload,
        });

        const docStatus =
          aiResult.mismatches.length > 0
            ? 'MISMATCH_DETECTED'
            : 'AI_VERIFIED';

        const newDoc: UploadedDocument = {
          id: `doc-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          docType,
          name: docType.replace(/_/g, ' '),
          fileName: file.name,
          fileSizeKB: Math.round(file.size / 1024) || 650,
          fileType: file.type || 'application/pdf',
          uploadedAt: new Date().toISOString(),
          status: docStatus,
          aiResult,
          isCorrectedUpload,
        };

        const updatedDocs = app.documents.filter((d) => d.docType !== docType);
        updatedDocs.push(newDoc);

        // Timeline event
        const timelineEvent = {
          id: `tl-${Date.now()}`,
          stage: app.status,
          title: isCorrectedUpload ? `Corrected Document Uploaded: ${newDoc.name}` : `Document Uploaded: ${newDoc.name}`,
          description: aiResult.mismatches.length > 0
            ? `AI OCR flagged ${aiResult.mismatches.length} potential mismatch. Advisory confidence: ${aiResult.confidence}%.`
            : `AI OCR verified document with ${aiResult.confidence}% confidence.`,
          timestamp: new Date().toISOString(),
          actor: isCorrectedUpload ? app.studentName : 'TribalScholar AI OCR Engine',
          actorRole: isCorrectedUpload ? 'STUDENT' : 'SYSTEM_AI',
        };

        return {
          ...app,
          documents: updatedDocs,
          timeline: [...app.timeline, timelineEvent as any],
          updatedAt: new Date().toISOString(),
        };
      })
    );

    addAuditLog({
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      action: isCorrectedUpload ? 'DOCUMENT_CORRECTION_UPLOADED' : 'DOCUMENT_UPLOADED',
      applicationId,
      reason: `Uploaded ${docType} (${file.name})`,
    });
  };

  // Officer Review on Document
  const officerReviewDocument = (
    applicationId: string,
    documentId: string,
    decision: 'APPROVED' | 'REJECTED' | 'DEFICIENCY_RAISED' | 'OVERRIDDEN',
    remarks: string,
    overrideReason?: string
  ) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== applicationId) return app;

        let newAppStatus = app.status;
        const deficiencies = [...app.deficiencies];

        const updatedDocs = app.documents.map((doc) => {
          if (doc.id !== documentId) return doc;

          let docStatus: UploadedDocument['status'] = doc.status;
          if (decision === 'APPROVED' || decision === 'OVERRIDDEN') {
            docStatus = 'OFFICER_APPROVED';
          } else if (decision === 'REJECTED') {
            docStatus = 'OFFICER_REJECTED';
          } else if (decision === 'DEFICIENCY_RAISED') {
            docStatus = 'MISMATCH_DETECTED';
            newAppStatus = 'DEFICIENCY';

            // Add open deficiency
            deficiencies.push({
              id: `def-${Date.now()}`,
              documentId: doc.id,
              docType: doc.docType,
              title: `Deficiency on ${doc.name}`,
              description: remarks,
              severity: 'CRITICAL',
              createdAt: new Date().toISOString(),
              status: 'OPEN',
              officerRemarks: remarks,
            });
          }

          return {
            ...doc,
            status: docStatus,
            officerReview: {
              officerId: currentUser.id,
              officerName: currentUser.name,
              reviewedAt: new Date().toISOString(),
              decision,
              remarks,
              overrideReason,
            },
          };
        });

        // Timeline event
        const timelineEvent = {
          id: `tl-${Date.now()}`,
          stage: newAppStatus,
          title: `Officer Scrutiny: ${decision.replace(/_/g, ' ')}`,
          description: `${currentUser.name} (${currentUser.role}): ${remarks}${overrideReason ? ` | Override: ${overrideReason}` : ''}`,
          timestamp: new Date().toISOString(),
          actor: currentUser.name,
          actorRole: currentUser.role,
        };

        return {
          ...app,
          status: newAppStatus,
          documents: updatedDocs,
          deficiencies,
          timeline: [...app.timeline, timelineEvent as any],
          updatedAt: new Date().toISOString(),
        };
      })
    );

    addAuditLog({
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      action: `OFFICER_DOCUMENT_${decision}`,
      applicationId,
      documentId,
      officerDecision: decision,
      reason: remarks,
    });

    if (decision === 'DEFICIENCY_RAISED') {
      const targetApp = applications.find((a) => a.id === applicationId);
      if (targetApp) {
        const notif = createNotification(
          targetApp.studentId,
          `⚠️ Deficiency Raised on Application ${targetApp.applicationNumber}`,
          `Verification Officer has requested document correction: ${remarks}`,
          'ALERT',
          applicationId,
          '/student/deficiency'
        );
        setNotifications((prev) => [notif, ...prev]);
      }
    }
  };

  // Resolve Deficiency
  const resolveDeficiency = (
    applicationId: string,
    deficiencyId: string,
    correctionNote: string,
    correctedFileName: string = 'Corrected_Revenue_Income_Certificate_2026.pdf'
  ) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== applicationId) return app;

        const targetDef = app.deficiencies.find((d) => d.id === deficiencyId);
        const docType = targetDef ? targetDef.docType : 'INCOME_CERTIFICATE';

        // Re-run AI OCR on corrected upload - now it matches application income ₹180,000!
        const aiResult = simulateAIDocumentProcessing({
          docType,
          fileName: correctedFileName,
          applicationData: {
            ...app.formData,
            studentName: app.studentName,
          },
          isCorrectedUpload: true,
        });

        // Mark deficiency resolved
        const updatedDeficiencies = app.deficiencies.map((d) =>
          d.id === deficiencyId
            ? {
                ...d,
                status: 'RESOLVED' as const,
                resolvedAt: new Date().toISOString(),
                studentCorrectionNote: correctionNote,
              }
            : d
        );

        // Update document
        const updatedDocs = app.documents.map((d) => {
          if (d.docType === docType) {
            return {
              ...d,
              fileName: correctedFileName,
              uploadedAt: new Date().toISOString(),
              status: 'AI_VERIFIED' as const,
              aiResult,
              isCorrectedUpload: true,
            };
          }
          return d;
        });

        const timelineEvent = {
          id: `tl-${Date.now()}`,
          stage: 'RE_SUBMITTED' as const,
          title: 'Deficiency Corrected & Re-Submitted',
          description: `Student uploaded revised document with note: "${correctionNote}". AI OCR re-verified with 98% match and zero discrepancies.`,
          timestamp: new Date().toISOString(),
          actor: app.studentName,
          actorRole: 'STUDENT' as const,
        };

        return {
          ...app,
          status: 'RE_SUBMITTED',
          deficiencies: updatedDeficiencies,
          documents: updatedDocs,
          timeline: [...app.timeline, timelineEvent as any],
          updatedAt: new Date().toISOString(),
        };
      })
    );

    addAuditLog({
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: 'STUDENT',
      action: 'DEFICIENCY_RESOLVED',
      applicationId,
      reason: `Candidate provided corrected document: ${correctionNote}`,
    });

    const notif = createNotification(
      'OFFICER',
      `Deficiency Responded: ${applicationId}`,
      `Candidate has re-submitted corrected document. AI re-verification passed. Ready for final officer scrutiny.`,
      'INFO',
      applicationId,
      '/officer/verification'
    );
    setNotifications((prev) => [notif, ...prev]);
  };

  // Update Status
  const updateApplicationStatus = (
    applicationId: string,
    status: ApplicationStatus,
    officerRemarks?: string,
    score?: number
  ) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== applicationId) return app;

        // If moved to POST_SELECTION, instantiate fellowship details
        let fellowshipDetails = app.fellowshipDetails;
        if (status === 'POST_SELECTION' && !fellowshipDetails) {
          fellowshipDetails = {
            fellowshipAwardNumber: `MOTA/${app.schemeCode}/2026/AW-${Math.floor(1000 + Math.random() * 9000)}`,
            awardDate: new Date().toISOString().split('T')[0],
            tenureYears: 5,
            monthlyStipend: 37000,
            annualContingency: 25000,
            totalSanctioned: 2345000,
            totalDisbursed: 74000,
            universityName: app.formData.universityName,
            researchTopic: app.formData.researchTitle || 'Tribal Development Research',
            guideName: app.formData.mentorName || 'Senior Research Supervisor',
            disbursements: [
              {
                month: 'April 2026',
                amount: 37000,
                status: 'CREDITED',
                transactionId: `DBT202604${Math.floor(100000 + Math.random() * 900000)}`,
                disbursedDate: '2026-04-10',
              },
              {
                month: 'May 2026',
                amount: 37000,
                status: 'CREDITED',
                transactionId: `DBT202605${Math.floor(100000 + Math.random() * 900000)}`,
                disbursedDate: '2026-05-10',
              },
              {
                month: 'June 2026',
                amount: 37000,
                status: 'PROCESSING',
                disbursedDate: 'Expected 2026-06-10',
              },
            ],
            quarterlyReports: [
              {
                id: `qr-${Date.now()}-1`,
                quarter: 'Q1 (Jan - Mar 2026)',
                academicYear: '2026-27',
                title: 'Literature Review and Field Survey in Tribal Blocks',
                status: 'APPROVED',
                submittedDate: '2026-03-25',
                mentorName: app.formData.mentorName || 'Research Supervisor',
                mentorRemarks: 'Excellent progress. Research methodology meets doctoral standards.',
                publicationsCount: 1,
              },
            ],
          };
        }

        const timelineEvent = {
          id: `tl-${Date.now()}`,
          stage: status,
          title: `Status Changed to ${status.replace(/_/g, ' ')}`,
          description: officerRemarks || `Application pipeline advanced to ${status}`,
          timestamp: new Date().toISOString(),
          actor: currentUser.name,
          actorRole: currentUser.role,
        };

        return {
          ...app,
          status,
          score: score !== undefined ? score : app.score,
          officerRemarks: officerRemarks || app.officerRemarks,
          fellowshipDetails,
          timeline: [...app.timeline, timelineEvent as any],
          updatedAt: new Date().toISOString(),
        };
      })
    );

    addAuditLog({
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      action: `APPLICATION_STATUS_${status}`,
      applicationId,
      officerDecision: status,
      reason: officerRemarks || `Status changed to ${status}`,
    });

    const targetApp = applications.find((a) => a.id === applicationId);
    if (targetApp) {
      const notif = createNotification(
        targetApp.studentId,
        `Application Status Update: ${status.replace(/_/g, ' ')}`,
        `Your application ${targetApp.applicationNumber} has moved to ${status.replace(/_/g, ' ')}. ${officerRemarks || ''}`,
        status === 'SELECTED' ? 'SUCCESS' : 'INFO',
        applicationId,
        status === 'POST_SELECTION' ? '/student/fellowship' : `/student/applications/${applicationId}`
      );
      setNotifications((prev) => [notif, ...prev]);
    }
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const resetAllData = () => {
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}schemes`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}applications`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}auditLogs`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}notifications`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}userId`);

    setSchemes(INITIAL_SCHEMES);
    setApplications(generateSeedApplications());
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setCurrentUserId('student-demo-1');
    setDemoStep(0);
  };

  // Automated step driver for live SIH demonstration
  const runDemoStep = (targetStep: number) => {
    setDemoStep(targetStep);

    // Step 1: Admin scheme configuration
    if (targetStep === 1) {
      switchUser('admin-1');
    }
    // Step 2 & 3: Student portal & document mismatch
    else if (targetStep === 2 || targetStep === 3) {
      switchUser('student-demo-1');
    }
    // Step 4: AI flags mismatch in Income Cert
    else if (targetStep === 4) {
      switchUser('officer-1');
    }
    // Step 5: Officer reviews AI alert and raises deficiency
    else if (targetStep === 5) {
      switchUser('officer-1');
      officerReviewDocument(
        'app-demo-nfst-0012',
        'doc-demo-income',
        'DEFICIENCY_RAISED',
        'Income discrepancy detected: Self-declaration says ₹1,80,000 whereas Revenue Certificate states ₹2,80,000. Please upload the valid corrected certificate.'
      );
    }
    // Step 6: Student views deficiency and uploads corrected document
    else if (targetStep === 6) {
      switchUser('student-demo-1');
      resolveDeficiency(
        'app-demo-nfst-0012',
        'def-001',
        'Uploaded renewed and verified Revenue Certificate from Tahasildar showing gross family income of ₹1,80,000. Previous upload had mistaken joint family valuation.'
      );
    }
    // Step 7: Officer reviews corrected document and approves
    else if (targetStep === 7) {
      switchUser('officer-1');
      officerReviewDocument(
        'app-demo-nfst-0012',
        'doc-demo-income',
        'APPROVED',
        'Corrected revenue certificate verified with 98% AI confidence. Annual income verified at ₹1,80,000. Meets scheme income criteria (<= ₹6,00,000).'
      );
      updateApplicationStatus(
        'app-demo-nfst-0012',
        'ELIGIBILITY_CHECK',
        'Document verification passed. Evaluating deterministic eligibility rules.'
      );
    }
    // Step 8: Final Merit Screening and Selection
    else if (targetStep === 8) {
      switchUser('officer-1');
      updateApplicationStatus(
        'app-demo-nfst-0012',
        'SELECTED',
        'Candidate selected under NFST-2026 National Merit Quota (Rank #14, Merit Score 88/100). Sanction Order issued.',
        88
      );
    }
    // Step 9: Post-Selection & Fellowship Management
    else if (targetStep === 9) {
      switchUser('student-demo-1');
      updateApplicationStatus(
        'app-demo-nfst-0012',
        'POST_SELECTION',
        'Fellowship award activated. Direct Benefit Transfer (DBT) monthly stipend and annual contingency initiated.'
      );
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        schemes,
        applications,
        auditLogs,
        notifications,
        currentRole: currentUser.role,
        language,
        setLanguage,
        switchUser,
        setRole,
        addScheme,
        updateScheme,
        deleteScheme,
        createApplication,
        updateApplicationStatus,
        uploadDocument,
        officerReviewDocument,
        resolveDeficiency,
        addAuditLog,
        markNotificationRead,
        clearNotifications,
        resetAllData,
        demoStep,
        setDemoStep,
        runDemoStep,
        isDemoModalOpen,
        setIsDemoModalOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
