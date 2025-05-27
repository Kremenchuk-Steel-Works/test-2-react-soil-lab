import type { AxiosError } from "axios"
import { api } from "../api/client"
import type { User, UsersAdd, UsersData, UsersEdit } from "../types/user"
import snakecaseKeys from "snakecase-keys"
import type { PageParams } from "../types/pagination.types"

export async function apiUsersMe() {
  try {
    const response = await api.get(`/users/me`)
    const user: User = response.data
    return user
  } catch (err) {
    const error = err as AxiosError
    if (error.response) {
      throw new Error(`Помилка сервера: ${error.response.status}`)
    } else if (error.request) {
      // Запрос был сделан, но ответ не получен (сервер упал)
      throw new Error("Сервер не відповідає. Спробуйте пізніше.")
    } else {
      // Что-то другое пошло не так
      throw new Error("Помилка запиту: " + error.message)
    }
  }
}

export async function apiUsers(params?: PageParams) {
  try {
    const snakeParams = snakecaseKeys({ ...params })
    const response = await api.get(`/users`, { params: snakeParams })
    const usersData: UsersData = response.data
    return usersData
  } catch (err) {
    const error = err as AxiosError
    if (error.response) {
      throw new Error(`Помилка сервера: ${error.response.status}`)
    } else if (error.request) {
      // Запрос был сделан, но ответ не получен (сервер упал)
      throw new Error("Сервер не відповідає. Спробуйте пізніше.")
    } else {
      // Что-то другое пошло не так
      throw new Error("Помилка запиту: " + error.message)
    }
  }
}

export async function apiUsersAdd({ email, rawPassword, profile }: UsersAdd) {
  try {
    const response = await api.post(`/users/`, {
      email,
      rawPassword,
      profile,
    })
    const user: User = response.data
    return user
  } catch (err) {
    const error = err as AxiosError
    if (error.response) {
      // Сервер ответил, но статус не 2xx
      if (error.response.status >= 400 && error.response.status < 500) {
        throw new Error("Некоректні дані")
      } else {
        throw new Error(`Помилка сервера: ${error.response.status}`)
      }
    } else if (error.request) {
      // Запрос был сделан, но ответ не получен (сервер упал)
      throw new Error("Сервер не відповідає. Спробуйте пізніше.")
    } else {
      // Что-то другое пошло не так
      throw new Error("Помилка запиту: " + error.message)
    }
  }
}

export async function apiUsersDetail(id: string) {
  try {
    const response = await api.get(`/users/${id}`)
    const user: User = response.data
    return user
  } catch (err) {
    const error = err as AxiosError
    if (error.response) {
      throw new Error(`Помилка сервера: ${error.response.status}`)
    } else if (error.request) {
      // Запрос был сделан, но ответ не получен (сервер упал)
      throw new Error("Сервер не відповідає. Спробуйте пізніше.")
    } else {
      // Что-то другое пошло не так
      throw new Error("Помилка запиту: " + error.message)
    }
  }
}

export async function apiUsersEdit(id: string, { email, profile }: UsersEdit) {
  try {
    const response = await api.put(`/users/${id}`, {
      email,
      profile,
    })
    const user: User = response.data
    return user
  } catch (err) {
    const error = err as AxiosError
    if (error.response) {
      // Сервер ответил, но статус не 2xx
      if (error.response.status >= 400 && error.response.status < 500) {
        throw new Error("Некоректні дані")
      } else {
        throw new Error(`Помилка сервера: ${error.response.status}`)
      }
    } else if (error.request) {
      // Запрос был сделан, но ответ не получен (сервер упал)
      throw new Error("Сервер не відповідає. Спробуйте пізніше.")
    } else {
      // Что-то другое пошло не так
      throw new Error("Помилка запиту: " + error.message)
    }
  }
}
