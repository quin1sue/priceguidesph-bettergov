import type { Context, Next } from "hono";
import { Bindings } from "../..";

export async function rateLimiter(c: Context<{ Bindings: Bindings }>, next: Next) {
  const { pathname } = new URL(c.req.url);
  const { success } = await c.env.FREE_RATE_LIMITER.limit({ key: pathname });

  if (!success) {
    return c.json({ success: false, error: `Rate limit exceeded for ${pathname}`, status: 429}, 429, {
      "Retry-After": "60"
    });
  }

  await next();
}