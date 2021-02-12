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
  const {
    token,
    query,
    baseUrl = process.env.API_TAXI_PUBLIC_URL,
    ...options
  } = opts;

  if (token) {
    options.headers = {
      ...(options.headers || {}),
      'X-Api-Key': token,
    };
  }

  if (query) {
    url += `?${new URLSearchParams(query).toString()}`;
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
