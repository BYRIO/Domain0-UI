import { useEffect, useMemo, useState } from 'react';

const TOKEN_KEY = 'token' as const;

const TokenChangeEventTarget = new EventTarget();

export enum UserRole {
  /** only can access granted domains */
  Normal = 0,
  /** can submit new domain, access and delete own domain, grant/deny own domain access to other Normal user */
  Contributor = 1,
  /** can submit new domain, access and delete all domains, promte/demote user to Contributor, grant/deny all domains access to other Normal user */
  Admin = 2,
  /** same as Admin, promte/demote user to Admin */
  SysAdmin = 3,
}

export type JwtPayload = {
  email: string;
  exp: number;
  iat: number;
  name: string;
  role: UserRole;
  stu_id: string;
  sub: number;
};

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
  TokenChangeEventTarget.dispatchEvent(new CustomEvent('changeToken', { detail: token }));
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || null;
}

export function useToken() {
  const [currentToken, setCurrentToken] = useState<string | null>(getToken);
  useEffect(() => {
    const onTokenChange = (e: Event) => {
      if (e instanceof CustomEvent) {
        setCurrentToken(e.detail);
      }
    };
    TokenChangeEventTarget.addEventListener('changeToken', onTokenChange);
    return () => {
      TokenChangeEventTarget.removeEventListener('changeToken', onTokenChange);
    };
  }, []);
  return currentToken;
}

function base64UrlDecode(str: string) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) {
    str += '=';
  }
  return decodeURIComponent(
    atob(str)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(''),
  );
}

export function getUserInfo(token = getToken()): JwtPayload | null {
  if (!token) return null;
  try {
    const payload = JSON.parse(base64UrlDecode(token.split('.')[1])) as JwtPayload;
    if (payload.exp * 1000 < Date.now()) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export function useUserInfo(): JwtPayload | null {
  const token = useToken();
  if (!token) return null;
  return useMemo(() => getUserInfo(token), [token]);
}
