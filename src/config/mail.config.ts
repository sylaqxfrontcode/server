import dotenv from 'dotenv';
dotenv.config();

export interface MailConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  fromEmail: string;
}

export const mailConfig: MailConfig = {
  host: process.env.SMTP_HOST || '',
  port: Number(process.env.SMTP_PORT) || 587,
  user: process.env.SMTP_USER || '',
  password: process.env.SMTP_PASSWORD || '',
  fromEmail: process.env.SMTP_FROM_EMAIL || '',
};

if (!mailConfig.host || !mailConfig.user || !mailConfig.password) {
  throw new Error(
    'SMTP configuration is incomplete. Please check environment variables.',
  );
}
