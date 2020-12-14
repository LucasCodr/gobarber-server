/* eslint-disable prettier/prettier */
import Mailgun, { Mailgun as IMailGun } from 'mailgun-js';
import { inject, injectable } from 'tsyringe';
import IMailTemplateProvider from '../../MailTemplateProvider/models/IMailTemplateProvider';
import ISendMailDTO from '../dtos/ISendMailDTO';
import IMailProvider from '../models/IMailProvider';

@injectable()
class MailgunMailProvider implements IMailProvider {
  private mailgun: IMailGun;

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider
  ) {
    this.mailgun = new Mailgun({
      apiKey: process.env.MAILGUN_API_KEY as string,
      domain: process.env.MAILGUN_DOMAIN_NAME as string,
    });
  }

  async sendMail({
    to,
    from,
    subject,
    templateData,
  }: ISendMailDTO): Promise<void> {
    const mailData: Mailgun.messages.SendData = {
      to: `${to.name} <${to.email}>`,
      from: `${from?.name || 'Equipe arcanedev'} <${from?.email || 'support@arcanedev.club'}>`,
      subject,
      html: await this.mailTemplateProvider.parse(templateData),
    };

    const { id, message } = await this.mailgun.messages().send(mailData);

    console.log(`MessageID: ${id}, ${message}`);
  }
}

export default MailgunMailProvider;
