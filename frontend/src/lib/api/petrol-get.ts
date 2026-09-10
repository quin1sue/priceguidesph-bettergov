import { revalidateCache } from "../utils";

export async function fetchKerosene(date?: string) {
try {
     const query = new URLSearchParams({ category: "Kerosene" });
     if (date) query.set("date", date);
     const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/fuel-prices?${query.toString()}`,{
            next: revalidateCache
          }
        );
            const errorMessage = res.status === 429 ? "Whoa! You’re requesting too fast. Take a short break and try again soon." : "fetching kerosene data failed"

        if (!res.ok) {
            return {
            error: errorMessage,
            success: false
        }
        }
        const result = await res.json();

        return result
} catch (err) {
    return {
        error: "Failed to fetch kerosene data: " + err as string,
        success: false
    }
}      
    }

    export async function fetchLPG(date?: string) {
               try {
        const query = new URLSearchParams({ category: "LPG" });
        if (date) query.set("date", date);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/fuel-prices?${query.toString()}`, {
            next: revalidateCache
          }
        );

            const errorMessage = res.status === 429 ? "Whoa! You’re requesting too fast. Take a short break and try again soon." : "fetching market data failed"

        if (!res.ok) {
            return {
            error: errorMessage,
            success: false
        }
        }
        const result = await res.json();

        return result
       } catch (err) {
        return {
            error: "Failed to fetch diesel data: " + err as string,
            success: false
        }
       }
    }
export async function fetchDiesel(date?: string) {
       try {
        const query = new URLSearchParams({ category: "Diesel" });
        if (date) query.set("date", date);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/fuel-prices?${query.toString()}`, {
            next: revalidateCache
          }
        );
          const errorMessage = res.status === 429 ? "Whoa! You’re requesting too fast. Take a short break and try again soon." : "fetching market data failed"

        if (!res.ok) {
            return {
            error: errorMessage,
            success: false
        }
        }
        const result = await res.json();

        return result
       } catch (err) {
        return {
            error: "Failed to fetch diesel data: " + err as string,
            success: false
        }
       }
    }

export async function fetchGasoline(date?: string) {
        try {
          const query = new URLSearchParams({ category: "Gasoline" });
          if (date) query.set("date", date);
          const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/fuel-prices?${query.toString()}`
        );
        if (!res.ok) {

           return {
            error: "Failed to fetch gasoline data",
            success: false
        }
        }
        const result = await res.json();

        return result
    } catch (err) {
        return {
            error: "Failed to fetch gasoline data: " + err as string,
            success: false,
        }
    }
    }
