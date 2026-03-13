export interface LoginParams {
  phone: string;
  password: string;
}

export interface SmsLoginParams {
  phone: string;
  code: string;
}

export interface SmsSendParams {
  phone: string;
}

export interface RegisterParams {
  phone: string;
  code: string;
  password: string;
  invite_code?: string;
}

export interface AuthResponse {
  token: string;
  role: string;
  invite_code?: string;
}
