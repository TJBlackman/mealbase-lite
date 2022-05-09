type Options = {
  url: string;
  method?: 'GET' | 'PUT' | 'POST' | 'DELETE';
  headers?: Record<string, string>;
  body?: Record<string, any>;
  delay?: number;
};

const sleep = (num: number) => new Promise((res) => setTimeout(res, num));

export async function networkRequest<T>(options: Options) {
  const response = await fetch(options.url, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      credentials: 'include',
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (options.delay) {
    await sleep(options.delay);
  }

  if (!response.ok) {
    const text = await response.text();
    throw Error(text);
  }

  const data = await response.json();
  return data as unknown as T;
}
