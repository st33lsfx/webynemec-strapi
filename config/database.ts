import path from 'path';

export default ({ env }) => {
  // Railway: vždy použij postgres, jinak SQLite = data se mažou při restartu
  const client = env('DATABASE_CLIENT', 'sqlite');

  // Railway PostgreSQL: DATABASE_URL nebo DATABASE_PUBLIC_URL
  const databaseUrl =
    env('DATABASE_URL') ||
    env('DATABASE_PUBLIC_URL') ||
    (env('PGHOST') && env('PGUSER') && env('PGPASSWORD') && env('PGDATABASE')
      ? `postgresql://${env('PGUSER')}:${env('PGPASSWORD')}@${env('PGHOST')}:${env.int('PGPORT', 5432)}/${env('PGDATABASE')}`
      : null);

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
      connection: databaseUrl
        ? {
            connectionString: databaseUrl,
            ssl: (databaseUrl.includes('railway') || env.bool('DATABASE_SSL', false)) && {
              rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', false),
            },
            schema: env('DATABASE_SCHEMA', 'public'),
          }
        : {
            host: env('DATABASE_HOST', 'localhost'),
            port: env.int('DATABASE_PORT', 5432),
            database: env('DATABASE_NAME', 'strapi'),
            user: env('DATABASE_USERNAME', 'strapi'),
            password: env('DATABASE_PASSWORD', 'strapi'),
            ssl: env.bool('DATABASE_SSL', false) && {
              rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', true),
            },
            schema: env('DATABASE_SCHEMA', 'public'),
          },
      pool: {
        min: env.int('DATABASE_POOL_MIN', 0),
        max: env.int('DATABASE_POOL_MAX', 10),
        acquireTimeoutMillis: env.int('DATABASE_ACQUIRE_TIMEOUT', 60000),
        createTimeoutMillis: env.int('DATABASE_CREATE_TIMEOUT', 30000),
        idleTimeoutMillis: env.int('DATABASE_IDLE_TIMEOUT', 30000),
        reapIntervalMillis: env.int('DATABASE_REAP_INTERVAL', 1000),
      },
    },
    sqlite: {
      connection: {
        filename: path.join(__dirname, '..', '..', env('DATABASE_FILENAME', '.tmp/data.db')),
      },
      useNullAsDefault: true,
    },
  };

  return {
    connection: {
      client,
      ...connections[client],
      acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT', 60000),
    },
  };
};
