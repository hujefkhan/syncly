export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter','system-ui','sans-serif'],
        display: ['"Plus Jakarta Sans"','Inter','sans-serif'],
      },
      colors: {
        brand: {
          50:'#f5f3ff',100:'#ede9fe',200:'#ddd6fe',300:'#c4b5fd',
          400:'#a78bfa',500:'#8b5cf6',600:'#7c3aed',700:'#6d28d9',800:'#5b21b6',900:'#4c1d95',
        },
        ink: '#1f2937',
      },
      boxShadow: {
        'soft': '0 8px 30px rgba(124, 58, 237, 0.08)',
        'glow': '0 10px 40px -10px rgba(124, 58, 237, 0.35)',
      },
      backgroundImage: {
        'lavender': 'linear-gradient(135deg,#f5f3ff 0%,#fae8ff 50%,#ede9fe 100%)',
'dark-lavender': 'linear-gradient(135deg,#09090b 0%,#18181b 50%,#27272a 100%)',
   'cozy': 'linear-gradient(135deg,#eef5fc 0%,#f8fbff 50%,#e7eef8 100%)',
'cozy-dark':
'linear-gradient(135deg,#0f172a 0%,#172033 50%,#1f2b44 100%)',
        'brand-gradient': 'linear-gradient(135deg,#7c3aed 0%,#a78bfa 50%,#ec4899 100%)',
      },
    },
  },
  plugins: [],
};
