import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';
import { EmailTemplateService } from './email-template.service';
import {
  IEmailAdapter,
  EMAIL_ADAPTER,
} from './interfaces/email-adapter.interface';
import { ResendEmailAdapter } from './adapters/resend.adapter';
import { GmailEmailAdapter } from './adapters/gmail.adapter';
import { ConsoleEmailAdapter } from './adapters/console.adapter';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    EmailTemplateService,
    EmailService,
    {
      provide: EMAIL_ADAPTER,
      useFactory: (configService: ConfigService): IEmailAdapter => {
        const provider = (
          configService.get<string>('EMAIL_PROVIDER') || 'console'
        ).toLowerCase();
        if (provider === 'resend') {
          return new ResendEmailAdapter(configService);
        }
        if (provider === 'gmail') {
          return new GmailEmailAdapter(configService);
        }
        return new ConsoleEmailAdapter();
      },
      inject: [ConfigService],
    },
  ],
  exports: [EmailService],
})
export class EmailModule {}
