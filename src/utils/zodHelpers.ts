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
