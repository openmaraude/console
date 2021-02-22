import { request } from './api';

export async function listUsers(token, page) {
  const resp = await request(`/users/?p=${page + 1}`, {
    token,
  });
  return { users: resp.data, meta: resp.meta };
}
