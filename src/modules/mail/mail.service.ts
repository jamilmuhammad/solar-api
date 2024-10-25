import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailTemplate } from './template/email.template';

@Injectable()
export class MailService {

    constructor(
        private readonly mailerService: MailerService,
    ) { }

    async sendMail(dto: {
        to: string,
        subject: string,
        customerName: string,
        message: string,
        buttonLink?: string,
        buttonName?: string,
        hideSupport?: boolean,
        customSupportText?: string,
    }) {
        await this.mailerService.sendMail({
            from: `"Transgo" <${process.env.EMAIL_ALIAS}>`,
            to: dto.to,
            subject: `[Transgo] ${dto.subject}`,
            html: EmailTemplate(dto.subject, dto.customerName, dto.message, dto.buttonLink, dto.buttonName, dto.hideSupport, dto.customSupportText),
        });
    }
}
