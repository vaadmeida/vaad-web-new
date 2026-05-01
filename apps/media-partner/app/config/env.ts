export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL!,
  appUrl: process.env.NEXT_PUBLIC_APP_URL!,
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
} as const;

// Validate required env vars
if (!env.apiUrl) {
  throw new Error('NEXT_PUBLIC_API_URL is not defined');
}