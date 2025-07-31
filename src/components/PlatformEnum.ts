export const Platform = {
  WEB: '웹',
  APP: '앱',
  GAME: '게임',
  ETC: '기타',
} as const;

export type Platform = typeof Platform[keyof typeof Platform];