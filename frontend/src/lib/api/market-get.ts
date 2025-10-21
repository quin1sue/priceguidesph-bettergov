   export async function fetchMarket() {
    try {
        const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/market?category=market`
      );

      if (!res.ok) {
        return {
            error: "fetching market data failed",
            success: false
        }
    }
      const json = await res.json();

      return json; 
    } catch (err) {
        return {
            error: "fetching market data failed: " + err as string,
            success: false
        }
    }
   
    }