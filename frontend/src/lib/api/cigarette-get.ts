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
        if (!res.ok) return {
            error: "failed to fetch cigarette data",
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