# TribalScholar AI: Relational Database Architecture
**Ministry:** Ministry of Tribal Affairs, Government of India (SIH26239)

---

## 1. Schema Overview

The database is designed in 3NF (Third Normal Form) for PostgreSQL, supporting high-throughput transactions, document metadata storage, multi-stage scrutiny workflows, and immutable audit trails.

The full SQL DDL script is located at [`src/db/schema.sql`](file:///Users/jaswanthchirumamilla/Downloads/scholar%20-Ai/src/db/schema.sql).

---

## 2. Core Entity Relationship Summary

```
                      +-------------------+
                      |       users       |
                      +-------------------+
                       /        |        \
                      /         |         \
           +-------------+      |      +------------+
           |  students   |      |      |  officers  |
           +-------------+      |      +------------+
                  |             |             |
                  v             |             v
          +--------------+      |      +-------------+
          | applications |<-----+      |   reviews   |
          +--------------+             +-------------+
            /     |      \                    ^
           /      |       \                   |
          v       v        v                  |
   +-----------+ +----+ +--------------+      |
   | documents | | QR | | deficiencies |------+
   +-----------+ +----+ +--------------+
        |
        v
+----------------------+
| document_extractions |
+----------------------+
```

---

## 3. Key Tables & Descriptions

1. **`users`**: Base identity entity storing credentials, role reference, full name, domicile state, and account status.
2. **`roles`**: RBAC definition (`ROLE_STUDENT`, `ROLE_VERIFIER`, `ROLE_SELECTION`, `ROLE_ADMIN`, `ROLE_SUPER_ADMIN`).
3. **`students`**: Extended scholar identity including ST sub-tribe, certificate number, masked Aadhaar reference, declared income, and bank IFSC.
4. **`officers`**: Extended officer profile including designation, department, employee code, and assigned state jurisdiction.
5. **`schemes`**: Configurable scholarship schemes (code, name, quotas, stipends, dates, category).
6. **`scheme_rules`**: Deterministic rule sets with field key, operator (`=`, `<=`, `>=`, `IN`, etc.), and threshold values.
7. **`scheme_documents`**: Dynamic required/optional document specifications for each scheme.
8. **`applications`**: Master lifecycle entity tracking status from `DRAFT` to `POST_SELECTION`.
9. **`documents`**: Uploaded file metadata, hash (SHA-256), and verification status.
10. **`document_extractions`**: Raw OCR snippets and structured key-value entities extracted by AI.
11. **`document_verifications`**: Cross-check comparisons between application declared values and document extracted values.
12. **`deficiencies`**: Formal clarification requests with severity (`CRITICAL`, `MODERATE`) and resolution status (`OPEN`, `RESPONDED`, `RESOLVED`).
13. **`selection_results`**: Merit ranking, composite scores, and digital sanction order references.
14. **`fellowships`**: Post-selection DBT ledger, monthly disbursements, and annual contingency grants.
15. **`audit_logs`**: Immutable forensic log recording every actor, action, timestamp, AI finding, and officer decision.
