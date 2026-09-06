/**
 * TripGo Color System
 *
 * All colors used across the app are defined here.
 * Never hardcode colors directly in components — always import from here.
 * This makes it easy to update the theme in one place.
 */

export const Colors = {
  // ─── Primary Brand Colors ──────────────────────────────────────
  primary: '#1A73E8',       // Main blue — buttons, active icons, links
  primaryDark: '#1558B0',   // Darker blue — pressed states, headers
  primaryLight: '#E8F0FE',  // Light blue — backgrounds, chips, badges

  // ─── Secondary / Accent ────────────────────────────────────────
  secondary: '#FF6B35',     // Orange — highlights, price tags, CTA
  secondaryLight: '#FFF0EB',// Light orange — card accents

  // ─── Neutral / Grayscale ───────────────────────────────────────
  white: '#FFFFFF',
  black: '#000000',
  background: '#F5F7FA',    // Main screen background
  surface: '#FFFFFF',       // Card / modal surface
  border: '#E0E0E0',        // Dividers, input borders
  inputBg: '#F1F3F6',       // Text input background

  // ─── Text ──────────────────────────────────────────────────────
  textPrimary: '#1A1A1A',   // Headings and body text
  textSecondary: '#555555', // Subtext, captions
  textMuted: '#999999',     // Placeholders, disabled text
  textWhite: '#FFFFFF',

  // ─── Status Colors ─────────────────────────────────────────────
  success: '#34A853',       // Confirmed, completed
  successLight: '#E6F4EA',
  warning: '#FBBC04',       // Pending, upcoming
  warningLight: '#FEF7E0',
  error: '#EA4335',         // Errors, cancelled
  errorLight: '#FCE8E6',
  info: '#4285F4',          // Informational

  // ─── Rating ────────────────────────────────────────────────────
  star: '#F4B400',          // Star rating color

  // ─── Dark Mode Colors ──────────────────────────────────────────
  dark: {
    background: '#121212',
    surface: '#1E1E1E',
    border: '#2C2C2C',
    textPrimary: '#FFFFFF',
    textSecondary: '#AAAAAA',
    inputBg: '#2A2A2A',
  },
};

export default Colors;
