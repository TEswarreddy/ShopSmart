import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from './environment';

const AUTH_KEY = 'shopsmart_auth_user';

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  token: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly userSignal = signal<AuthUser | null>(this.readUserFromStorage());

  readonly user = this.userSignal.asReadonly();
  readonly isLoggedIn = computed(() => !!this.userSignal()?.token);

  constructor(private http: HttpClient) {}

  login(payload: LoginPayload): Observable<AuthUser> {
    return this.http
      .post<AuthUser>(`${environment.apiUrl}/users/login`, payload)
      .pipe(tap((user) => this.setSession(user)));
  }

  register(payload: RegisterPayload): Observable<AuthUser> {
    return this.http
      .post<AuthUser>(`${environment.apiUrl}/users/register`, payload)
      .pipe(tap((user) => this.setSession(user)));
  }

  logout(): void {
    this.userSignal.set(null);
    localStorage.removeItem(AUTH_KEY);
  }

  getToken(): string | null {
    return this.userSignal()?.token ?? null;
  }

  private setSession(user: AuthUser): void {
    this.userSignal.set(user);
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  }

  private readUserFromStorage(): AuthUser | null {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  }
}