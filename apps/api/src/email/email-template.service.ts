import { Injectable } from '@nestjs/common';
import * as Handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class EmailTemplateService {
  private readonly templatesDir: string;
  private readonly layoutTemplate: Handlebars.TemplateDelegate | null = null;

  constructor() {
    this.templatesDir = path.join(__dirname, 'templates');
    const layoutPath = path.join(this.templatesDir, 'layouts', 'main.hbs');
    if (fs.existsSync(layoutPath)) {
      const layoutSrc = fs.readFileSync(layoutPath, 'utf-8');
      this.layoutTemplate = Handlebars.compile(layoutSrc);
    }
  }

  render(templateName: string, context: Record<string, unknown>): string {
    const templatePath = path.join(this.templatesDir, `${templateName}.hbs`);
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template not found: ${templateName}`);
    }
    const src = fs.readFileSync(templatePath, 'utf-8');
    const bodyTemplate = Handlebars.compile(src);
    const body = bodyTemplate(context);

    if (this.layoutTemplate) {
      return this.layoutTemplate({
        body,
        subject: (context.subject as string) || '',
        year: new Date().getFullYear(),
      });
    }
    return body;
  }
}
