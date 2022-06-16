import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { SentMessageInfo } from 'nodemailer';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  /**
   * It sends an email to the specified address, with the specified subject,
   * using the specified template, and with the specified context
   * @param {SendMailProps} props - SendMailProps - this is the interface that we created earlier.
   * @returns {Promise<SentMessageInfo>}
   */
  async sendMail(props: ISendMailOptions): Promise<SentMessageInfo> {
    return await this.mailerService.sendMail(props);
  }
}
