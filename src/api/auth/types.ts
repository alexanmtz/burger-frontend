export interface SessionUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  reviewCount: number;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthConnector {
  getToken(): Promise<string | null>;
  signIn(payload: LoginPayload): Promise<void>;
  signOut(): Promise<void>;
  onSessionChange(cb: (user: SessionUser | null) => void): () => void;
  getInitialSession(): Promise<{ user: SessionUser | null; token: string | null }>;
}
