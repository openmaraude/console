import { request } from './api';

export async function getUserAccount(token, userId) {
  const resp = await request(`/users/${userId}`, {
    token,
  });
  const account = resp.data[0];
  return account;
}

export async function updateUserAccount(token, userId, params) {
  const resp = await request(`/users/${userId}`, {
    token,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: [
        { ...params },
      ],
    }),
  });
  return resp.data[0];
}
