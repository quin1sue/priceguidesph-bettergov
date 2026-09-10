export async function fetchConstructionPrices(date?: string) {
  try {
    const query = new URLSearchParams();
    if (date) query.set("date", date);
    const qs = query.toString() ? `?${query.toString()}` : "";
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/construction-prices${qs}`,
      { next: { revalidate: 3600 } },
    );
    const errorMessage =
      res.status === 429
        ? "Whoa! You're requesting too fast. Take a short break and try again soon."
        : "Fetching construction data failed";
    if (!res.ok) return { error: errorMessage, success: false };
    return res.json();
  } catch (err) {
    return { error: `Fetching construction data failed: ${err}`, success: false };
  }
}
