export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: { 900: '#172033' },
        paper: { 100: '#f5f7fb' },
        teal: {
          100: '#d9f7f4',
          300: '#7dd8d4',
          500: '#22aaa6',
          600: '#168f8b',
          700: '#0f7774',
          800: '#0b5f5d'
        },
        mint: {
          100: '#e5fff4',
          200: '#c9f8e5',
          300: '#9be7c7',
          600: '#21a870',
          800: '#136645'
        },
        coral: {
          600: '#e15747',
          700: '#bd4033'
        },
        amber: {
          50: '#fff7e7',
          800: '#8a5200'
        }
      },
      boxShadow: {
        panel: '0 18px 50px rgba(23, 32, 51, 0.08)'
      }
    }
  },
  plugins: []
};
