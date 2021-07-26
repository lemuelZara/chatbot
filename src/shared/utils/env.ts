import dotenv from 'dotenv';

dotenv.config();

const ENV_VARS = [
  'PAGE_ID',
  'APP_ID',
  'PAGE_ACCESS_TOKEN',
  'APP_SECRET',
  'VERIFY_TOKEN',
  'APP_URL'
];

export const config = {
  // Messenger Platform API
  apiDomain: 'https://graph.facebook.com',
  apiVersion: 'v11.0',

  // Page and Application information
  pageId: process.env.PAGE_ID as string,
  appId: process.env.APP_ID as string,
  pageAccesToken: process.env.PAGE_ACCESS_TOKEN as string,
  appSecret: process.env.APP_SECRET as string,
  verifyToken: process.env.VERIFY_TOKEN as string,

  // Preferred port (default to 3000)
  port: (process.env.PORT || 3000) as string,

  // URL of tour app domain
  appUrl: process.env.APP_URL as string,

  // Base URL for Messenger Platform API calls
  apiUrl: (): string => {
    return `${config.apiDomain}/${config.apiVersion}`;
  },

  // URL of your webhook endpoint
  webhookUrl: (): string => {
    return `${config.appUrl}/webhook`;
  },

  whitelistedDomains: (): string[] => {
    return [config.appUrl];
  },

  checkEnvVariables: (): void => {
    ENV_VARS.forEach((key) => {
      if (!process.env[key]) {
        console.warn(`WARNING: Missing the environment variable ${key}`);
      } else if (['APP_URL'].includes(key)) {
        const url = process.env[key];

        if (!url?.startsWith('https://')) {
          console.warn(`WARNING: Your ${key} does not begin with "https://"`);
        }
      }
    });
  }
};
