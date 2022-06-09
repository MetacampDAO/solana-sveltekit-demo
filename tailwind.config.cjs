module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  darkMode: 'class',
  theme: {
    screens: {
      xs: "420px",
      md: "580px"
    },
    extend: {
      fontFamily: {
        main: ["Nunito", "serif"],
      },
      colors: {
        'primary': '#A170D9',
        'secondary': '#05CAB6',
        'tertiary': '#0088cc',
        'light': '#e2e8f0',
        'grey': '#64748b',
        'dark': '#334155',
      },
      backgroundImage: {
        'main': "url('$lib/assets/images/branding/OpenHaus.svg')",
      }
    },
  },
  plugins: [
  ],
}
