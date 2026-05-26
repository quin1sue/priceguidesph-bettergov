import type { Context, Next } from "hono";
import { Bindings } from "../..";

export async function rateLimiter(
  c: Context<{ Bindings: Bindings }>,
  next: Next,
) {
  const pathname = new URL(c.req.url).pathname;

  const ip = c.req.header("CF-Connecting-IP") ?? "anonymous";

  const { success } = await c.env.FREE_RATE_LIMITER.limit({
    key: `${pathname}:${ip}`,
  });

  if (!success) {
    return c.json(
      {
        success: false,
        error: "Rate limit exceeded",
        status: 429,
      },
      429,
      {
        "Retry-After": "60",
      },
    );
  }

  await next();
}
