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

    // Try to get response text first to see what we got
    const responseText = await response.text()
    console.log("[v0] Raw Response:", responseText)

    if (!response.ok) {
      let error
      try {
        error = JSON.parse(responseText)
      } catch {
        error = { message: responseText || `HTTP ${response.status}` }
      }
      console.error("[v0] API Error:", error)
      throw new Error(error.message || error.error || `HTTP ${response.status}`)
    }

    const data = responseText ? JSON.parse(responseText) : {}
    console.log("[v0] API Success:", data)
    return data
  } catch (error: any) {
    console.error("[v0] Fetch Error:", error.message)

    if (error.message === "Failed to fetch") {
      throw new Error(
        "Cannot connect to backend. Please check:\n" +
          "1. Backend is running on Render\n" +
          "2. CORS is enabled for Vercel domain\n" +
          "3. Network connection is stable",
      )
    }

    throw error
  }
}
