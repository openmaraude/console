import React from 'react';

import nookies from 'nookies';

import { request } from './api';

const COOKIE_NAME = 'remember-users';

export const UserContext = React.createContext();

/*
 * Retrieve the list of users stored in cookie by setAuthenticatedUsers().
 */
export function getAuthenticatedUsers(ctx) {
  const value = nookies.get(ctx)[COOKIE_NAME];
  if (!value) {
    return [];
  }

  const users = JSON.parse(value);
  return users;
}

/*
 * Destroy cookie and return null when users is an empty list, otherwise set
 * cookie and return the current user.
 */
function setAuthenticatedUsers(users) {
  if (users.length > 0) {
    const newCookieValue = JSON.stringify(users);

    nookies.set(null, COOKIE_NAME, newCookieValue, {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: 'strict',
    });
    return users[0];
  }

  // No authenticated users, delete cookie.
  nookies.destroy(null, COOKIE_NAME, {
    sameSite: true,
  });
  return null;
}

/*
 * Get the first entry of authenticated users.
 */
export function getCurrentUser(ctx) {
  const users = getAuthenticatedUsers(ctx);
  if (users.length > 0) {
    return users[0];
  }
  return null;
}

/*
 * Logout current user. If user was log-as, return the new user object.
 */
export function logout() {
  const authenticatedUsers = getAuthenticatedUsers();

  // Remove current user from the list.
  authenticatedUsers.shift();

  // Return current user if there is one, or null.
  return setAuthenticatedUsers(authenticatedUsers);
}

/*
 * Authenticate user, store it in cookies and return the current user.
 */
export async function login(form) {
  const authenticatedUsers = getAuthenticatedUsers();

  if (authenticatedUsers.length > 0 && authenticatedUsers[0].email === form.email) {
    return authenticatedUsers[0];
  }

  // Build HTTP request body.
  const body = { email: form.email };
  if ('apikey' in form) {
    body.apikey = form.apikey;
  } else {
    body.password = form.password;
  }

  // Authenticate.
  const resp = await request('/internal/auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: [body],
    }),
  });
  const user = resp.data[0];

  // Prepend user.
  authenticatedUsers.unshift(user);

  // Store in cookie, and return current user.
  return setAuthenticatedUsers(authenticatedUsers);
}

export function hasRole(user, roleName) {
  if (!user) {
    return false;
  }

  const exists = user.roles.some((role) => role.name === roleName);
  return exists;
}
