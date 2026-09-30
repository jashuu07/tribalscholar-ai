# TribalScholar AI: REST API Documentation
**Ministry:** Ministry of Tribal Affairs, Government of India (SIH26239)

---

## 1. Authentication & RBAC

All protected endpoints require a Bearer token or session cookie.

```
POST /api/v1/auth/login
POST /api/v1/auth/switch-role  (Demo Persona Switcher)
GET  /api/v1/auth/me
```

---

## 2. Schemes & Configurable Rules

```
GET    /api/v1/schemes                 # List active schemes
GET    /api/v1/schemes/:id             # Scheme details + rule tree
POST   /api/v1/schemes                 # Create scheme (Admin only)
PUT    /api/v1/schemes/:id             # Update scheme & rules (Admin only)
DELETE /api/v1/schemes/:id             # Decommission scheme (Admin only)
POST   /api/v1/schemes/:id/evaluate    # Evaluate candidate parameters against rule engine
```

**Evaluate Request Payload:**
```json
{
  "schemeId": "scheme-nfst-2026",
  "candidateData": {
    "category": "ST",
    "annualIncome": 180000,
    "educationLevel": "PhD",
    "degreePercentage": 74.5,
    "age": 27
  }
}
```

---

## 3. Applications

```
GET  /api/v1/applications              # List applications (Filterable by scheme, status, state)
POST /api/v1/applications              # Submit application (Student)
GET  /api/v1/applications/:id          # Complete application dossier
PUT  /api/v1/applications/:id/status   # Advance status (Officer only)
```

---

## 4. Document Intelligence & OCR

```
POST /api/v1/applications/:id/documents/upload      # Upload file + trigger AI OCR pipeline
GET  /api/v1/documents/:id/ocr                      # Get extracted fields & confidence
POST /api/v1/documents/:id/officer-review           # Officer decision (APPROVED, REJECTED, DEFICIENCY, OVERRIDE)
```

---

## 5. Deficiencies

```
GET  /api/v1/deficiencies               # List deficiencies
POST /api/v1/deficiencies/:id/resolve   # Student re-uploads corrected document + response note
```

---

## 6. Selection & Fellowship DBT

```
GET  /api/v1/selection/merit-list       # Ranked candidates by composite score
POST /api/v1/selection/bulk-sanction    # Issue fellowship sanction orders
GET  /api/v1/fellowship/:appId          # Monthly DBT disbursement ledger
POST /api/v1/fellowship/quarterly-report # Submit quarterly progress report
```

---

## 7. Audit Logs & Analytics

```
GET /api/v1/audit/logs                  # Immutable forensic audit trail
GET /api/v1/analytics/overview          # KPI counters, charts, turnaround time metrics
```
