
export const fetchCigarette = async () => {
    try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/market?category=cigarette`,
          {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }
        );
          const errorMessage = res.status === 429 ? "Whoa! You’re requesting too fast. Take a short break and try again soon." : "fetching market data failed"

        if (!res.ok) return {
            error: errorMessage,
            success: false
        }
      const result = await res.json()

      return result;
    } catch (err) {
        return {
            error: "Failed to fetch cigarette data" + err as string,
            success: false
        }
    }
        
};