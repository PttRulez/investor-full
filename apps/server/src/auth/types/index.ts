import { Role } from 'contracts';
import type { Session } from 'express-session';

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role?: Role;
}

export type LoginData = Pick<RegisterData, 'email' | 'password'>;

type UserSessionData = { id: number; email: string; role: Role };

export type UserSession = Session & Record<'user', UserSessionData>;
