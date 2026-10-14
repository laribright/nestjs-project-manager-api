import { Inject, Injectable, Logger } from '@nestjs/common';
import { MAIL_OPTIONS, type MailOptions } from './mail.constants';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(@Inject(MAIL_OPTIONS) private readonly options: MailOptions) {}

  preview(to: string, subject: string) {
    const message = {
      from: this.options.from,
      to,
      subject,
    };
    this.logger.log(`Preview email: ${JSON.stringify(message)}`);
    return message;
  }
}
