export interface JwtPayload {
  exp?: number;
  sub?: string;
  name?: string;
  email?: string;
  id?: string | number;
  mail?: string;
  user_type?: string;
  user_metadata?: {
    name?: string;
    lastname?: string;
    age?: number | string;
    country?: string;
    city?: string;
    user_type?: string;
  };
  [key: string]: unknown;
}

export interface StoredUser {
  id?: string | number;
  name?: string;
  mail?: string;
  lastname?: string;
  age?: number | string;
  country?: string;
  city?: string;
  user_type?: string;
  [key: string]: unknown;
}

const TOKEN_STORAGE_KEY = "ecosystem_jwt";
const USER_STORAGE_KEY = "ecosystem_user";

export const getStoredToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
};

export const getStoredUser = (): StoredUser | null => {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredUser) : null;
  } catch {
    return null;
  }
};

export const clearStoredToken = (): void => {
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  } catch {
  }
};

export const decodeJwt = (token: string): JwtPayload | null => {
  try {
    const payload = token.split(".")[1];
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = decodeURIComponent(
      atob(normalized)
        .split("")
        .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`)
        .join(""),
    );
    return JSON.parse(decoded) as JwtPayload;
  } catch {
    return null;
  }
};

export const isValidJwt = (token: string | null): boolean => {
  if (!token) return false;
  const payload = decodeJwt(token);
  if (!payload?.exp) return false;
  return payload.exp * 1000 > Date.now();
};

export const getCurrentUser = (): StoredUser | JwtPayload | null => {
  const token = getStoredToken();
  if (!isValidJwt(token)) return null;
  return getStoredUser() ?? decodeJwt(token as string);
};