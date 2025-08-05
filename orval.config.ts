import { defineConfig } from 'orval'

const mainServicePath = './src/shared/api/main-service'

export default defineConfig({
  mainService: {
    input: `${mainServicePath}/openapi.json`,

    output: {
      mode: 'tags-split',
      target: `${mainServicePath}/service`,
      schemas: `${mainServicePath}/model`,
      client: 'react-query',
      mock: true,
      prettier: true,
      override: {
        mutator: {
          path: 'src/shared/api/mutator.ts',
          name: 'customMutator',
        },
      },
    },
  },
  mainServiceZod: {
    input: `${mainServicePath}/openapi.json`,

    output: {
      mode: 'tags-split',
      target: `${mainServicePath}/service`,
      client: 'zod',
      fileExtension: '.zod.ts',
      prettier: true,
    },
  },
})
