-- ============================================================================
-- TribalScholar AI: Relational Database Schema (PostgreSQL)
-- Ministry of Tribal Affairs, Government of India (SIH26239)
-- Designed for High Scalability, Strict RBAC, and Immutable Audit Trails
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. ROLES & USERS
-- ----------------------------------------------------------------------------
CREATE TABLE roles (
    id VARCHAR(32) PRIMARY KEY,
    name VARCHAR(64) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO roles (id, name, description) VALUES
('ROLE_STUDENT', 'Student', 'Tribal applicant seeking scholarship or doctoral fellowship'),
('ROLE_VERIFIER', 'Verification Officer', 'Scrutiny officer reviewing document OCR extraction and issuing deficiencies'),
('ROLE_SELECTION', 'Selection Officer', 'Directorate officer reviewing merit rankings and sanctioning quotas'),
('ROLE_ADMIN', 'Administrator', 'Scheme configuration and rule engine governance admin'),
('ROLE_SUPER_ADMIN', 'Super Admin', 'Ministry Mission Director with system-wide oversight');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(32),
    role_id VARCHAR(32) NOT NULL REFERENCES roles(id),
    state VARCHAR(128) NOT NULL,
    district VARCHAR(128),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role_id);

-- ----------------------------------------------------------------------------
-- 2. SCHOLARS & OFFICERS EXTENDED PROFILES
-- ----------------------------------------------------------------------------
CREATE TABLE students (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    st_sub_caste VARCHAR(128) NOT NULL,
    st_certificate_number VARCHAR(128) NOT NULL,
    issuing_authority VARCHAR(255) NOT NULL,
    aadhaar_vault_token VARCHAR(255), -- Tokenized reference, never raw Aadhaar
    aadhaar_masked VARCHAR(16) NOT NULL,
    annual_family_income NUMERIC(14, 2) NOT NULL,
    highest_qualification VARCHAR(64) NOT NULL,
    enrolled_university VARCHAR(255) NOT NULL,
    bank_account_masked VARCHAR(32) NOT NULL,
    bank_ifsc VARCHAR(16) NOT NULL,
    bank_name VARCHAR(128) NOT NULL,
    npci_dbt_seeded BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE officers (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    designation VARCHAR(128) NOT NULL,
    department VARCHAR(128) NOT NULL,
    jurisdiction_state VARCHAR(128) DEFAULT 'PAN_INDIA',
    employee_code VARCHAR(64) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 3. SCHEMES & CONFIGURABLE RULE ENGINE
-- ----------------------------------------------------------------------------
CREATE TABLE schemes (
    id VARCHAR(64) PRIMARY KEY,
    code VARCHAR(32) NOT NULL UNIQUE, -- e.g. NFST-2026, NOS-2026
    name VARCHAR(255) NOT NULL,
    hindi_name VARCHAR(255),
    category VARCHAR(64) NOT NULL, -- FELLOWSHIP, OVERSEAS_SCHOLARSHIP, HIGHER_EDUCATION
    academic_year VARCHAR(32) NOT NULL,
    description TEXT NOT NULL,
    slots INTEGER NOT NULL DEFAULT 100,
    stipend_amount_numeric NUMERIC(12, 2) NOT NULL,
    stipend_text VARCHAR(255) NOT NULL,
    contingency_yearly NUMERIC(12, 2) DEFAULT 0,
    application_start_date DATE NOT NULL,
    application_deadline DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE scheme_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scheme_id VARCHAR(64) NOT NULL REFERENCES schemes(id) ON DELETE CASCADE,
    group_id VARCHAR(64) NOT NULL DEFAULT 'DEFAULT_GROUP',
    logical_operator VARCHAR(8) NOT NULL DEFAULT 'AND', -- AND, OR
    field_key VARCHAR(64) NOT NULL, -- e.g. annualIncome, degreePercentage, category, educationLevel
    field_label VARCHAR(128) NOT NULL,
    operator VARCHAR(16) NOT NULL, -- =, !=, >, <, >=, <=, IN, NOT IN
    threshold_value JSONB NOT NULL,
    category VARCHAR(32) NOT NULL, -- INCOME, ACADEMIC, SOCIAL, AGE
    explanation_template TEXT NOT NULL,
    is_mandatory BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_scheme_rules_scheme ON scheme_rules(scheme_id);

CREATE TABLE scheme_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scheme_id VARCHAR(64) NOT NULL REFERENCES schemes(id) ON DELETE CASCADE,
    doc_type VARCHAR(64) NOT NULL, -- ST_CERTIFICATE, INCOME_CERTIFICATE, DEGREE_CERTIFICATE, ADMISSION_LETTER, BANK_PASSBOOK
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_mandatory BOOLEAN DEFAULT TRUE,
    max_size_mb NUMERIC(4, 1) DEFAULT 2.0,
    allowed_mime_types TEXT[] DEFAULT ARRAY['application/pdf', 'image/jpeg', 'image/png'],
    extracted_keys JSONB NOT NULL, -- Keys OCR engine must extract
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_scheme_docs_scheme ON scheme_documents(scheme_id);

-- ----------------------------------------------------------------------------
-- 4. APPLICATIONS & ANSWERS
-- ----------------------------------------------------------------------------
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_number VARCHAR(64) NOT NULL UNIQUE, -- e.g. TS-2026-NFST-0012
    scheme_id VARCHAR(64) NOT NULL REFERENCES schemes(id),
    student_id UUID NOT NULL REFERENCES students(id),
    status VARCHAR(32) NOT NULL DEFAULT 'SUBMITTED', 
    -- DRAFT, SUBMITTED, DOCUMENT_VERIFICATION, DEFICIENCY, RE_SUBMITTED, ELIGIBILITY_CHECK, SCREENING, SELECTED, NOT_SELECTED, POST_SELECTION
    merit_score NUMERIC(5, 2) DEFAULT 0,
    declared_annual_income NUMERIC(14, 2) NOT NULL,
    education_level VARCHAR(64) NOT NULL,
    degree_percentage NUMERIC(5, 2) NOT NULL,
    age INTEGER NOT NULL,
    research_title TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_applications_student ON applications(student_id);
CREATE INDEX idx_applications_scheme ON applications(scheme_id);
CREATE INDEX idx_applications_status ON applications(status);

CREATE TABLE application_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    field_key VARCHAR(128) NOT NULL,
    field_value JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 5. DOCUMENTS, OCR EXTRACTIONS & VERIFICATIONS
-- ----------------------------------------------------------------------------
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    doc_type VARCHAR(64) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    file_hash_sha256 VARCHAR(64) NOT NULL,
    file_uri TEXT NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING_AI',
    -- PENDING_AI, AI_VERIFIED, MISMATCH_DETECTED, OFFICER_APPROVED, OFFICER_REJECTED
    is_corrected_upload BOOLEAN DEFAULT FALSE,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_documents_app ON documents(application_id);

CREATE TABLE document_extractions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    classification VARCHAR(128) NOT NULL,
    confidence_score NUMERIC(5, 2) NOT NULL,
    extracted_entities JSONB NOT NULL,
    raw_ocr_snippet TEXT NOT NULL,
    is_tampered_suspected BOOLEAN DEFAULT FALSE,
    processed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE document_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    field_key VARCHAR(64) NOT NULL,
    declared_value TEXT NOT NULL,
    extracted_value TEXT NOT NULL,
    has_mismatch BOOLEAN NOT NULL DEFAULT FALSE,
    mismatch_severity VARCHAR(16) DEFAULT 'NONE', -- HIGH, MEDIUM, LOW, NONE
    confidence NUMERIC(5, 2) NOT NULL,
    advisory_explanation TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 6. ELIGIBILITY EVALUATIONS & DEFICIENCIES
-- ----------------------------------------------------------------------------
CREATE TABLE eligibility_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    is_eligible BOOLEAN NOT NULL,
    total_rules INTEGER NOT NULL,
    passed_rules INTEGER NOT NULL,
    breakdown JSONB NOT NULL,
    summary_explanation TEXT NOT NULL,
    evaluated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE deficiencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    document_id UUID REFERENCES documents(id),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    severity VARCHAR(16) NOT NULL DEFAULT 'CRITICAL', -- CRITICAL, MODERATE
    status VARCHAR(32) NOT NULL DEFAULT 'OPEN', -- OPEN, RESPONDED, UNDER_REVIEW, RESOLVED, ESCALATED
    officer_remarks TEXT,
    student_correction_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_deficiencies_app ON deficiencies(application_id);

-- ----------------------------------------------------------------------------
-- 7. REVIEWS, SELECTIONS & FELLOWSHIPS
-- ----------------------------------------------------------------------------
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    officer_id UUID NOT NULL REFERENCES officers(id),
    decision VARCHAR(32) NOT NULL, -- APPROVED, REJECTED, DEFICIENCY_RAISED, OVERRIDDEN
    remarks TEXT NOT NULL,
    override_reason TEXT,
    reviewed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE selection_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    scheme_id VARCHAR(64) NOT NULL REFERENCES schemes(id),
    merit_rank INTEGER NOT NULL,
    composite_score NUMERIC(5, 2) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'SELECTED',
    sanction_order_number VARCHAR(128) NOT NULL UNIQUE,
    approved_by UUID REFERENCES officers(id),
    sanctioned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE fellowships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    award_number VARCHAR(128) NOT NULL UNIQUE,
    award_date DATE NOT NULL,
    tenure_years INTEGER NOT NULL DEFAULT 5,
    monthly_stipend NUMERIC(10, 2) NOT NULL,
    annual_contingency NUMERIC(10, 2) NOT NULL,
    total_sanctioned NUMERIC(14, 2) NOT NULL,
    total_disbursed NUMERIC(14, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 8. COMMUNICATIONS, NOTIFICATIONS & IMMUTABLE AUDIT LOGS
-- ----------------------------------------------------------------------------
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID, -- NULL means broadcast to all
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(16) NOT NULL DEFAULT 'INFO', -- INFO, WARNING, ALERT, SUCCESS
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    action_url TEXT,
    application_id UUID REFERENCES applications(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    user_id UUID,
    user_name VARCHAR(255) NOT NULL,
    user_role VARCHAR(64) NOT NULL,
    action VARCHAR(128) NOT NULL,
    application_id UUID,
    application_number VARCHAR(64),
    document_id UUID,
    ai_finding TEXT,
    officer_decision TEXT,
    reason TEXT,
    ip_address VARCHAR(64) NOT NULL
);

CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX idx_audit_logs_app ON audit_logs(application_id);
