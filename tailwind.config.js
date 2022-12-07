module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#FFE145',
        primary_og: '#FF521C',
        light: '#E6FAF0',
        dark: '#0BAB5E',
        line: '#F4F4F4',
        background: '#FFFFFF',
      },
    },
  },
  plugins: [],
  corePlugins: require('tailwind-rn/unsupported-core-plugins'),
};
