'use strict';

const path = require('path');

/**
 * Database config - .js verze pro načtení při strapi start.
 * Config loader načítá pouze .js a .json, .ts se kompiluje do dist/.
 */
module.exports = ({ env }) => {
  const client = String(env('DATABASE_CLIENT', 'sqlite')).toLowerCase().trim();

  const connections = {
    mysql: {
      connection: {
        host: env('DATABASE_HOST', 'localhost'),
        port: env.int('DATABASE_PORT', 3306),
        database: env('DATABASE_NAME', 'strapi'),
        user: env('DATABASE_USERNAME', 'strapi'),
        password: env('DATABASE_PASSWORD', 'strapi'),
        ssl: env.bool('DATABASE_SSL', false) && {
          rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', true),
        },
      },
      pool: { min: env.int('DATABASE_POOL_MIN', 0), max: env.int('DATABASE_POOL_MAX', 10) },
    },
    postgres: {
      connection: {
        connectionString: env('DATABASE_URL'),
        host: env('DATABASE_HOST', 'localhost'),
        port: env.int('DATABASE_PORT', 5432),
        database: env('DATABASE_NAME', 'strapi'),
        user: env('DATABASE_USERNAME', 'strapi'),
        password: env('DATABASE_PASSWORD', 'strapi'),
        schema: env('DATABASE_SCHEMA', 'public'),
        ssl: env.bool('DATABASE_SSL', false) ? { rejectUnauthorized: true } : false,
      },
      pool: { min: env.int('DATABASE_POOL_MIN', 0), max: env.int('DATABASE_POOL_MAX', 10) },
    },
    sqlite: {
      connection: {
        filename: path.join(__dirname, '..', env('DATABASE_FILENAME', '.tmp/data.db')),
      },
      useNullAsDefault: true,
    },
  };

  if (client === 'postgres' && !env('DATABASE_URL')) {
    throw new Error('DATABASE_URL is required when DATABASE_CLIENT=postgres. Check Railway Variables.');
  }

  const connectionConfig = connections[client];
  if (!connectionConfig) {
    throw new Error(`Invalid DATABASE_CLIENT: "${client}". Use mysql, postgres, or sqlite.`);
  }

  return {
    connection: {
      client,
      ...connectionConfig,
      acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT', 60000),
    },
  };
};
