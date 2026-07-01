module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#EDE6D6',
          dark: '#E0D6BE',
        },
        ink: '#21281F',
        moss: {
          50: '#EEF2ED',
          100: '#D6DFD4',
          200: '#AEBFA9',
          300: '#87A080',
          400: '#628460',
          500: '#445C43',
          600: '#374C37',
          700: '#2E4230',
          800: '#243425',
          900: '#1A251B',
        },
        clay: {
          50: '#FBEEE6',
          100: '#F3D3BE',
          400: '#D07845',
          500: '#BE5B2E',
          600: '#A24923',
          700: '#7E3A1C',
        },
        mustard: {
          50: '#FBF3E2',
          100: '#F3DFA8',
          400: '#DDB458',
          500: '#D3A23A',
          600: '#B4842A',
        },
        line: '#C7BC9E',
      },
      fontFamily: {
        display: ['"Archivo"', 'sans-serif'],
        body: ['"IBM Plex Sans"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      borderRadius: {
        tag: '4px 4px 14px 14px',
      },
    }
  },
  plugins: []
}
