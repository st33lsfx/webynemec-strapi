import path from 'path';
import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Database => {
  const client = String(env('DATABASE_CLIENT', 'sqlite')).toLowerCase().trim();

  if (client === 'postgres') {
    const databaseUrl = env('DATABASE_URL');
    if (!databaseUrl) {
      throw new Error('DATABASE_URL is required when DATABASE_CLIENT=postgres');
    }
    return {
      connection: {
        client: 'postgres',
        connection: {
          connectionString: databaseUrl,
          schema: env('DATABASE_SCHEMA', 'public'),
          ssl: env.bool('DATABASE_SSL', false) ? { rejectUnauthorized: true } : false,
        },
        pool: { min: env.int('DATABASE_POOL_MIN', 0), max: env.int('DATABASE_POOL_MAX', 10) },
        acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT', 60000),
      },
    };
  }

  if (client === 'sqlite') {
    return {
      connection: {
        client: 'sqlite',
        connection: {
          filename: path.join(__dirname, '..', '..', env('DATABASE_FILENAME', '.tmp/data.db')),
        },
        useNullAsDefault: true,
        acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT', 60000),
      },
    };
  }

  throw new Error(`Invalid DATABASE_CLIENT: "${client}". Use postgres or sqlite.`);
};

export default config;
