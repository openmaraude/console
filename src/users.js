import { request } from './api';

export async function listUsers(token, page, filters) {
  const url = '/users';
  const args = {};

  if (page) {
    args.p = page + 1;
  }
  if (filters?.name) {
    args.name = filters.name;
  }
  if (filters?.email) {
    args.email = filters.email;
  }

  const resp = await request(url, {
    token,
    args,
  });
  return { data: resp.data, meta: resp.meta };
}
