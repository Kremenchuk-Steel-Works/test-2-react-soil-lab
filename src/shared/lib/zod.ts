import { z, ZodType, type ZodTypeAny } from "zod"

export default function optionalObject<T extends ZodTypeAny>(
  schema: T
): ZodType<z.infer<T> | undefined> {
  return z.preprocess((val) => {
    // Если все поля пустые – возвращаем undefined
    if (
      val &&
      typeof val === "object" &&
      !Array.isArray(val) &&
      Object.values(val).every((v) => v === undefined || v === "")
    ) {
      return undefined
    }
    return val
  }, z.union([schema, z.undefined()]))
}

export const parseNumber = (v: unknown) =>
  v === "" || v === null || v === undefined ? undefined : Number(v)

export const toZodEnumValues = <T extends readonly { value: string }[]>(
  options: T
) =>
  options.map((o) => o.value) as [T[number]["value"], ...T[number]["value"][]]
