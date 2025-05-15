import { useAuth } from "../components/AuthProvider/AuthContext"

export default function useAccessPages() {
  const { currentUser } = useAuth()
  const pages = []

  for (const page of currentUser?.permissions ?? []) {
    let pageCopy
    if (page.name.includes("_view")) {
      pageCopy = { ...page }
      pageCopy.name = page.name.split("_view")[0]
    } else if (page.name === "admin") {
      pageCopy = { ...page }
    } else continue
    pages.push(pageCopy)
  }
  return pages
}
