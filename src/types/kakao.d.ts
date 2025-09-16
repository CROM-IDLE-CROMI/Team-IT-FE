declare namespace Kakao {
  interface AuthResponse {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
    token_type: string;
  }

  interface Profile {
    nickname: string;
    profile_image_url?: string;
    thumbnail_image_url?: string;
  }

  interface KakaoAccount {
    profile: Profile;
    email?: string;
  }

  interface UserResponse {
    id: number;
    kakao_account: KakaoAccount;
  }

  interface Auth {
    login(params: {
      scope?: string;
      success: (authObj: AuthResponse) => void;
      fail: (err: unknown) => void;
    }): void;
  }

  interface API {
    request(params: {
      url: string;
      success: (res: UserResponse) => void;
      fail: (err: unknown) => void;
    }): void;
  }

  interface KakaoStatic {
    isInitialized(): boolean;
    init(appKey: string): void;
    Auth: Auth;
    API: API;
  }
}

interface Window {
  Kakao: Kakao.KakaoStatic;
}
