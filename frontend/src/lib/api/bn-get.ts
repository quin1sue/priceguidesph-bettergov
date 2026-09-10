export async function fetchBnPrices(date?: string) {
  try {
    const query = new URLSearchParams();
    if (date) query.set("date", date);
    
    const queryString = query.toString() ? `?${query.toString()}` : "";
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/bn-prices${queryString}`,
      { next: { revalidate: 3600 } },
    );
    
    const errorMessage = res.status === 429 
      ? "Whoa! You're requesting too fast. Take a short break and try again soon." 
      : "fetching bn data failed";
      
    if (!res.ok) {
      return {
        error: errorMessage,
        success: false,
      };
    }
    
    const json = await res.json();
    return json;
  } catch (err) {
    return {
      error: ("fetching bn data failed: " + err) as string,
      success: false,
    };
  }
}
