export class Api {
  constructor(public readonly apiUrl: string, public readonly token?: string) {}

  public static getToken() {
    if (typeof window === 'undefined') return undefined;
    const token = localStorage.getItem('auth_token');
    return token ? token : undefined;
  }

  fetch(input: RequestInfo | URL, init?: RequestInit) {
    const url = input instanceof Request ? input.url : input.toString();
    const finalUrl = new URL(url, this.apiUrl);

    const headers = new Headers(init?.headers);
    if (this.token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${this.token}`);
    }

    return fetch(finalUrl, {
      ...init,
      headers,
    });
  }
}

export const getApi = (token?: string) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error('API URL is not defined in environment variables');
  }

  return new Api(apiUrl, token);
}