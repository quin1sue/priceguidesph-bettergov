
export const fetchCigarette = async (date?: string) => {
    try {
        const query = new URLSearchParams({ category: "cigarette" });
        if (date) query.set("date", date);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/market?${query.toString()}`,
          {
            method: "GET",
            next: { revalidate: 3600 },
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
