// User Types
export interface User {
  id: number;
  ime?: string;
  prezime?: string;
  name?: string;
  email: string;
  email_verified_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

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


// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  ime: string;
  prezime: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface UserBooking {
  id: number;
  user: User;
  aranzman: Aranzman;
  datum: string;
  ukupnaCenaAranzmana: number;
  broj_putnika?: number;
}
