import type { Response } from 'express';

export function setRefreshTokenCookie(res: Response, token: string) {
  res.cookie('refreshToken', token, {
    httpOnly: true,

    secure: process.env.NODE_ENV === 'production',

    sameSite: 'strict',

    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
}

export function clearRefreshTokenCookie(res: Response) {
  res.clearCookie('refreshToken', {
    httpOnly: true,

    secure: process.env.NODE_ENV === 'production',

    sameSite: 'strict',
  });
}
