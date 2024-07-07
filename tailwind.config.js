// tailwind.config.js
module.exports = {
  content: [
    "client/src/**/*.{js,jsx,ts,tsx,html}", // Adjust according to your project structure
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ffffff', // White background for a clean look
        secondary: '#000000', // Black text for high contrast
        accent: '#ff3e00', // Bright accent color for highlights
        muted: '#7a7a7a', // Muted gray for secondary elements
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Modern, clean font
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        modern: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: '#ffffff',
          secondary: '#000000',
          accent: '#ff3e00',
          neutral: '#3d4451',
          'base-100': '#ffffff',
          info: '#2094f3',
          success: '#009485',
          warning: '#ff9900',
          error: '#ff5724',
        },
      },
    ],
  },
}
