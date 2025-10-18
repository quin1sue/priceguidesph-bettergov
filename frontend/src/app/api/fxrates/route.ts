import { NextResponse } from "next/server";

let cachedResult: unknown = null;
let lastFetched: number | null = null;
const CACHE_DURATION = 1000 * 60 * 15;

export async function GET() {
   const now = Date.now();

   // return cached data if still fresh
    if (cachedResult && lastFetched && now - lastFetched < CACHE_DURATION) {
    return NextResponse.json(cachedResult, {
      headers: {
        "Cache-Control": "s-maxage=900, stale-while-revalidate=300",
      },
    });
  }

  const response = await fetch(
    `https://api.fxratesapi.com/latest?api_key=${process.env.FXRATES_API_KEY}&base=PHP&format=json&places=6&amount=1`
  );
  if (!response.ok) {
    throw new Error("An error has occured!");
  }
  const result = await response.json();
  cachedResult = result;
  lastFetched = now;
  return NextResponse.json(result, {
      headers: {
        "Cache-Control": "s-maxage=900, stale-while-revalidate=300",
      }
});
}
