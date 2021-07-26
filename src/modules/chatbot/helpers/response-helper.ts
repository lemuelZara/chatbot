import { i18n } from '../../../shared/utils';

/* eslint no-underscore-dangle: off */
export class ResponseHelper {
  public static genQuickReply(text, quickReplies) {
    const response = {
      text,
      quick_replies: [] as Array<any>
    };

    /* eslint no-restricted-syntax: off */
    for (const quickReply of quickReplies) {
      response.quick_replies.push({
        content_type: 'text',
        title: quickReply.title,
        payload: quickReply.payload
      });
    }

    return response;
  }

  public static genText(text) {
    const response = {
      text
    };

    return response;
  }

  public static genNuxMessage() {
    const welcome = this.genText(i18n.__('get_started.welcome'));
    const guide = this.genText(i18n.__('get_started.guidance'));
    const curation = this.genQuickReply(i18n.__('get_started.help'), [
      {
        title: i18n.__('menu.suggestion'),
        payload: 'CURATION'
      },
      {
        title: i18n.__('menu.help'),
        payload: 'CARE_HELP'
      }
    ]);

    return [welcome, guide, curation];
  }
}
