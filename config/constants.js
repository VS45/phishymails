// JWT Configuration
export const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
export const TOKEN_EXPIRY = '7d'; // 7 days

// Session timeout (20 minutes in milliseconds)
export const SESSION_TIMEOUT = 20 * 60 * 1000;

// Email analysis thresholds
export const PHISHING_THRESHOLD = 70;
export const SUSPICIOUS_THRESHOLD = 40;

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// User roles
export const ROLES = {
    ADMIN: 'admin',
    CLIENT: 'client',
    TENANT: 'tenant',
    ACCOUNTANT: 'accountant',
    FACILITY_MANAGER: 'facility_manager',
    PROPERTY_MANAGER: 'property-manager',
    CLEANER: 'cleaner',
    SECURITY: 'security',
    SECURITY_ANALYST: 'security_analyst',
    USER: 'user'
};

// Email status types
export const EMAIL_STATUS = {
    SAFE: 'safe',
    SCAM: 'scam',
    PHISHING: 'phishing',
    SUSPICIOUS: 'suspicious',
    PENDING: 'pending'
};

// Detection categories
export const DETECTION_CATEGORIES = {
    SUSPICIOUS_LINKS: 'suspicious_links',
    URGENT_LANGUAGE: 'urgent_language',
    GRAMMAR_ISSUES: 'grammar_issues',
    SPOOFED_SENDER: 'spoofed_sender',
    REQUEST_INFO: 'request_for_personal_info',
    UNUSUAL_ATTACHMENTS: 'unusual_attachments',
    TOO_GOOD_TRUE: 'too_good_to_be_true',
    THREATENING_LANGUAGE: 'threatening_language',
    MISMATCHED_URLS: 'mismatched_urls',
    GENERIC_GREETING: 'generic_greeting',
    OTHER: 'other'
};