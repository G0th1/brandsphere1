/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "fade-in": {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        "fade-out": {
          from: { opacity: 1 },
          to: { opacity: 0 },
        },
        "slide-in-from-top": {
          from: { transform: "translateY(-10%)", opacity: 0 },
          to: { transform: "translateY(0)", opacity: 1 },
        },
        "slide-in-from-bottom": {
          from: { transform: "translateY(10%)", opacity: 0 },
          to: { transform: "translateY(0)", opacity: 1 },
        },
        "slide-in-from-left": {
          from: { transform: "translateX(-10%)", opacity: 0 },
          to: { transform: "translateX(0)", opacity: 1 },
        },
        "slide-in-from-right": {
          from: { transform: "translateX(10%)", opacity: 0 },
          to: { transform: "translateX(0)", opacity: 1 },
        },
        "slide-out-to-top": {
          from: { transform: "translateY(0)", opacity: 1 },
          to: { transform: "translateY(-10%)", opacity: 0 },
        },
        "slide-out-to-bottom": {
          from: { transform: "translateY(0)", opacity: 1 },
          to: { transform: "translateY(10%)", opacity: 0 },
        },
        "slide-out-to-left": {
          from: { transform: "translateX(0)", opacity: 1 },
          to: { transform: "translateX(-10%)", opacity: 0 },
        },
        "slide-out-to-right": {
          from: { transform: "translateX(0)", opacity: 1 },
          to: { transform: "translateX(10%)", opacity: 0 },
        },
        "scale-in": {
          from: { transform: "scale(0.95)", opacity: 0 },
          to: { transform: "scale(1)", opacity: 1 },
        },
        "scale-out": {
          from: { transform: "scale(1)", opacity: 1 },
          to: { transform: "scale(0.95)", opacity: 0 },
        },
        "pulse-slow": {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.8 }
        },
        "bounce-subtle": {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5%)' }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-in-out",
        "fade-out": "fade-out 0.3s ease-in-out",
        "slide-in-from-top": "slide-in-from-top 0.3s ease-in-out",
        "slide-in-from-bottom": "slide-in-from-bottom 0.3s ease-in-out",
        "slide-in-from-left": "slide-in-from-left 0.3s ease-in-out",
        "slide-in-from-right": "slide-in-from-right 0.3s ease-in-out",
        "slide-out-to-top": "slide-out-to-top 0.3s ease-in-out",
        "slide-out-to-bottom": "slide-out-to-bottom 0.3s ease-in-out",
        "slide-out-to-left": "slide-out-to-left 0.3s ease-in-out",
        "slide-out-to-right": "slide-out-to-right 0.3s ease-in-out",
        "scale-in": "scale-in 0.3s ease-in-out",
        "scale-out": "scale-out 0.3s ease-in-out",
        "pulse-slow": "pulse-slow 3s ease-in-out infinite",
        "bounce-subtle": "bounce-subtle 2s ease-in-out infinite",
      },
      transitionProperty: {
        'width': 'width',
        'height': 'height',
        'spacing': 'margin, padding',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} 