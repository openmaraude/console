export class APIError extends Error {
  constructor() {
    super();
    this.name = 'api-error';
  }
}

export class NetworkError extends APIError {
  constructor() {
    super();
    this.name = 'network-error';
  }
}

export class InvalidJSONError extends APIError {
  constructor(status, text) {
    super();
    this.name = 'json-error';
    this.status = status;
    this.text = text;
  }
}

export class HttpError extends APIError {
  constructor(status, json) {
    super();
    this.name = 'http-error';
    this.status = status;
    this.json = json;
  }
}

export async function request(url, opts = {}) {
  const baseUrl = process.env.API_TAXI_PUBLIC_URL;

  const {
    token,
    args,
    ...options
  } = opts;

  if (token) {
    options.headers = {
      ...(options.headers || {}),
      'X-Api-Key': token,
    };
  }

  if (args) {
    // Remove falsy args
    const nonEmptyArgs = Object.fromEntries(
      Object.entries(args).filter(([key, value]) => value && [key, value]),
    );

    url += `?${Object.entries(nonEmptyArgs).map(([k, v]) => `${k}=${v}`).join('&')}`;
  }

  let resp;
  try {
    resp = await fetch(`${baseUrl}${url}`, options);
  } catch {
    throw new NetworkError();
  }

  if (!resp.ok) {
    const data = await resp.text();
    let json;
    try {
      json = JSON.parse(data);
    } catch {
      throw new InvalidJSONError(resp.status, data);
    }
    throw new HttpError(resp.status, json);
  }

  const data = await resp.text();
  try {
    return JSON.parse(data);
  } catch {
    throw new InvalidJSONError(resp.status, data);
  }
}

export async function requestList(url, page, opts = {}) {
  const args = { ...opts.args };

  if (page) {
    args.p = page + 1;
  }

  const resp = await request(url, { ...opts, args });
  return { data: resp.data, meta: resp.meta };
}
