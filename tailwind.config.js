module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#355220',
        'primary-container': '#4c6b36',
        'on-primary': '#ffffff',
        'on-surface': '#1c1c16',
        'on-surface-variant': '#43483e',
        'surface': '#fdf9ef',
        'surface-container': '#f1eee4',
        'surface-container-low': '#f7f3e9',
        'surface-container-high': '#ece8de',
        'surface-container-lowest': '#ffffff',
        'outline-variant': '#c4c8ba',
        'secondary': '#924c00',
        'secondary-fixed': '#ffdcc4',
        'tertiary': '#6c4103',
        'tertiary-fixed': '#ffdcbb',
        'tertiary-container': '#88581c'
      },
      fontFamily: {
        headline: ['Newsreader', 'serif'],
        body: ['Plus Jakarta Sans', 'sans-serif']
      },
      boxShadow: {
        soft: '0 10px 30px rgba(28,28,22,0.06)'
      }
    }
  },
  plugins: []
};
