import axios from "axios"
import { API_URL } from "../config/env"
import axiosCaseConverter from "axios-case-converter"

export const api = axiosCaseConverter(
  axios.create({
    baseURL: API_URL,
    headers: { "Content-Type": "application/json" },
    timeout: 5_000,
  })
)
