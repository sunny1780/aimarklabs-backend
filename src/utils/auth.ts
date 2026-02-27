export type UserRole = 'admin' | 'client';

export type UserRecord = {
  username: string;
  password: string;
  role: UserRole;
  clientSlug?: string;
  companyName?: string;
};

export type ClientRecord = {
  name: string;
  slug: string;
  accent: string;
};

const USERS_KEY = 'dashboard_users_v1';
const CLIENTS_KEY = 'dashboard_clients_v1';

export const ADMIN_EMAILS = ['farhanali@gmail.com', 'javeria@aimarklabs.com'];
export const ADMIN_PASSWORD = '123456';
export type DashboardCredential = {
  email: string;
  password: string;
  destination: string;
  clientSlug: string;
};

export const DASHBOARD_CREDENTIALS: DashboardCredential[] = [
  {
    email: 'littlesicily@gmail.com',
    password: '123456',
    destination: '/dashboard',
    clientSlug: 'little-sicily',
  },
  {
    email: 'cashforgold@gmail.com',
    password: '123456',
    destination: '/dashboard',
    clientSlug: 'cash-for-gold',
  },
  {
    email: 'karachibbq@gmail.com',
    password: '123456',
    destination: '/dashboard',
    clientSlug: 'karachi-bbq',
  },
  {
    email: 'goevol@gmail.com',
    password: '123456',
    destination: '/dashboard',
    clientSlug: 'evolo-ai',
  },
  {
    email: 'walkeradvisor@gmail.com',
    password: '123456',
    destination: '/dashboard',
    clientSlug: 'walker-advisor',
  },
  {
    email: 'thewalkeradvisor@gmail.com',
    password: '123456',
    destination: '/dashboard',
    clientSlug: 'walker-advisor',
  },
  {
    email: 'beckleypartyhall@gmail.com',
    password: '123456',
    destination: '/dashboard',
    clientSlug: 'party-hall',
  },
  
];

const parseJSON = <T,>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

export const getUsers = (): UserRecord[] => {
  if (typeof window === 'undefined') return [];
  return parseJSON<UserRecord[]>(localStorage.getItem(USERS_KEY), []);
};

export const saveUsers = (users: UserRecord[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const getClients = (): ClientRecord[] => {
  if (typeof window === 'undefined') return [];
  return parseJSON<ClientRecord[]>(localStorage.getItem(CLIENTS_KEY), []);
};

export const saveClients = (clients: ClientRecord[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
};

export const mergeClients = (defaults: ClientRecord[], stored: ClientRecord[]) => {
  const map = new Map<string, ClientRecord>();
  defaults.forEach((client) => map.set(client.slug, client));
  stored.forEach((client) => map.set(client.slug, client));
  return Array.from(map.values());
};

export const pickAccent = (index: number) => {
  const accents = ['#f59e0b', '#fbbf24', '#22c55e', '#60a5fa', '#f97316', '#38bdf8'];
  return accents[index % accents.length];
};
