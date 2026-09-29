import 'dotenv/config';
import process from 'node:process';

/**
 * Central env config.
 * - Loads once
 * - Validates required vars
 * - Freezes result so nothing mutates at runtime
 */
const required = ['MONGO_URI', 'JWT_SECRET'];
const optional = {
  PORT: '5000',
  NODE_ENV: 'development',
  CLIENT_URL: 'http://localhost:5173',
  JWT_EXPIRES_IN: '7d',
  COOKIE_NAME: 'token',
};

const missing = required.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(`❌ Missing required env vars: ${missing.join(', ')}`);
  process.exit(1);
}

const env = {
  NODE_ENV: process.env.NODE_ENV || optional.NODE_ENV,
  PORT: Number(process.env.PORT) || Number(optional.PORT),
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || optional.JWT_EXPIRES_IN,
  CLIENT_URL: process.env.CLIENT_URL || optional.CLIENT_URL,
  COOKIE_NAME: process.env.COOKIE_NAME || optional.COOKIE_NAME,
  IS_PROD: (process.env.NODE_ENV || 'development') === 'production',
};

export default Object.freeze(env);