// Common email domains for validation
const COMMON_DOMAINS = [
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'icloud.com',
  'aol.com',
  'protonmail.com',
  'mail.com',
  'live.com',
  'msn.com',
  'me.com',
  'mac.com',
  'googlemail.com',
  'yahoo.co.uk',
  'yahoo.ca',
  'yahoo.com.au',
  'hotmail.co.uk',
  'hotmail.ca',
  'hotmail.com.au',
  'outlook.co.uk',
  'outlook.ca',
  'outlook.com.au',
];

// Valid TLDs (Top Level Domains)
const VALID_TLDS = [
  'com', 'org', 'net', 'edu', 'gov', 'mil', 'int',
  'uk', 'us', 'ca', 'au', 'de', 'fr', 'it', 'es', 'nl', 'se', 'no', 'dk', 'fi',
  'ch', 'at', 'be', 'ie', 'pt', 'gr', 'pl', 'cz', 'hu', 'ro', 'bg', 'hr', 'si',
  'sk', 'lt', 'lv', 'ee', 'mt', 'cy', 'lu', 'li', 'mc', 'sm', 'va', 'ad', 'by',
  'md', 'ua', 'ru', 'kz', 'uz', 'tm', 'tj', 'kg', 'ge', 'am', 'az', 'tr', 'il',
  'jo', 'lb', 'sy', 'iq', 'kw', 'sa', 'ae', 'om', 'ye', 'qa', 'bh', 'jo', 'ps',
  'eg', 'sd', 'ly', 'tn', 'dz', 'ma', 'mr', 'sn', 'gm', 'gn', 'gw', 'cv', 'sl',
  'lr', 'ci', 'gh', 'tg', 'bj', 'bf', 'ml', 'ne', 'td', 'cm', 'gq', 'cf', 'cg',
  'ga', 'st', 'ao', 'cd', 'zm', 'mw', 'zw', 'na', 'bw', 'ls', 'sz', 'mg', 'mu',
  'sc', 'km', 'yt', 're', 'dj', 'so', 'et', 'er', 'ke', 'ug', 'rw', 'bi', 'tz',
  'mz', 'za', 'ss', 'ng', 'cm', 'td', 'cf', 'cg', 'ga', 'gq', 'st', 'ao', 'cd',
  'zm', 'mw', 'zw', 'na', 'bw', 'ls', 'sz', 'mg', 'mu', 'sc', 'km', 'yt', 're',
  'dj', 'so', 'et', 'er', 'ke', 'ug', 'rw', 'bi', 'tz', 'mz', 'za', 'ss',
  'in', 'pk', 'bd', 'lk', 'np', 'bt', 'mv', 'mm', 'th', 'la', 'vn', 'kh', 'my',
  'sg', 'id', 'ph', 'bn', 'tl', 'jp', 'kr', 'cn', 'tw', 'hk', 'mo', 'mn', 'kp',
  'br', 'ar', 'cl', 'pe', 'co', 'ec', 'bo', 'py', 'uy', 'gy', 'sr', 'gf', 've',
  'mx', 'gt', 'bz', 'sv', 'hn', 'ni', 'cr', 'pa', 'cu', 'jm', 'ht', 'do', 'pr',
  'tt', 'bb', 'gd', 'lc', 'vc', 'ag', 'kn', 'dm', 'ai', 'vg', 'tc', 'ms', 'fk',
  'gi', 'sh', 'aw', 'cw', 'sx', 'bq', 'bl', 'mf', 'pm', 'wf', 'pf', 'nc', 'vu',
  'fj', 'pg', 'sb', 'to', 'ws', 'ki', 'tv', 'nr', 'pw', 'fm', 'mh', 'ck', 'nu',
  'tk', 'as', 'gu', 'mp', 'vi', 'pr', 'do', 'ht', 'jm', 'cu', 'pa', 'cr', 'ni',
  'hn', 'sv', 'bz', 'gt', 'mx', 've', 'gf', 'sr', 'gy', 'uy', 'py', 'bo', 'ec',
  'co', 'pe', 'cl', 'ar', 'br', 'kp', 'mn', 'mo', 'hk', 'tw', 'cn', 'kr', 'jp',
  'tl', 'bn', 'ph', 'id', 'sg', 'my', 'kh', 'vn', 'la', 'th', 'mm', 'mv', 'bt',
  'np', 'lk', 'bd', 'pk', 'in', 'ss', 'za', 'mz', 'tz', 'bi', 'rw', 'ug', 'ke',
  'er', 'et', 'so', 'dj', 're', 'yt', 'km', 'sc', 'mu', 'mg', 'sz', 'ls', 'bw',
  'na', 'zw', 'mw', 'zm', 'cd', 'ao', 'st', 'gq', 'ga', 'cg', 'cf', 'cm', 'td',
  'ne', 'ml', 'bf', 'bj', 'tg', 'gh', 'ci', 'lr', 'sl', 'cv', 'gw', 'gn', 'gm',
  'sn', 'mr', 'ma', 'dz', 'tn', 'ly', 'sd', 'eg', 'ps', 'jo', 'bh', 'qa', 'ye',
  'om', 'ae', 'sa', 'kw', 'iq', 'sy', 'lb', 'jo', 'il', 'tr', 'az', 'am', 'ge',
  'kg', 'tj', 'tm', 'uz', 'kz', 'ru', 'ua', 'md', 'by', 'ad', 'va', 'sm', 'mc',
  'li', 'lu', 'cy', 'mt', 'ee', 'lv', 'lt', 'sk', 'si', 'hr', 'bg', 'ro', 'hu',
  'cz', 'pl', 'gr', 'pt', 'ie', 'be', 'at', 'ch', 'fi', 'dk', 'no', 'se', 'nl',
  'es', 'it', 'fr', 'de', 'au', 'ca', 'us', 'uk', 'int', 'mil', 'gov', 'edu',
  'net', 'org', 'com'
];

/**
 * Validates if an email has a valid format
 */
export const isValidEmailFormat = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Extracts the domain from an email address
 */
export const extractDomain = (email: string): string | null => {
  const parts = email.split('@');
  if (parts.length !== 2) return null;
  return parts[1].toLowerCase();
};

/**
 * Validates if the domain is a common/recognized domain
 */
export const isCommonDomain = (domain: string): boolean => {
  return COMMON_DOMAINS.includes(domain.toLowerCase());
};

/**
 * Validates if the TLD (Top Level Domain) is valid
 */
export const isValidTLD = (domain: string): boolean => {
  const tld = domain.split('.').pop()?.toLowerCase();
  return tld ? VALID_TLDS.includes(tld) : false;
};

/**
 * Comprehensive email validation including domain check
 */
export const validateEmail = (email: string): { isValid: boolean; message?: string } => {
  // Check basic email format
  if (!isValidEmailFormat(email)) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }

  const domain = extractDomain(email);
  if (!domain) {
    return { isValid: false, message: 'Invalid email domain' };
  }

  // Check if it's a common domain
  if (isCommonDomain(domain)) {
    return { isValid: true };
  }

  // Check if TLD is valid
  if (!isValidTLD(domain)) {
    return { isValid: false, message: 'Please use a valid email domain' };
  }

  // Additional checks for custom domains
  if (domain.length < 3) {
    return { isValid: false, message: 'Email domain is too short' };
  }

  if (domain.length > 253) {
    return { isValid: false, message: 'Email domain is too long' };
  }

  // Check for valid characters in domain
  const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!domainRegex.test(domain)) {
    return { isValid: false, message: 'Email domain contains invalid characters' };
  }

  return { isValid: true };
};

/**
 * Real-time validation for input fields
 */
export const getEmailValidationState = (email: string): {
  isValid: boolean;
  isCommonDomain: boolean;
  message?: string;
} => {
  if (!email) {
    return { isValid: false, isCommonDomain: false };
  }

  const validation = validateEmail(email);
  const domain = extractDomain(email);
  const isCommon = domain ? isCommonDomain(domain) : false;

  return {
    isValid: validation.isValid,
    isCommonDomain: isCommon,
    message: validation.message,
  };
}; 