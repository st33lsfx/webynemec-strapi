import type { Core } from '@strapi/strapi';

const frontendUrl = process.env.FRONTEND_URL || 'https://webynemec.cz';
const corsOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  frontendUrl,
  'https://webynemec.cz',
  'https://www.webynemec.cz',
];

const config: Core.Config.Middlewares = [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'img-src': ["'self'", 'data:', 'blob:', 'market-assets.strapi.io', 'res.cloudinary.com'],
          'media-src': ["'self'", 'data:', 'blob:', 'market-assets.strapi.io', 'res.cloudinary.com'],
        },
      },
    },
  },
  { name: 'global::rate-limit', config: { max: 60, windowMs: 60000 } },
  {
    name: 'strapi::cors',
    config: {
      origin: (ctx: { request: { header: { origin?: string } } }): string | string[] => {
        const origin = ctx.request.header.origin;
        if (origin && (corsOrigins.includes(origin) || origin.endsWith('.vercel.app'))) {
          return origin;
        }
        return corsOrigins[0];
      },
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
      headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
      keepHeaderOnError: true,
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];

export default config;
