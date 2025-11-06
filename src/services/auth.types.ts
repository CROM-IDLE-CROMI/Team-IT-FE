export interface SignupPayload {
  uid: string;
  nickName: string;
  password: string;
  email: string;
  emailVerified: boolean;
  birth: number;
}

export interface LoginPayload {
  uid: string;
  password: string;
}

export interface refreshTokenPayload {
    refreshToken: string;
}