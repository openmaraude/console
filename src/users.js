import { request } from './api';

export async function listUsers(token, page, filters) {
  let url = `/users/?p=${page + 1}`;

  if (filters?.name) {
    url += `&name=${filters.name}`;
  }

  if (filters?.email) {
    url += `&email=${filters.email}`;
  }

  const resp = await request(url, {
    token,
  });
  return { users: resp.data, meta: resp.meta };
}
