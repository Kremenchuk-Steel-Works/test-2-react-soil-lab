export const formTransformers = {
  number: {
    setValueAs: (v: unknown) =>
      v === "" || v === null || v === undefined ? undefined : Number(v),
  },
}
