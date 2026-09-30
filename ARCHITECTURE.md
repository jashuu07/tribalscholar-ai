# TribalScholar AI: Architecture & System Design
**SIH Problem Statement:** SIH26239 – Intelligent Digital Platform for Scholarship/Fellowship Management  
**Ministry:** Ministry of Tribal Affairs, Government of India  
**Theme:** Smart Education | **Category:** Software  

---

## 1. High-Level Architecture Overview

TribalScholar AI is built with an enterprise multi-tier modular architecture designed for high availability, strict role-based access control (RBAC), deterministic rule evaluation, explainable document intelligence, and immutable auditing.

```
                      +---------------------------------------+
                      |         CLIENT TIER (React 19)        |
                      |  - Public Portal & Scheme Discovery   |
                      |  - Student Portal & Application Flow  |
                      |  - Officer & Admin Command Center     |
                      |  - SIH Judge Live Guided Demo Console |
                      +---------------------------------------+
                                          |
                                          v (REST / JSON API)
                      +---------------------------------------+
                      |        APPLICATION SERVICE TIER       |
                      |  - Authentication & RBAC Service      |
                      |  - Configurable Scheme Engine         |
                      |  - Deterministic Rule Engine          |
                      |  - AI Document Intelligence Abstraction|
                      |  - Deficiency & Communication Service |
                      |  - Merit Ranking & Selection Engine   |
                      |  - Post-Selection & DBT Ledger Service|
                      |  - Forensic Audit Logging Service     |
                      +---------------------------------------+
                                          |
                                          v
                      +---------------------------------------+
                      |        DATA & PERSISTENCE TIER        |
                      |  - PostgreSQL Relational Core Schema  |
                      |  - Document Vault (Encrypted Storage) |
                      |  - Immutable Audit Event Ledger       |
                      +---------------------------------------+
```

---

## 2. Core Subsystems

### A. Configurable Scheme Engine
- Decouples scheme definition from code.
- Administrators can declare schemes (e.g. `NFST-2026`, `NOS-2026`, `PMRF-ST-2026`) with dynamic eligibility criteria, required documents, slots, and stipend structures.
- Forms and validation pipelines adapt dynamically to the scheme's schema.

### B. Deterministic Rule Engine
- **Supported Operators:** `=`, `!=`, `>`, `<`, `>=`, `<=`, `IN`, `NOT IN`, with nested `AND` and `OR` boolean evaluation groups.
- Evaluates declared candidate fields against numerical, categoric, or list-based thresholds.
- **Explainability:** Produces human-friendly explanations for every rule (`PASS`, `FAIL`, `REVIEW REQUIRED`).
- **Safety Policy:** Non-deterministic LLM agents are strictly prevented from executing automated disqualification. Only the deterministic mathematical engine evaluates eligibility.

### C. AI Document Intelligence Service (Modular Abstraction)
- **Pipeline:** Upload $\rightarrow$ Document Classification $\rightarrow$ OCR $\rightarrow$ Key Entity Extraction $\rightarrow$ Normalization $\rightarrow$ Cross-Check against Form $\rightarrow$ Confidence Scoring $\rightarrow$ Advisory Human Triage.
- **Plug-and-Play Interface:** Abstracted behind `AIDocumentService`, ready to connect to Tesseract OCR, Google Cloud Document AI, AWS Textract, or sovereign Indian OCR APIs.
- **Demo Mode:** Integrated with a local deterministic OCR simulator to demonstrate realistic extraction and mismatch detection without external API dependencies.

### D. Human-in-the-Loop Scrutiny & Deficiency Workflow
- When OCR entities diverge from application inputs (e.g., Application declared income ₹1,80,000 vs Certificate extracted ₹2,80,000), the system flags a **POTENTIAL MISMATCH** with 95% confidence and status **REVIEW REQUIRED**.
- **Student Protection Policy:** The system never automatically rejects the student. A verification officer evaluates the alert, requests clarification, or issues a deficiency.
- **Deficiency Loop:** Student is alerted $\rightarrow$ sees exact issue $\rightarrow$ uploads corrected certificate $\rightarrow$ AI re-scans (98% match) $\rightarrow$ Officer signs off $\rightarrow$ application proceeds to screening.

### E. Post-Selection Fellowship & DBT Ledger
- Tracks Direct Benefit Transfer (DBT) monthly stipends (₹37,000/mo JRF) and annual contingency allocations.
- Aadhaar-NPCI bank seeding status indicators.
- Quarterly research progress report submission with research supervisor endorsement.

---

## 3. Five Demo Personas & RBAC Matrix

| Role | Demo User | Capabilities |
| :--- | :--- | :--- |
| **Student** | Aruna Kerketta | Discover schemes, eligibility pre-check, apply, upload documents, resolve deficiencies, track DBT |
| **Verification Officer** | Ananya Marandi | Inspect OCR extractions, triage mismatches, raise deficiencies, approve/reject documents |
| **Selection Officer** | Dr. Rajeshwar K. Soren | Merit ranking, set cutoff thresholds, allocate quota slots, generate digital sanction orders |
| **Administrator** | Smt. Sushmita Minz, IAS | Create and configure schemes, build visual eligibility rules, manage document checklists |
| **Super Admin** | Mission Director, MoTA | Global audit logs, analytics, system parameters, emergency controls |

---

## 4. Government Standards & Disclaimers

> **Important Government Integration Disclosure:**  
> This application is an SIH 2026 prototype. All candidate records, Aadhaar numbers, and certificate identifiers are synthetic. The application does not claim live connection to production NIC, DBT, or Aadhaar gateways.
