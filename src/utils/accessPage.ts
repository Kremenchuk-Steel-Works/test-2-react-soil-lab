import { useAuth } from "../components/AuthProvider/AuthContext"

export default function getAccessPages() {
  const { currentUser } = useAuth()
  const pages = []

  for (const page of currentUser?.permissions ?? []) {
    if (page.name.includes("_view")) {
      const pageCopy = { ...page }
      pageCopy.name = page.name.split("_view")[0]
      pages.push(pageCopy)
    }
  }
  return pages
}
