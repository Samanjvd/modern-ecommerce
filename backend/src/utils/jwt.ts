import jwt from 'jsonwebtoken';

function getEnv(key: string) {
  const value = process.env[key];

  if (!value) {
    throw new Error(`${key} is missing`);
  }

  return value;
}

const ACCESS_SECRET = getEnv('JWT_SECRET');

const REFRESH_SECRET = getEnv('JWT_REFRESH_SECRET');

export type AccessTokenPayload = {
  id: number;
  role: 'USER' | 'ADMIN';
};

export type RefreshTokenPayload = {
  id: number;
};

export function createAccessToken(payload: AccessTokenPayload) {
  return jwt.sign(payload, ACCESS_SECRET, {
    expiresIn: '15m',
  });
}

export function createRefreshToken(payload: RefreshTokenPayload) {
  return jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: '30d',
  });
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, REFRESH_SECRET) as RefreshTokenPayload;
}
