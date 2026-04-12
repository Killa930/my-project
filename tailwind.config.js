/** @type {import('tailwindcss').Config} */
export default {
    content: ["./resources/**/*.{js,jsx,ts,tsx,blade.php}"],
    theme: {
        extend: {
            colors: {
                accent: {
                    DEFAULT: "#ef4444",
                    hover: "#dc2626",
                    light: "#fef2f2",
                    dark: "#991b1b",
                    subtle: "rgba(239, 68, 68, 0.1)",
                },
                surface: {
                    primary: "rgb(var(--surface-primary) / <alpha-value>)",
                    secondary: "rgb(var(--surface-secondary) / <alpha-value>)",
                    tertiary: "rgb(var(--surface-tertiary) / <alpha-value>)",
                },
                border: {
                    DEFAULT: "rgb(var(--border-default) / <alpha-value>)",
                    hover: "rgb(var(--border-hover) / <alpha-value>)",
                },
                content: {
                    primary: "rgb(var(--content-primary) / <alpha-value>)",
                    secondary: "rgb(var(--content-secondary) / <alpha-value>)",
                    muted: "rgb(var(--content-muted) / <alpha-value>)",
                    inverted: "rgb(var(--content-inverted) / <alpha-value>)",
                },
                status: {
                    success: "#10b981",
                    successBg: "var(--status-success-bg)",
                    danger: "#ef4444",
                    dangerBg: "var(--status-danger-bg)",
                    warning: "#f59e0b",
                    warningBg: "var(--status-warning-bg)",
                },
            },
            fontFamily: {
                sans: ["Outfit", "sans-serif"],
                display: ["Bebas Neue", "sans-serif"],
            },
            animation: {
                "fade-in": "fadeIn 0.4s ease-out",
                "slide-up": "slideUp 0.5s ease-out",
            },
            keyframes: {
                fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
                slideUp: {
                    "0%": { opacity: "0", transform: "translateY(20px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
            },
        },
    },
    plugins: [],
};
