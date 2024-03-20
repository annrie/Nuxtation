import antfu from '@antfu/eslint-config';
import nuxt from './.nuxt/eslint.config.mjs';

export default antfu(
  {
  // your custom antfu config here.
  },
  ...nuxt,
  // your custom flat config here.
)
