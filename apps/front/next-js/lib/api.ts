export class Api {
  constructor(public readonly apiUrl: string) {}

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }

  fetch(input: RequestInfo | URL, init?: RequestInit) {
    const url = input instanceof Request ? input.url : input.toString();
    const finalUrl = new URL(url, this.apiUrl);
    const token = this.getToken();

    const headers = new Headers(init?.headers);
    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return fetch(finalUrl, {
      ...init,
      headers,
    });
  }
}

export const getApi = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error('API URL is not defined in environment variables');
  }

  return new Api(apiUrl);
}