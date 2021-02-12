import nookies from 'nookies';

import { request } from './api';

const COOKIE_NAME = 'remember-users';

/*
 * Logout current user. If user was log-as, return the new user object.
 */
export function logout() {
  nookies.destroy(null, COOKIE_NAME, {
    sameSite: true,
  });
  return null;
}

/*
 * Authenticate user, store it in cookies and return the current user.
 */
export async function login(form) {
  const resp = await request('/internal/auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: form.username,
      password: form.password,
    }),
  });
  const user = resp.data[0];

  const cookieValue = JSON.stringify([user]);
  nookies.set(null, COOKIE_NAME, cookieValue, {
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: 'strict',
  });

  return user;
}

/*
 * Get the current user object stored in cookies.
 */
export function getCurrentUser(ctx) {
  const value = nookies.get(ctx)[COOKIE_NAME];
  if (value) {
    const users = JSON.parse(value);
    const currentUser = users[0];
    return currentUser;
  }
  return null;
}

export function hasRole(user, roleName) {
  if (!user) {
    return false;
  }

  const exists = user.roles.some((role) => role.name === roleName);
  return exists;
}
