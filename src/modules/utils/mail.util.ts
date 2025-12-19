import * as nodemailer from 'nodemailer';

interface SendMailProps {
  to: string;
  from?: string;
  subject: string;
  html: string; // ✅ correct type
  text?: string;
}

if (
  !process.env.SMTP_HOST ||
  !process.env.SMTP_PORT ||
  !process.env.SMTP_USER ||
  !process.env.SMTP_PASSWORD
) {
  throw new Error('SMTP environment variables are not properly set');
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.zoho.com',
  port: Number(process.env.SMTP_PORT) || 587, // ✅ convert to number
  secure: Number(process.env.SMTP_PORT) === 465, // ✅ auto secure
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendMail = async ({
  to,
  from,
  subject,
  html,
  text,
}: SendMailProps): Promise<void> => {
  await transporter.sendMail({
    from: from || process.env.SMTP_FROM_EMAIL,
    to,
    subject,
    html,
    text,
  });
};
