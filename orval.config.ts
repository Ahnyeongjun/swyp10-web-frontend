import { defineConfig } from 'orval';

export default defineConfig({
  chukjibeop: {
    input: 'http://175.45.195.169:8080/v3/api-docs',
    output: {
      target: './apis',
      baseUrl: '',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      mock: true,
      namingConvention: 'PascalCase',
      override: {
        mutator: {
          path: './apis/httpClient.ts',
          name: 'httpClient',
        },
      },
    },
  },
});
