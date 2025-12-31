/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Outfit', 'sans-serif'],
            },
            colors: {
                'bg-primary': 'var(--bg-primary)',
                'bg-secondary': 'var(--bg-secondary)',
                'bg-card': 'var(--bg-card)',
                'text-primary': 'var(--text-primary)',
                'text-secondary': 'var(--text-secondary)',
                'accent-primary': 'var(--accent-primary)',
                'accent-secondary': 'var(--accent-secondary)',
                'error': 'var(--error)',
                'success': 'var(--success)',
                'warning': 'var(--warning)',
            }
        },
    },
    plugins: [],
}
