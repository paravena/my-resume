// tailwind.config.js
export default {
  content: ['./public/**/*.html', './src/**/*.{js,jsx,ts,tsx,vue}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        witt: ['Wittgenstain', 'sans-serif'],
      },
      maxWidth: {
        '1/5': '20%',
        '1/4': '25%',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
