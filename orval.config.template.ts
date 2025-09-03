import type { Config } from 'orval'

/**
 * Создает конфигурацию Orval для указанного сервиса.
 * @param serviceName - Уникальное имя сервиса (например, 'mainService').
 * @param servicePath - Путь к директории сервиса (например, './src/shared/api/main-service').
 * @returns Конфигурация для Orval.
 */
export const createOrvalConfig = (serviceName: string, servicePath: string): Config => {
  const input = `${servicePath}/openapi.json`

  // Возвращаем чистый объект конфигурации без обертки defineConfig
  return {
    [serviceName]: {
      input,
      output: {
        mode: 'tags-split',
        target: `${servicePath}/endpoints`,
        schemas: `${servicePath}/model`,
        client: 'react-query',
        mock: true,
        override: {
          mutator: {
            path: './src/shared/api/mutator.ts',
            name: 'customMutator',
          },
        },
      },
      hooks: {
        afterAllFilesWrite: 'prettier --write',
      },
    },
    // [`${serviceName}Zod`]: {
    //   input,
    //   output: {
    //     mode: 'tags-split',
    //     target: `${servicePath}/endpoints`,
    //     client: 'zod',
    //     fileExtension: '.zod.ts',
    //   },
    //   hooks: {
    //     afterAllFilesWrite: 'prettier --no-error-on-unmatched-pattern --write',
    //   },
    // },
  }
}
