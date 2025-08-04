import { defineConfig } from 'orval'

export default defineConfig({
  api: {
    // Входные данные: путь к твоему OpenAPI/Swagger файлу (локальный или по URL)
    input: 'src/shared/api/main-service/openapi.json',

    // Выходные данные: где будут лежать сгенерированные файлы
    output: {
      // Режим: один большой файл или разделение по тегам API
      mode: 'tags-split',

      // Директория для сгенерированных файлов
      target: 'src/shared/api/endpoints',

      // Типы для всех запросов и ответов
      schemas: 'src/shared/api/schemas',

      // Конфигурация клиента (в нашем случае — React Query)
      client: 'react-query',

      // Включаем prettier для форматирования сгенерированного кода
      prettier: true,

      // Настройки для кастомизации
      override: {
        // Конфигурация мутаторов (как именно будет выполняться запрос)
        mutator: {
          path: 'src/shared/api/mutator.ts', // Путь к файлу с кастомной функцией запроса
          name: 'customMutator', // Имя функции-мутатора
        },
      },
    },
    // Хуки для дополнительной обработки (здесь мы тоже можем влиять на имена)
    hooks: {
      afterAllFilesWrite: 'prettier --write',
    },
  },
})
