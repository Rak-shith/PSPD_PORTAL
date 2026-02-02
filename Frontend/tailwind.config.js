export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
          itc: {
            blue: '#003A8F',
            blueDark: '#002C6F',
            gold: '#C9A24D',
            bg: '#F5F7FA',
            surface: '#FFFFFF',
            border: '#E5E7EB',
            text: {
              primary: '#1F2937',
              secondary: '#6B7280',
            },
            success: '#15803D',
            danger: '#B91C1C',
          },
        },
        fontFamily: {
          primary: [
            'Outfit',
            'system-ui',
            '-apple-system',
            'Segoe UI',
            'Roboto',
            'sans-serif',
          ],
        },
        fontSize: {
          h1: '1.5rem',
          h2: '1.25rem',
          h3: '1.125rem',
          body: '0.95rem',
          muted: '0.875rem',
        },
        borderRadius: {
          sm: '4px',
          md: '6px',
          lg: '10px',
        },
      },
    },
  plugins: [],
};
