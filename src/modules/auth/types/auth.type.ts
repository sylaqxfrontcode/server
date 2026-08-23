export interface JwtPayload {
  sub: number;
  email: string;
  role?: string;
}

export interface resetPassword {
  email: string;
  otp: string;
  newPassword: string;
}

export interface registerUser {
  email: string;
  name: string;
  password: string;
  phone: string;
  countryCode: string;
}
