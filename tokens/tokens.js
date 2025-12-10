/**
 * Munafa OS v2.1 Design Tokens (JavaScript Export)
 * For programmatic access to design tokens
 */

export const colors = {
  brand: {
    primary: '#4F46E5',
    dark: '#3730A3',
    light: '#E0E7FF',
  },

  canvas: {
    light: '#F8F9FD',
    dark: '#0F172A',
  },

  surface: {
    light: '#FFFFFF',
    dark: '#1E293B',
    glass: 'rgba(255, 255, 255, 0.95)',
  },

  text: {
    primary: {
      light: '#1E293B',
      dark: '#FFFFFF',
    },
    secondary: {
      light: '#64748B',
      dark: '#94A3B8',
    },
    disabled: '#CBD5E1',
    onBrand: '#FFFFFF',
  },

  success: {
    bg: {
      light: '#ECFDF5',
      dark: '#064E3B',
    },
    text: {
      light: '#059669',
      dark: '#34D399',
    },
    bar: '#10B981',
  },

  warning: {
    bg: {
      light: '#FFFBEB',
      dark: '#78350F',
    },
    text: {
      light: '#B45309',
      dark: '#FBBF24',
    },
    bar: '#F59E0B',
  },

  danger: {
    bg: {
      light: '#FFF1F2',
      dark: '#881337',
    },
    text: {
      light: '#E11D48',
      dark: '#FB7185',
    },
    bar: '#F43F5E',
  },

  border: {
    subtle: '#E2E8F0',
    focus: '#6366F1',
  },
};

export const typography = {
  fontFamily: {
    base: "'Manrope', system-ui, sans-serif",
    devanagari: "'Noto Sans Devanagari', 'Manrope', system-ui, sans-serif",
  },

  fontSize: {
    hero: '36px',
    h1: '28px',
    h2: '20px',
    bodyLg: '18px',
    body: '16px',
    caption: '12px',
  },

  fontWeight: {
    regular: 500,
    bold: 700,
    heavy: 800,
  },

  lineHeight: {
    tight: 1.2,
    base: 1.5,
  },
};

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',

  touchMin: '44px',
  touchLg: '56px',
  navHeight: '64px',
  headerHeight: '56px',
};

export const shape = {
  radius: {
    sm: '12px',
    md: '16px',
    lg: '24px',
    full: '9999px',
  },

  shadow: {
    xs: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
    md: '0 10px 15px -3px rgba(0, 0, 0, 0.08)',
    xl: '0 25px 50px -12px rgba(99, 102, 241, 0.25)',
    glass: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
  },

  // Dark mode shadows (glows)
  glow: {
    sm: '0 0 10px rgba(255, 255, 255, 0.1)',
    md: '0 0 20px rgba(255, 255, 255, 0.1)',
  },
};

export const motion = {
  easing: {
    spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },

  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
};

// Default export with all tokens
const tokens = {
  colors,
  typography,
  spacing,
  shape,
  motion,
};

export default tokens;
