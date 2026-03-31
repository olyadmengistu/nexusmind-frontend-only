import { User } from './types';

const ACCOUNTS_KEY = 'nexus_accounts';

export interface RegisterPayload {
  fullName: string;
  contact: string; // email or phone
  password: string;
  age: number;
  profileImageDataUrl?: string;
}

interface StoredAccount {
  id: string;
  name: string;
  contact: string;
  age: number;
  avatar: string;
  passwordHash: string; // salt:hash
  createdAt: number;
}

function loadAccounts(): StoredAccount[] {
  if (typeof localStorage === 'undefined') return [];
  const raw = localStorage.getItem(ACCOUNTS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as StoredAccount[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveAccounts(accounts: StoredAccount[]): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

function hashPassword(password: string, salt: string = ''): string {
  // Simple hash for demo - in production use bcrypt/scrypt
  const combined = password + salt;
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

export function registerUser(payload: RegisterPayload): { success: boolean; error?: string } {
  const accounts = loadAccounts();
  
  // Check if contact already exists
  if (accounts.some(acc => acc.contact === payload.contact)) {
    return { success: false, error: 'Account with this email/phone already exists' };
  }

  const salt = Math.random().toString(36).substring(2);
  const passwordHash = hashPassword(payload.password, salt);
  const finalHash = `${salt}:${passwordHash}`;

  const newAccount: StoredAccount = {
    id: Date.now().toString(),
    name: payload.fullName,
    contact: payload.contact,
    age: payload.age,
    avatar: payload.profileImageDataUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(payload.fullName)}&background=random`,
    passwordHash: finalHash,
    createdAt: Date.now()
  };

  accounts.push(newAccount);
  saveAccounts(accounts);
  
  return { success: true };
}

export function loginUser(contact: string, password: string): { success: boolean; user?: User; error?: string } {
  const accounts = loadAccounts();
  const account = accounts.find(acc => acc.contact === contact);
  
  if (!account) {
    return { success: false, error: 'Account not found' };
  }

  const [salt, storedHash] = account.passwordHash.split(':');
  const inputHash = hashPassword(password, salt);
  
  if (inputHash !== storedHash) {
    return { success: false, error: 'Invalid password' };
  }

  const user: User = {
    id: account.id,
    name: account.name,
    firstName: account.name.split(' ')[0] || account.name,
    lastName: account.name.split(' ').slice(1).join(' ') || '',
    email: account.contact.includes('@') ? account.contact : '',
    avatar: account.avatar,
    reputation: 0,
    joinedAt: account.createdAt
  };

  return { success: true, user };
}

export function getCurrentUser(): User | null {
  if (typeof localStorage === 'undefined') return null;
  const userStr = localStorage.getItem('nexus_current_user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr) as User;
  } catch {
    return null;
  }
}

export function setCurrentUser(user: User): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem('nexus_current_user', JSON.stringify(user));
}

export function logoutUser(): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.removeItem('nexus_current_user');
}
