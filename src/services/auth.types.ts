export interface SignupPayload {
  uid: string;
  nickName: string;
  password: string;
  email: string;
  emailVerified: boolean;
  birthDay: number;
}

export interface LoginPayload {
  uid: string;
  password: string;
}

export interface refreshTokenPayload {
    refreshToken: string;
}

export interface AuthUser { uid: string; nickName: string; email: string };
export interface AuthResponse { user: AuthUser; accessToken: string; refreshToken?: string };