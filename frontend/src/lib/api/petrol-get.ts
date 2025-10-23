import { revalidateCache } from "../utils";

export async function fetchKerosene() {
try {
     const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/fuel-prices?category=Kerosene`,{
            next: revalidateCache
          }
        );
        if (!res.ok) {
            return {
            error: "Failed to fetch kerosene data",
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
        if (!res.ok) {
            return {
            error: "Failed to fetch diesel data",
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
        if (!res.ok) {
            return {
            error: "Failed to fetch diesel data",
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
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/fuel-prices?category=Gasoline`, {
            next: revalidateCache
          }
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