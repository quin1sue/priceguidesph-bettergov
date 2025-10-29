
export const fetchExchangeRates = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_FE_DOMAIN}/api/fxrates/`, {
       next: {revalidate: 30}
       ,method: "GET" });
    const errorMessage = response.status === 429 ? "Whoa! You’re requesting too fast. Take a short break and try again soon.": "fetching currency rates data failed"

    if (!response.ok) 
        return {
      error: errorMessage,
      success: false,
    };

    const result = await response.json();
    
    return {
      name: "Currency Rates",
      description:
        "Track daily foreign exchange rates for major global currencies against the Philippine Peso (PHP). Stay informed on currency trends to help you make smarter financial decisions.",
      ...result,
    };
  } catch (err) {
    
    return {
      error: "An error has occurred: " + err as string,
      success: false,
    };
  }
};
