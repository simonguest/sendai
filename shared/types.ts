// This file maintains backward compatibility by re-exporting from the new organized structure
// For new code, prefer importing directly from the specific modules:
// - @shared/i18n for internationalization
// - @shared/theme for theming

// Re-export all i18n types and constants
export * from './i18n';

// Re-export all theme types and constants  
export * from './theme';
