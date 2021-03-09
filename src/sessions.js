import { requestList } from './api';

export function listSessions(token, page) {
  return requestList('/sessions', page, {
    token,
  });
}
