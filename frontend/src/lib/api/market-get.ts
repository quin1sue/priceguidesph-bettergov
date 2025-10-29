
export async function fetchMarket() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/market?category=market`
    );
    const errorMessage = res.status === 429 ? "Whoa! You’re requesting too fast. Take a short break and try again soon." : "fetching market data failed"
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
      error: ("fetching market data failed: " + err) as string,
      success: false,
    };
  }
}

export async function fetchDrugPrice() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/drugprice`
    );

        const errorMessage = res.status === 429 ? "Whoa! You’re requesting too fast. Take a short break and try again soon." : "fetching drug data failed"

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
      error: ("fetching drug data failed: " + err) as string,
      success: false,
    };
  }
}
