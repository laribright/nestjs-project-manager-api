import { DynamicModule, Module } from '@nestjs/common';

import {
  MAIL_OPTIONS,
  MailAsycnOptions,
  type MailOptions,
} from './mail.constants';
import { MailService } from './mail.service';

// @Module({
//   providers: [
//     {
//       provide: MAIL_OPTIONS,
//       useValue: { from: 'reports@example.com' } satisfies MailOptions,
//     },
//     MailService,
//   ],
//   exports: [MailService],
// })
@Module({})
export class MailModule {
  static forRoot(options: MailOptions): DynamicModule {
    return {
      module: MailModule,
      providers: [{ provide: MAIL_OPTIONS, useValue: options }, MailService],
      exports: [MailService],
    };
  }

  static forRootAsync(options: MailAsycnOptions): DynamicModule {
    return {
      module: MailModule,
      imports: options.imports ?? [],
      providers: [
        {
          provide: MAIL_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject ?? [],
        },
        MailService,
      ],
      exports: [MailService],
    };
  }
}
