import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
  Eye,
  Sparkles,
  Download,
} from 'lucide-react';

export const StudentDocumentsView: React.FC = () => {
  const { currentUser, applications } = useApp();

  const userApp = applications.find((a) => a.studentId === currentUser.id) || applications[0];
  const [selectedDoc, setSelectedDoc] = useState(userApp.documents[0]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-200">
              Document Vault
            </span>
            <span className="text-xs text-slate-500 font-mono">App #{userApp.applicationNumber}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
            Uploaded Verification Credentials & AI OCR Records
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Transparently inspect OCR extraction accuracy, confidence scores, and officer verification decisions.
          </p>
        </div>

        <span className="text-xs font-bold text-gov-navy bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
          {userApp.documents.length} Uploaded Files
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Documents List */}
        <div className="space-y-2.5">
          {userApp.documents.map((doc) => (
            <div
              key={doc.id}
              onClick={() => setSelectedDoc(doc)}
              className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                selectedDoc?.id === doc.id
                  ? 'bg-blue-50/80 border-gov-blue ring-2 ring-blue-300/30 shadow-xs'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">{doc.name}</span>
                <StatusBadge status={doc.status} size="sm" />
              </div>
              <div className="text-[11px] text-slate-500 font-mono mt-1">
                {doc.fileName} ({doc.fileSizeKB} KB)
              </div>
              {doc.aiResult?.mismatches && doc.aiResult.mismatches.length > 0 && (
                <div className="mt-2 text-[10px] text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded flex items-center gap-1 w-fit">
                  <AlertTriangle className="w-3 h-3 text-amber-600" />
                  <span>Mismatch Flagged</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right 2 Columns: Inspection Preview */}
        <div className="md:col-span-2 space-y-4">
          {selectedDoc ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedDoc.name}</h3>
                  <span className="text-xs text-slate-500 font-mono">{selectedDoc.fileName}</span>
                </div>
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                  AI Confidence: {selectedDoc.aiResult?.confidence || 95}%
                </span>
              </div>

              {/* Mismatch Alert if any */}
              {selectedDoc.aiResult?.mismatches && selectedDoc.aiResult.mismatches.length > 0 && (
                <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-950 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Advisory Discrepancy Detected</span>
                  </div>
                  <p>{selectedDoc.aiResult.mismatches[0].explanation}</p>
                </div>
              )}

              {/* Extracted Fields Matrix */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Structured Entities Extracted by OCR
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(selectedDoc.aiResult?.extractedFields || {}).map(([k, v]) => (
                    <div key={k} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">{k}</span>
                      <span className="font-bold text-slate-800">
                        {typeof v === 'number' ? `₹${v.toLocaleString('en-IN')}` : String(v)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Raw OCR Text Snippet */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Raw OCR Visual Extraction
                </h4>
                <div className="bg-slate-900 text-slate-100 p-3.5 rounded-xl font-mono text-[11px] leading-relaxed overflow-x-auto">
                  <pre>{selectedDoc.aiResult?.ocrSnippet || 'Document text extracted.'}</pre>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
