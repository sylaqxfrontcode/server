import { sendMail } from './mail';

const generate_otp = Math.floor(100000 + Math.random() * 900000).toString();
export { generate_otp };

export async function sendOtpEmail(to: string, otp: string): Promise<void> {
  const subject = 'Your One-Time Password (OTP)';
  const html = `<p>Your OTP is: <strong>${otp}</strong></p><p>This OTP is valid for 10 minutes.</p>`;
  await sendMail(to, subject, html);
}
