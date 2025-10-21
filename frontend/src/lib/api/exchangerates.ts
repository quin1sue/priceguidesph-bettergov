
export const fetchExchangeRates = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_FE_DOMAIN}/api/fxrates/`, { method: "GET" });

    if (!response.ok) 
        return {
      error: "Fetching Currency Rates data failed ",
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
