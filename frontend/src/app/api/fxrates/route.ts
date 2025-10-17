import { NextResponse } from "next/server";
export async function GET() {
  const response = await fetch(
    `https://api.fxratesapi.com/latest?api_key=${process.env.FXRATES_API_KEY}&base=USD&format=json&places=6&amount=1`
  );
  if (!response.ok) {
    throw new Error("An error has occured!");
  }
  const result = await response.json();
  return NextResponse.json(result);
}
