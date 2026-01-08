export class Api {
  constructor(public readonly apiUrl: string) {}

  fetch(...props: Parameters<typeof fetch>) {
    const [input, init] = props;
    const url = input instanceof Request ? input.url : input;
    const finalUrl = new URL(url, this.apiUrl);

    return fetch(finalUrl, init);
  }
}

export const getApi = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error('API URL is not defined in environment variables');
  }

  return new Api(apiUrl);
}