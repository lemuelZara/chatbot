import { config, GraphApi, i18n } from '../../../shared/utils';

const locales = i18n.getLocales();

type GetStarted = {
  get_started: {
    payload: string;
  };
};

type GreetingText = {
  locale: string;
  text: string;
};

type Greeting = {
  greeting: GreetingText[];
};

type MenuItem = {
  type: string;
  title: string;
  payload?: string;
  url?: string;
  webview_height_ratio?: string;
};

type Menu = {
  locale: string;
  composer_input_disabled: boolean;
  call_to_actions: MenuItem[];
};

type PersistentMenu = {
  persistent_menu: Menu[];
};

type WhitelistedDomain = {
  whitelisted_domains: string[];
};

/* eslint no-underscore-dangle: off */
/* eslint no-restricted-syntax: off */
export class ProfileHelper {
  public async setWebhook(): Promise<any> {
    const subscriptions = await GraphApi.callSubscriptionsApi();
    const subscribedApps = await GraphApi.callSubscribedApps();

    return {
      subscriptions,
      subscribedApps
    };
  }

  public async setGetStarted(): Promise<any> {
    const getStartedPayload = this.getGetStarted();

    return {
      getStarted: await GraphApi.callMessengerProfileApi(getStartedPayload)
    };
  }

  public async setGreeting(): Promise<any> {
    const getGreetingPayload = this.getGreeting();

    return {
      greeting: await GraphApi.callMessengerProfileApi(getGreetingPayload)
    };
  }

  public async setPersistentMenu(): Promise<any> {
    const getPersistentMenuPayload = this.getPersistentMenu();

    return {
      persistentMenu: await GraphApi.callMessengerProfileApi(
        getPersistentMenuPayload
      )
    };
  }

  public async setWhitelistedDomains(): Promise<any> {
    const domainPayload = this.getWhitelistedDomains();

    return {
      whitelistedDomains: await GraphApi.callMessengerProfileApi(domainPayload)
    };
  }

  public getGetStarted(): GetStarted {
    return {
      get_started: {
        payload: 'GET_STARTED'
      }
    };
  }

  public getGreeting(): Greeting {
    const greetings: GreetingText[] = [];
    for (const locale of locales) {
      greetings.push(this.getGreetingText(locale));
    }

    return {
      greeting: greetings
    };
  }

  public getGreetingText(locale: string): GreetingText {
    const param = locale === 'en_US' ? 'default' : locale;

    i18n.setLocale(locale);

    const localizedGreeting: GreetingText = {
      locale: param,
      text: i18n.__('profile.greeting', {
        user_first_name: '{{user_first_name}}'
      })
    };

    return localizedGreeting;
  }

  public getPersistentMenu(): PersistentMenu {
    const menuItems: Menu[] = [];

    for (const locale of locales) {
      menuItems.push(this.getMenuItems(locale));
    }

    return {
      persistent_menu: menuItems
    };
  }

  public getMenuItems(locale: string): Menu {
    const param = locale === 'en_US' ? 'default' : locale;

    i18n.setLocale(locale);

    const localizedMenu: Menu = {
      locale: param,
      composer_input_disabled: false,
      call_to_actions: [
        {
          title: i18n.__('menu.order'),
          type: 'postback',
          payload: 'TRACK_ORDER'
        },
        {
          title: i18n.__('menu.help'),
          type: 'postback',
          payload: 'CARE_HELP'
        },
        {
          title: i18n.__('menu.suggestion'),
          type: 'postback',
          payload: 'CURATION'
        },
        {
          type: 'web_url',
          title: i18n.__('menu.shop'),
          url: 'https://google.com',
          webview_height_ratio: 'full'
        }
      ]
    };

    return localizedMenu;
  }

  public getWhitelistedDomains(): WhitelistedDomain {
    const whitelistedDomains = {
      whitelisted_domains: config.whitelistedDomains()
    };

    return whitelistedDomains;
  }
}
