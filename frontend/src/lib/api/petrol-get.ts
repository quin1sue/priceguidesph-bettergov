import { revalidateCache } from "../utils";

export async function fetchKerosene() {
try {
     const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/fuel-prices?category=Kerosene`,{
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

    export async function fetchLPG() {
               try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/fuel-prices?category=LPG`, {
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
export async function fetchDiesel() {
       try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/fuel-prices?category=Diesel`, {
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

export async function fetchGasoline() {
        try { const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/fuel-prices?category=Gasoline`
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