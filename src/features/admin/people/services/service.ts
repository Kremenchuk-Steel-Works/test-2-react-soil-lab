import { api } from "../../../../api/client"
import { handleAxiosError } from "../../../../lib/axios"
import { logger } from "../../../../lib/logger"
import type { PageParams } from "../../../../types/pagination"
import type {
  PersonCreateRequest,
  PersonUpdateRequest,
} from "../types/request.dto"
import type {
  PersonDetailResponse,
  PersonListResponse,
  PersonLookupResponse,
} from "../types/response.dto"

function undefinedToNull<T>(obj: T): T {
  if (obj === undefined) {
    return null as any
  }
  if (obj === null || typeof obj !== "object") {
    return obj
  }
  if (Array.isArray(obj)) {
    return obj.map(undefinedToNull) as any
  }
  // Обработка объектов
  const result = {} as any
  for (const key in obj) {
    const value = (obj as any)[key]
    result[key] = undefinedToNull(value)
  }
  return result as T
}

export function nullsToUndefined<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return undefined as any
  }
  if (obj instanceof Date) {
    return obj as any
  }
  if (Array.isArray(obj)) {
    return obj.map(nullsToUndefined) as any
  }
  if (typeof obj === "object") {
    const result: any = {}
    for (const key in obj as any) {
      result[key] = nullsToUndefined((obj as any)[key])
    }
    return result
  }
  return obj as any
}

export const peopleService = {
  // Request
  async create(params: PersonCreateRequest): Promise<PersonDetailResponse> {
    try {
      logger.debug(params)

      // TEMPORARILY
      params = undefinedToNull(params)

      const response = await api.post(`/people/`, params)
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },

  async update(
    id: string,
    params: PersonUpdateRequest
  ): Promise<PersonDetailResponse> {
    try {
      logger.debug(params)

      // TEMPORARILY
      params = undefinedToNull(params)

      const response = await api.put(`/people/${id}`, params)
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },

  // Response
  async getList(params?: PageParams): Promise<PersonListResponse> {
    try {
      const response = await api.get(`/people`, { params })
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },

  async getById(id: string): Promise<PersonDetailResponse> {
    try {
      console.log(id)
      const response = await api.get(`/people/${id}`)
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },

  async getLookup(): Promise<PersonLookupResponse[]> {
    try {
      const response = await api.get(`/lookups/people`)
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },
}
