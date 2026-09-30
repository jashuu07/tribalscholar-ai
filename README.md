# TribalScholar AI (SIH26239)
### Intelligent, Transparent and Configurable Scholarship & Fellowship Management System for Scheduled Tribes
**Ministry:** Ministry of Tribal Affairs, Government of India  
**Category:** Software | **Theme:** Smart Education | **Event:** Smart India Hackathon 2026

---

## 🏛️ Executive Summary

TribalScholar AI is an enterprise-grade digital platform engineered for the **Ministry of Tribal Affairs (MoTA)** to automate and govern the entire lifecycle of national fellowship and scholarship schemes (such as the **National Fellowship for Scheduled Tribes - NFST** and **National Overseas Scholarship - NOS**).

Unlike static scholarship websites with hardcoded criteria, TribalScholar AI is powered by a **Configurable Scholarship Management Engine** with:
1. **Deterministic Rule Engine:** Evaluates multi-variable boolean and relational criteria (`=`, `!=`, `>`, `<`, `>=`, `<=`, `IN`, `NOT IN`, `AND`, `OR`) without hardcoded business logic.
2. **AI Document Intelligence (Advisory):** OCR entity extraction and LayoutLM classification with automated cross-verification against candidate self-declarations.
3. **Human-in-the-Loop Oversight:** AI never automatically rejects a student; it flags discrepancies for officer review, deficiency issuance, or officer override with an immutable audit trail.
4. **Deficiency Rectification Workflow:** Transparent student notification, deficiency desk with exact mismatch explanation, document re-upload, automatic AI re-scan, and officer sign-off.
5. **Post-Selection Fellowship & DBT Tracking:** Monthly stipend ledger (Direct Benefit Transfer - ₹37,000/mo), annual contingency tracking, and quarterly doctoral research progress submission.

---

## ⚡ The Critical SIH Judge Demo Scenario

The prototype includes a dedicated **SIH Judge Live Demo Mode** accessible via the top navigation banner (`⚡ SIH Judge Demo`):

### The Exact Problem Scenario Simulated:
- **Candidate:** Aruna Kerketta (*Oraon Tribe, Ranchi, Jharkhand*) applying for NFST 2026.
- **Application Declaration:** Annual Family Income = **₹1,80,000**
- **Uploaded Revenue Certificate (OCR):** Extracted Income = **₹2,80,000**
- **System Display:**
  > ⚠ **POTENTIAL MISMATCH DETECTED**  
  > **Application:** ₹1,80,000  
  > **Certificate:** ₹2,80,000  
  > **Confidence:** 95%  
  > **Explanation:** *"The annual income extracted from the uploaded certificate does not match the value provided in the application."*  
  > **Status:** `REVIEW REQUIRED` *(Student is never automatically disqualified)*
- **Officer Scrutiny:** Officer Dr. Rajeshwar K. Soren reviews the advisory alert side-by-side and issues a formal deficiency request.
- **Student Resolution:** Student receives an alert, visits the **Deficiency Center**, uploads the corrected Tahasildar certificate (showing ₹1,80,000) with a clarification note.
- **AI Re-Scan:** Document Intelligence re-scans the new file with **98% confidence** and zero mismatches.
- **Rule Verification:** All 5 deterministic scheme rules pass:
  - ✓ Social Category = ST (Oraon)
  - ✓ Annual Income <= ₹6,00,000 (₹1,80,000)
  - ✓ Course Enrolled IN [PhD, MPhil] (PhD)
  - ✓ Degree Percentage >= 55% (74.5%)
  - ✓ Age <= 36 (27)
- **Officer Award:** Officer approves the application and issues the Digital Sanction Order (`TS-2026-NFST-0012`).
- **Post-Selection:** Student accesses the Fellowship Dashboard with DBT monthly credit tracking.

---

## 👥 Two Major User Experiences

### 1. Student Portal (`/student`)
- **Student Dashboard:** Active applications, verification stepper, urgent deficiency alerts, recent audit timeline.
- **Scholarship Explorer:** Browse flagship schemes (NFST 2026, NOS 2026, custom schemes).
- **Deterministic Eligibility Checker:** Interactive pre-check with sliders for income, marks, category, and age with instant pass/fail explanations.
- **Dynamic Application Wizard:** 5-step form adapting dynamically to the scheme's configured fields and required documents.
- **Deficiency Center:** Live rectification desk with side-by-side mismatch view and document re-upload with automated re-scan.
- **Post-Selection Fellowship & DBT Dashboard:** Track monthly ₹37,000 stipend credits, PFMS reference numbers, and quarterly progress reports.
- **Scholar Profile:** Domicile jurisdiction, verified ST sub-community, and Aadhaar-NPCI seeding.

### 2. Admin & Scrutiny Officer Portal (`/officer` / `/admin`)
- **Command Centre Dashboard:** 8 real-time metrics (Total Applications, Pending Verification, AI Verified, Deficient, Eligible, Ineligible, Selected, Pending Officer Review), plus charts for scheme distribution, state-wise representation, and turnaround time reduction (45 days down to 3.5 days).
- **Master Applications Registry:** Filter by scheme, status, state, search by name/application number, and export master CSV.
- **Officer Verification Queue:** Full dossier review, document checklists, and application advancement.
- **Advisory AI Review Queue:** Focused triage of flagged document discrepancies with side-by-side OCR comparison.
- **Visual Scheme Rule Builder:** Admin wizard to create or update scholarship schemes dynamically with custom operators (`=`, `!=`, `>`, `<`, `>=`, `<=`, `IN`, `NOT IN`), logical `AND`/`OR` grouping, and document requirements.
- **Merit Selection Directorate:** Dynamic ranking, cutoff threshold sliders, slot quota allocation, and digital sanction order generation.
- **Decision Intelligence & Analytics:** Breakdown of deficiency categories and operational speed improvements.
- **Forensic Audit Ledger:** Immutable audit trail with cryptographic timestamps, actor roles, actions, AI findings, and officer remarks.

---

## 🛠️ Technology Stack

- **Frontend & UI:** React 19, TypeScript, Vite 6, Tailwind CSS
- **Design System:** Government of India National Digital Portal Standards (NIC / Digital India palette, Ashoka Pillar branding, Tricolor strip, high contrast accessibility)
- **State & Local Persistence:** Reactive state machine with `localStorage` synchronization and 1-click demo state reset
- **Rule Engine:** Deterministic type-safe mathematical evaluation engine
- **Document Intelligence:** Local modular AI service abstraction ready for Tesseract / AWS Textract / Google Cloud Document AI integration
- **Icons & Visuals:** Lucide React, Canvas Confetti

---

## 🚀 Running the Application

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173/` in your browser.

3. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🏛️ Ministry Compliance Note
*This prototype has been developed strictly for the Smart India Hackathon 2026. All student records, Aadhaar numbers, and certificate identifiers are synthetic and compliant with the Digital Personal Data Protection (DPDP) Act 2023.*
