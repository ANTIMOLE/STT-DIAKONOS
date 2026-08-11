import dotenv from 'dotenv';
import path from 'path';

// Load .env file based on NODE_ENV (fallback to .env if not specified)
const envPath = process.env.NODE_ENV === 'production'
  ? path.resolve(process.cwd(), '.env.production')
  : path.resolve(process.cwd(), '.env');

dotenv.config({ path: envPath });

// Environment variable types
interface EnvConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  FRONTEND_URL: string;
  COOKIE_DOMAIN: string;
  RECAPTCHA_SECRET_KEY: string;
  SERVE_FRONTEND: boolean;
}

// Validate required environment variables
const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
];

const missingEnvVars = requiredEnvVars.filter(
  (envVar) => !process.env[envVar]
);

if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvVars.join(', ')}`
  );
}

// Export typed environment config
export const env: EnvConfig = {
  NODE_ENV: (process.env.NODE_ENV as EnvConfig['NODE_ENV']) || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  DATABASE_URL: process.env.DATABASE_URL!,
  JWT_SECRET: process.env.JWT_SECRET!,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  COOKIE_DOMAIN: process.env.COOKIE_DOMAIN || 'localhost',
  RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY || '',
  SERVE_FRONTEND: process.env.SERVE_FRONTEND === 'true',
};

// Validate PORT
if (isNaN(env.PORT) || env.PORT < 1 || env.PORT > 65535) {
  throw new Error('PORT must be a valid port number (1-65535)');
}

// Validate JWT_SECRET length
if (env.JWT_SECRET.length < 32) {
  console.warn(
    '⚠️  WARNING: JWT_SECRET should be at least 32 characters for security'
  );
}

export default env;