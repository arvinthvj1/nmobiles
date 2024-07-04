import { nextui } from '@nextui-org/theme'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  darkMode: "class", // Enable dark mode using a class
  plugins: [nextui({
    themes: {
      dark: {
        colors: {
          primary: {
            DEFAULT: "#FF00FF",
            foreground: "#000000",
          },
          focus: "#BEF264",
          danger: {
            DEFAULT: "#BEF264",
            foreground: "#000000",
          },
        },
      },
      light: {
        colors: {
          primary: {
            DEFAULT: "#BEF264",
            foreground: "#000000",
          },
          focus: "#BEF264",
          danger: {
            DEFAULT: "#BEF264",
            foreground: "#000000",
          },
        },
      },
    },
    layout: {
      disabledOpacity: "0.3", // opacity-[0.3]
      radius: {
        small: "2px", // rounded-small
        medium: "4px", // rounded-medium
        large: "6px", // rounded-large
      },
      borderWidth: {
        small: "1px", // border-small
        medium: "1px", // border-medium
        large: "2px", // border-large
      },
    }
  })],
}
