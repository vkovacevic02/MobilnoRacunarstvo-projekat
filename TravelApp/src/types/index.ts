// User Types
export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export type UserRole = 'admin' | 'putnik' | 'agent' | 'vodja_puta' | 'finansijski_admin';

// Travel Types
export interface Putovanje {
  id: number;
  nazivPutovanja: string;
  opis: string;
  lokacija: string;
  slika?: string;
  cena?: number;
  created_at: string;
  updated_at: string;
  aranzmani?: Aranzman[];
}

export interface Aranzman {
  id: number;
  nazivAranzmana: string;
  datumOd: string;
  datumDo: string;
  popust: number;
  cena: number;
  kapacitet: number;
  putovanje_id: number;
  putovanje?: Putovanje;
  planAranzmana?: PlanAranzmana[];
  putnici?: Putnik[];
  uplate?: Uplata[];
}

export interface PlanAranzmana {
  id: number;
  dan: number;
  aktivnost: string;
  opis: string;
  aranzman_id: number;
  aranzman?: Aranzman;
}

export interface Putnik {
  id: number;
  ime: string;
  prezime: string;
  email: string;
  telefon: string;
  user_id: number;
  aranzman_id: number;
  user?: User;
  aranzman?: Aranzman;
}

export interface Uplata {
  id: number;
  iznos: number;
  datum: string;
  status: 'pending' | 'completed' | 'cancelled';
  user_id: number;
  aranzman_id: number;
  user?: User;
  aranzman?: Aranzman;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// UI Types
export interface TabBarIconProps {
  focused: boolean;
  color: string;
  size: number;
}
