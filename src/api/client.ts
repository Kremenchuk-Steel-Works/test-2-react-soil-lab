import axios from "axios"
import { API_URL } from "../config/env"
import axiosCaseConverter from "axios-case-converter"
import { nullsToUndefined } from "./transformers"

// Создаем базовый инстанс
const baseApi = axios.create({
  baseURL: API_URL,
  timeout: 5_000,
})

// Сначала применяем конвертер регистров
export const api = axiosCaseConverter(baseApi)

// Затем добавляем наш собственный интерсептор для очистки данных
api.interceptors.response.use((response) => {
  // Проверяем, есть ли данные для трансформации
  if (response.data) {
    response.data = nullsToUndefined(response.data)
  }
  return response
})
