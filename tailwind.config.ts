import type { Config } from "tailwindcss";
const config: Config = {
  darkMode: ["class"],
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  theme: { container: { center: true, padding: "1.25rem", screens: { "2xl": "1440px" } },
    extend: {
      colors: {
        background: "hsl(var(--background))", foreground: "hsl(var(--foreground))",
        surface: "hsl(var(--surface))", elevated: "hsl(var(--elevated))",
        border: "hsl(var(--border))", muted: "hsl(var(--muted))",
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" }
      },
      fontFamily: { sans: ["var(--font-inter)", "sans-serif"], display: ["var(--font-space)", "sans-serif"] },
      borderRadius: { xl: "var(--radius-xl)", "2xl": "var(--radius-2xl)" },
      boxShadow: { glow: "0 0 36px hsl(var(--primary) / .18)" },
      backgroundImage: { "hero-mesh": "radial-gradient(at 10% 10%, rgb(59 130 246 / .20) 0, transparent 45%), radial-gradient(at 90% 0%, rgb(139 92 246 / .18) 0, transparent 42%)" }
    }
  },
  plugins: [require("@tailwindcss/typography")]
};
export default config;
