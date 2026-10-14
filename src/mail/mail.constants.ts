import { ModuleMetadata } from '@nestjs/common';

export type MailOptions = {
  from: string; // sender email address that our service will use to send emails
};

export const MAIL_OPTIONS = Symbol('MAIL_OPTIONS');

export type MailAsycnOptions = {
  imports?: ModuleMetadata['imports'];
  inject?: Array<string | symbol | Function>;
  useFactory: (...dependencies: any[]) => MailOptions | Promise<MailOptions>;
};
