
export async function fetchIndicators() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/economic-indicator/list`, {
        method: "GET",
    })

        const errorMessage = response.status === 429 ? "Whoa! You’re requesting too fast. Take a short break and try again soon.": "fetching currency rates data failed"
    if (!response.ok) {
        return {
            error: errorMessage,
            success: false
        }
    }
     const result = await response.json();
    
    return {
      name: "Economic Indicators",
      success: true,
      ...result,
    };
}