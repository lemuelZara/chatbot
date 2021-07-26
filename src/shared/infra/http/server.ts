import { app } from './app';

import { config } from '../../utils/env';

config.checkEnvVariables();

app.listen(config.port, () => {
  console.log(`[${new Date().toISOString()}] 🚀 Server is running!`);

  if (config.appUrl && config.verifyToken) {
    console.log('\nIs this the first time running? 🤔');
    console.log(
      'Make sure to set the both the Messenger profile and webhook by visiting:'
    );
    console.log(
      `⚡ ${`${config.appUrl}/profile?mode=all&verify_token=${config.verifyToken}`}`
    );
  }

  if (config.pageId) {
    console.log('\nTest your app by messaging:');
    console.log(`⚡ https://m.me/${config.pageId}`);
  }
});
