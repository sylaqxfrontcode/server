import nodemailer from 'nodemailer';
import { mailConfig } from '../../../config/mail.config';

const transporter = nodemailer.createTransport({
  host: mailConfig.host,
  port: mailConfig.port,
  secure: false,
  auth: {
    user: mailConfig.user,
    pass: mailConfig.password,
  },
});

export async function sendMail(
  to: string,
  subject: string,
  html: string,
): Promise<void> {
  await transporter.sendMail({
    from: mailConfig.fromEmail,
    to,
    subject,
    html,
  });
}
