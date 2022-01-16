import { getCookie } from './cookie';

const adminCookieName = 'is_admin';

export const isAdmin = () => getCookie(adminCookieName);
