/**
 * Rate limiting pro Content API - chrání Railway před nadměrným zatížením
 * 60 požadavků za minutu na IP (admin není omezen)
 */
const store = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 60;

function getClientIp(ctx: { request?: { ip?: string }; req?: { headers?: { 'x-forwarded-for'?: string } } }): string {
  const forwarded = (ctx as { request?: { headers?: { 'x-forwarded-for'?: string } } }).request?.headers?.['x-forwarded-for'];
  if (forwarded) return String(forwarded).split(',')[0].trim();
  return (ctx as { request?: { ip?: string } }).request?.ip || 'unknown';
}

export default (config: { max?: number; windowMs?: number } = {}) => {
  const max = config.max ?? MAX_REQUESTS;
  const windowMs = config.windowMs ?? WINDOW_MS;

  return async (ctx: { path: string; request: { ip?: string; headers?: Record<string, string> }; status: number; body: string; set: (k: string, v: string) => void }, next: () => Promise<void>) => {
    if (ctx.path.startsWith('/admin') || ctx.path.startsWith('/upload')) {
      return next();
    }

    const forwarded = ctx.request?.headers?.['x-forwarded-for'];
    const ip = forwarded ? String(forwarded).split(',')[0].trim() : ctx.request?.ip || 'unknown';
    const now = Date.now();
    let record = store.get(ip);

    if (!record || now > record.resetAt) {
      record = { count: 0, resetAt: now + windowMs };
      store.set(ip, record);
    }

    record.count++;
    if (record.count > max) {
      ctx.status = 429;
      ctx.body = JSON.stringify({ error: 'Too Many Requests', message: 'Příliš mnoho požadavků. Zkuste to později.' });
      return;
    }

    await next();
  };
};
