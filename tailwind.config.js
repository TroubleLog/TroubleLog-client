/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg:     '#0B0B0D',
        s1:     '#111114',
        s2:     '#18181C',
        s3:     '#222227',
        s4:     '#2C2C33',
        t1:     '#EDEDF0',
        t2:     '#888896',
        t3:     '#55555F',
        accent: '#22C55E',
      },
      fontFamily: {
        ui:   ['Outfit', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '14px',
        xl: '20px',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        spinFast: { to: { transform: 'rotate(360deg)' } },
      },
      animation: {
        'fade-up':  'fadeUp 0.25s ease both',
        'fade-up2': 'fadeUp 0.3s 0.09s ease both',
        'fade-up3': 'fadeUp 0.3s 0.18s ease both',
        'spin-fast': 'spinFast 0.65s linear infinite',
      },
    },
  },
  plugins: [],
}
