const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:10000"
const isDevelopment = process.env.NODE_ENV === "development"

export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${BACKEND_URL}${endpoint}`

  console.log("[v0] API Request:", url, options.method || "GET")
  console.log("[v0] Request body:", options.body)

  try {
    const response = await fetch(url, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    console.log("[v0] API Response Status:", response.status, response.statusText)

    if (!response.ok) {
      const contentType = response.headers.get("content-type")
      let error

      if (contentType?.includes("application/json")) {
        error = await response.json()
      } else {
        const text = await response.text()
        error = { message: text || `Request failed with status ${response.status}` }
      }

      throw new Error(error.message || error.error || "Request failed")
    }

    const contentType = response.headers.get("content-type")
    if (contentType?.includes("application/json")) {
      return await response.json()
    }

    return {}
  } catch (error: any) {
    console.error("[v0] Fetch Error:", error.message)

    if (error.message === "Failed to fetch") {
      throw new Error("Cannot connect to backend. Make sure the backend server is running on port 4000.")
    }

    throw error
  }
}
