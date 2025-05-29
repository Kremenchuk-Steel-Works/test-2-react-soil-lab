export const formTransformers = {
  number: {
    setValueAs: (v: unknown) =>
      v === "" || v === null || v === undefined ? undefined : Number(v),
  },
  string: {
    setValueAs: (v: unknown) => {
      if (typeof v !== "string") return v
      const trimmed = v.trim()
      return trimmed === "" ? undefined : trimmed
    },
  },
}
