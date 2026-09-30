import { EligibilityRule, RuleGroup, RuleEvaluationItem, EligibilityEvaluation, Operator } from '../types';

/**
 * Deterministic Rule Engine for TribalScholar AI
 * Evaluates configurable schemes against application/student data
 * Supports: =, !=, >, <, >=, <=, IN, NOT IN, AND, OR
 * Produces transparent explanations and audit-ready breakdowns.
 */

export function evaluateOperator(actual: any, operator: Operator, expected: any): boolean {
  if (actual === undefined || actual === null) {
    return false;
  }

  // Normalize numbers if both can be numeric
  const numActual = typeof actual === 'number' ? actual : parseFloat(String(actual).replace(/[^0-9.-]+/g, ''));
  const numExpected = typeof expected === 'number' ? expected : parseFloat(String(expected).replace(/[^0-9.-]+/g, ''));

  const isNumericComparison = !isNaN(numActual) && !isNaN(numExpected) && typeof expected !== 'string';

  switch (operator) {
    case '=':
      if (isNumericComparison) return numActual === numExpected;
      return String(actual).trim().toLowerCase() === String(expected).trim().toLowerCase();

    case '!=':
      if (isNumericComparison) return numActual !== numExpected;
      return String(actual).trim().toLowerCase() !== String(expected).trim().toLowerCase();

    case '>':
      return numActual > numExpected;

    case '<':
      return numActual < numExpected;

    case '>=':
      return numActual >= numExpected;

    case '<=':
      return numActual <= numExpected;

    case 'IN': {
      let allowedList: any[] = [];
      if (Array.isArray(expected)) {
        allowedList = expected;
      } else if (typeof expected === 'string') {
        allowedList = expected.split(',').map((s) => s.trim().toLowerCase());
      }
      const actualStr = String(actual).trim().toLowerCase();
      return allowedList.some((item) => String(item).trim().toLowerCase() === actualStr);
    }

    case 'NOT IN': {
      let disallowedList: any[] = [];
      if (Array.isArray(expected)) {
        disallowedList = expected;
      } else if (typeof expected === 'string') {
        disallowedList = expected.split(',').map((s) => s.trim().toLowerCase());
      }
      const actualStr = String(actual).trim().toLowerCase();
      return !disallowedList.some((item) => String(item).trim().toLowerCase() === actualStr);
    }

    default:
      return false;
  }
}

export function evaluateSingleRule(rule: EligibilityRule, candidateData: Record<string, any>): RuleEvaluationItem {
  const actualValue = candidateData[rule.field];
  const passed = evaluateOperator(actualValue, rule.operator, rule.value);

  const formattedActual = actualValue !== undefined && actualValue !== null
    ? (typeof actualValue === 'number' ? `₹${actualValue.toLocaleString('en-IN')}` : String(actualValue))
    : 'Not Provided';

  const formattedExpected = typeof rule.value === 'number'
    ? `₹${rule.value.toLocaleString('en-IN')}`
    : String(rule.value);

  let message = '';
  if (passed) {
    message = `✓ ${rule.fieldLabel} requirement satisfied (${formattedActual} ${rule.operator} ${formattedExpected})`;
  } else {
    message = `✗ ${rule.fieldLabel} requirement not met: expected ${rule.operator} ${formattedExpected}, but recorded ${formattedActual}`;
  }

  return {
    ruleId: rule.id,
    field: rule.field,
    fieldLabel: rule.fieldLabel,
    operator: rule.operator,
    expected: rule.value,
    actual: actualValue,
    passed,
    message,
    category: rule.category,
  };
}

export function evaluateSchemeEligibility(ruleGroups: RuleGroup[], candidateData: Record<string, any>): EligibilityEvaluation {
  const allResults: RuleEvaluationItem[] = [];
  let overallEligible = true;

  if (!ruleGroups || ruleGroups.length === 0) {
    return {
      isEligible: true,
      evaluatedAt: new Date().toISOString(),
      passedCount: 0,
      totalCount: 0,
      ruleResults: [],
      summaryExplanation: 'No restrictive eligibility rules configured for this scheme.',
    };
  }

  for (const group of ruleGroups) {
    const groupResults = group.rules.map((rule) => evaluateSingleRule(rule, candidateData));
    allResults.push(...groupResults);

    let groupPassed = false;
    if (group.logicalOperator === 'AND') {
      groupPassed = groupResults.every((r) => r.passed);
    } else {
      // 'OR' logic
      groupPassed = groupResults.some((r) => r.passed);
    }

    if (!groupPassed) {
      overallEligible = false;
    }
  }

  const passedCount = allResults.filter((r) => r.passed).length;
  const totalCount = allResults.length;

  let summaryExplanation = '';
  if (overallEligible) {
    summaryExplanation = `All ${totalCount} mandatory scheme criteria have been verified and satisfied.`;
  } else {
    const failedFields = allResults.filter((r) => !r.passed).map((r) => r.fieldLabel);
    summaryExplanation = `Eligibility criteria not met for: ${failedFields.join(', ')}.`;
  }

  return {
    isEligible: overallEligible,
    evaluatedAt: new Date().toISOString(),
    passedCount,
    totalCount,
    ruleResults: allResults,
    summaryExplanation,
  };
}
