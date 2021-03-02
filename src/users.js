import { request } from './api';

export async function listUsers(token, page, filters) {
  const url = '/users';
  const querystring = [];

  if (page) {
    querystring.push(`p=${page + 1}`);
  }
  if (filters?.name) {
    querystring.push(`name=${filters.name}`);
  }
  if (filters?.email) {
    querystring.push(`email=${filters.email}`);
  }

  const resp = await request(`${url}?${querystring.join('&')}`, {
    token,
  });
  return { users: resp.data, meta: resp.meta };
}
