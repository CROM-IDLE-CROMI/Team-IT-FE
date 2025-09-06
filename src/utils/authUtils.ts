// 인증 관련 유틸리티 함수들

export const isLoggedIn = (): boolean => {
  const stored = localStorage.getItem('isLoggedIn');
  return stored === 'true';
};

export const requireAuth = (callback: () => void): void => {
  if (!isLoggedIn()) {
    alert('로그인이 필요한 서비스입니다. 로그인해주세요.');
    return;
  }
  callback();
};

export const getCurrentUser = (): string | null => {
  if (!isLoggedIn()) return null;
  
  // 현재 로그인된 사용자 ID를 반환 (실제 구현에서는 더 정교한 방법 사용)
  const keys = Object.keys(localStorage);
  for (const key of keys) {
    if (key !== 'isLoggedIn' && key !== 'IsLoggedIn') {
      try {
        const userData = JSON.parse(localStorage.getItem(key) || '');
        if (userData && userData.id) {
          return userData.id;
        }
      } catch (e) {
        // JSON 파싱 실패 시 무시
      }
    }
  }
  return null;
};
