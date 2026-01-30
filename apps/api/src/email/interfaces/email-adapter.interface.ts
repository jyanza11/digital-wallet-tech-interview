export interface IEmailAdapter {
  send(to: string, subject: string, html: string): Promise<boolean>;
}

export const EMAIL_ADAPTER = Symbol('EMAIL_ADAPTER');
