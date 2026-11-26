import { defineConfig } from 'astro/config';
import predlozky from './scripts/predlozky.mjs';

export default defineConfig({
  site: 'https://jplusfk.cz',
  integrations: [predlozky()],
});
