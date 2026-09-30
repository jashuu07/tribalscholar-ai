import { describe, it, expect } from 'vitest';
import { simulateAIDocumentProcessing } from '../services/aiDocService';
import { evaluateOperator, evaluateSchemeEligibility } from '../services/ruleEngine';
import { INITIAL_SCHEMES } from '../data/seedData';

describe('SIH26239 Critical AI Document Verification Test Suite', () => {
  it('CRITICAL DEMO REQUIREMENT: Detects mismatch when App Income = ₹1,80,000 and Doc Income = ₹2,80,000', () => {
    // Application declares annual income ₹1,80,000
    const appData = {
      annualIncome: 180000,
      studentName: 'Aruna Kerketta',
    };

    // Uploaded initial income certificate has extracted value ₹2,80,000
    const aiResult = simulateAIDocumentProcessing({
      docType: 'INCOME_CERTIFICATE',
      fileName: 'Revenue_Income_Cert_2025.pdf',
      applicationData: appData,
      isCorrectedUpload: false,
    });

    // 1. Mismatch must be detected
    expect(aiResult.mismatches.length).toBeGreaterThan(0);
    const mismatch = aiResult.mismatches[0];

    expect(mismatch.field).toBe('annualIncome');
    expect(mismatch.applicationValue).toBe('₹1,80,000');
    expect(mismatch.documentValue).toBe('₹2,80,000');
    expect(mismatch.confidence).toBe(95);
    expect(mismatch.severity).toBe('HIGH');
    expect(mismatch.explanation).toContain(
      'The annual income extracted from the uploaded certificate does not match the value provided in the application.'
    );

    // 2. Candidate is NEVER automatically rejected by AI; result is advisory
    expect(aiResult.classifiedCorrectly).toBe(true);
  });

  it('DEFICIENCY RESOLUTION: Corrected document re-upload with ₹1,80,000 passes AI verification with 0 mismatches', () => {
    const appData = {
      annualIncome: 180000,
      studentName: 'Aruna Kerketta',
    };

    // Candidate uploads corrected certificate
    const aiReScan = simulateAIDocumentProcessing({
      docType: 'INCOME_CERTIFICATE',
      fileName: 'Corrected_Revenue_Income_Certificate_2026.pdf',
      applicationData: appData,
      isCorrectedUpload: true,
    });

    expect(aiReScan.mismatches.length).toBe(0);
    expect(aiReScan.extractedFields['annualIncome']).toBe(180000);
    expect(aiReScan.confidence).toBeGreaterThanOrEqual(94);
  });
});

describe('Deterministic Rule Engine Test Suite', () => {
  it('Evaluates all mathematical and relational operators accurately', () => {
    // = and !=
    expect(evaluateOperator('ST', '=', 'ST')).toBe(true);
    expect(evaluateOperator('OBC', '=', 'ST')).toBe(false);
    expect(evaluateOperator('PhD', '!=', 'UnderGraduate')).toBe(true);

    // Numeric <=, >=, <, >
    expect(evaluateOperator(180000, '<=', 600000)).toBe(true);
    expect(evaluateOperator(650000, '<=', 600000)).toBe(false);
    expect(evaluateOperator(74.5, '>=', 55)).toBe(true);
    expect(evaluateOperator(52, '>=', 55)).toBe(false);

    // IN and NOT IN
    expect(evaluateOperator('PhD', 'IN', ['PhD', 'MPhil'])).toBe(true);
    expect(evaluateOperator('BTech', 'IN', ['PhD', 'MPhil'])).toBe(false);
    expect(evaluateOperator('General', 'NOT IN', ['General'])).toBe(false);
  });

  it('Produces transparent pass/fail breakdown for NFST scheme criteria', () => {
    const nfstScheme = INITIAL_SCHEMES[0];

    const eligibleCandidate = {
      category: 'ST',
      annualIncome: 180000,
      educationLevel: 'PhD',
      degreePercentage: 74.5,
      age: 27,
    };

    const result = evaluateSchemeEligibility(nfstScheme.ruleGroups, eligibleCandidate);

    expect(result.isEligible).toBe(true);
    expect(result.passedCount).toBe(result.totalCount);
    expect(result.summaryExplanation).toContain('All 5 mandatory scheme criteria have been verified and satisfied.');
  });

  it('Identifies exact non-compliant rule when criteria are not met', () => {
    const nfstScheme = INITIAL_SCHEMES[0];

    const ineligibleCandidate = {
      category: 'ST',
      annualIncome: 750000, // Exceeds 6,00,000 threshold
      educationLevel: 'PhD',
      degreePercentage: 74.5,
      age: 27,
    };

    const result = evaluateSchemeEligibility(nfstScheme.ruleGroups, ineligibleCandidate);

    expect(result.isEligible).toBe(false);
    expect(result.summaryExplanation).toContain('Family Annual Income');
  });
});
