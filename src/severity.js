function classifyProblemSeverity(input) {
  const text = (input || '').toLowerCase().trim();

  if (!text) {
    return 'low';
  }

  const highRiskPatterns = [
    /\bfire\b/,
    /\bsmoke\b/,
    /\belectrical\b/,
    /\bsparking\b/,
    /\bexposed wire\b/,
    /\bgas leak\b/,
    /\bceiling collapse\b/,
    /\bflood(ed|ing)?\b/,
    /\binjury\b/,
    /\bunsafe\b/
  ];

  if (highRiskPatterns.some((pattern) => pattern.test(text))) {
    return 'high';
  }

  const mediumRiskPatterns = [
    /\bbroken\b/,
    /\bnot working\b/,
    /\bac\b/,
    /\bair conditioner\b/,
    /\bleak(age)?\b/,
    /\bpower outage\b/,
    /\bwashroom blocked\b/,
    /\bdoor jam\b/,
    /\bwindow broken\b/,
    /\binternet down\b/,
    /\bwifi down\b/
  ];

  if (mediumRiskPatterns.some((pattern) => pattern.test(text))) {
    return 'medium';
  }

  return 'low';
}

module.exports = { classifyProblemSeverity };
