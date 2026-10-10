import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import lessonFontFloor from './scripts/lesson-font-floor.mjs';

export default {
  plugins: [tailwindcss(), autoprefixer(), lessonFontFloor()],
};
