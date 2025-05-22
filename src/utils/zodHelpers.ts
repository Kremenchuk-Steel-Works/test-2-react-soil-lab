import { z, ZodType, type ZodTypeAny } from "zod"

export default function optionalObject<T extends ZodTypeAny>(
  schema: T
): ZodType<z.infer<T> | undefined> {
  return z.preprocess(
    (val) => {
      if (
        val &&
        typeof val === "object" &&
        !Array.isArray(val) &&
        Object.values(val).every((v) => v === undefined || v === "")
      ) {
        return undefined
      }
      return val
    },
    z
      .union([schema, z.undefined()])
      .refine(
        (val): val is z.infer<T> | undefined =>
          val === undefined || schema.safeParse(val).success,
        {
          message:
            "Якщо розділ заповнюється, усі обов’язкові поля мають бути присутні",
        }
      )
  ) as ZodType<z.infer<T> | undefined>
}
