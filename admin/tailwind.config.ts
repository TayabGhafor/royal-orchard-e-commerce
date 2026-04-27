import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: { center: true, padding: "2rem", screens: { "2xl": "1400px" } },
    extend: {
      fontFamily: {
        headline: ["Plus Jakarta Sans", "sans-serif"],
        body: ["Inter", "sans-serif"],
        label: ["Inter", "sans-serif"],
      },
      colors: {
        // shadcn (kept)
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },

        // Material 3 palette from RoyalOrchard reference (literal colors – design system)
        primary: {
          DEFAULT: "#904d00",
          foreground: "#ffffff",
        },
        "primary-container": "#ffd1ae",
        "on-primary": "#ffffff",
        "on-primary-container": "#914d00",
        "primary-fixed": "#ffdcc3",
        "primary-fixed-dim": "#ffb77d",
        "on-primary-fixed": "#2f1500",
        "on-primary-fixed-variant": "#6e3900",

        secondary: {
          DEFAULT: "#006d3d",
          foreground: "#ffffff",
        },
        "secondary-container": "#97f3b5",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#047240",
        "secondary-fixed": "#9af6b8",
        "secondary-fixed-dim": "#7ed99e",
        "on-secondary-fixed": "#00210f",
        "on-secondary-fixed-variant": "#00522d",

        tertiary: {
          DEFAULT: "#705d00",
          foreground: "#ffffff",
        },
        "tertiary-container": "#ffd700",
        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#705e00",
        "tertiary-fixed": "#ffe16d",
        "tertiary-fixed-dim": "#e9c400",
        "on-tertiary-fixed": "#221b00",
        "on-tertiary-fixed-variant": "#544600",

        error: "#ba1a1a",
        "error-container": "#ffdad6",
        "on-error": "#ffffff",
        "on-error-container": "#93000a",

        surface: "#f9f9f9",
        "surface-bright": "#f9f9f9",
        "surface-dim": "#dadada",
        "surface-tint": "#904d00",
        "surface-variant": "#e2e2e2",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f3f3f3",
        "surface-container": "#eeeeee",
        "surface-container-high": "#e8e8e8",
        "surface-container-highest": "#e2e2e2",
        "inverse-surface": "#2f3131",
        "inverse-on-surface": "#f1f1f1",
        "inverse-primary": "#ffb77d",

        "on-surface": "#1a1c1c",
        "on-background": "#1a1c1c",
        "on-surface-variant": "#4d4732",
        outline: "#7e775f",
        "outline-variant": "#d0c6ab",

        // Retro editorial palette (OurStory page reference)
        terracotta: "#C0573E",
        olive: "#5B6334",
        ochre: "#C88B2A",
        "warm-cream": "#F4EBD9",
        "retro-gold": "#FFD700",
        "dark-soil": "#3D2B1F",
      },
      borderRadius: {
        DEFAULT: "1rem",
        sm: "calc(var(--radius) - 4px)",
        md: "calc(var(--radius) - 2px)",
        lg: "2rem",
        xl: "3rem",
        full: "9999px",
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
        "fade-up": { "0%": { opacity: "0", transform: "translateY(12px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.5s cubic-bezier(.2,.8,.2,1) both",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
