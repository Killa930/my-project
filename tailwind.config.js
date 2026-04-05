/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './resources/**/*.{js,jsx,ts,tsx,blade.php}',
  ],
  theme: {
    extend: {
      colors: {
        // Основной акцентный цвет (кнопки, цены, ссылки)
        accent: {
          DEFAULT: '#f59e0b', // amber-500
          hover:   '#d97706', // amber-600
          light:   '#fef3c7', // amber-100
          dark:    '#92400e', // amber-800
        },
        // Фон страниц и карточек
        surface: {
          primary:   '#030712', // gray-950 — фон страницы
          secondary: '#111827', // gray-900 — карточки, панели
          tertiary:  '#1f2937', // gray-800 — поля ввода, бейджи
        },
        // Границы
        border: {
          DEFAULT: '#1f2937', // gray-800
          hover:   '#374151', // gray-700
        },
        // Текст
        content: {
          primary:   '#f3f4f6', // gray-100 — основной текст
          secondary: '#9ca3af', // gray-400 — подписи
          muted:     '#6b7280', // gray-500 — неактивный
        },
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        display: ['Bebas Neue', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      }
    },
  },
  plugins: [],
}
