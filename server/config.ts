export const config = {
  siteUrl: process.env.SITE_URL,
  apiUrl: process.env.API_URL,
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS, 10),
  jwtSecret: process.env.JWT_SECRET,
  port: parseInt(process.env.PORT, 10),
  dev: process.env.NODE_ENV !== 'production',
  dbName: process.env.DATABASE_NAME || 'postgres',
  dbUser: process.env.DATABASE_USER || 'postgres',
  dbPassword: process.env.DATABASE_PASSWORD || undefined,
  dbHost: process.env.DATABASE_HOST,
  slackHook: process.env.SLACK_HOOK
}
