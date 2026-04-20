/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        summer: {
          orange: '#ff7a18',
          yellow: '#ffd93d',
          blue: '#0ea5e9',
          lime: '#84cc16',
          sky: '#f0f9ff',
        },
      },
      boxShadow: {
        glass: '0 20px 45px -24px rgba(3, 105, 161, 0.45), 0 8px 20px -12px rgba(255, 122, 24, 0.35)',
      },
      backdropBlur: {
        strong: '24px',
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

