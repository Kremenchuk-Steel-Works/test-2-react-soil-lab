export const getFullPath = (parent: string, child: string) =>
  `${parent.replace(/\/$/, "")}/${child.replace(/^\//, "")}`
