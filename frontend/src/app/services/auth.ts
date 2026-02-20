import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from './environment';

const AUTH_KEY = 'shopsmart_auth_user';

export type UserRole = 'user' | 'shop' | 'admin';

export const USER_ROLES: UserRole[] = ['user', 'shop', 'admin'];

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  profile?: {
    gender?: string;
    dateOfBirth?: string;
  };
  shopDetails?: {
    shopName?: string;
    ownerName?: string;
    businessType?: string;
    gstNumber?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    website?: string;
  };
  token: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  role: UserRole;
}

export interface UserRegisterPayload {
  role: 'user';
  fullName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  country: string;
  gender?: string;
  dateOfBirth?: string;
  password: string;
}

export interface ShopRegisterPayload {
  role: 'shop';
  shopName: string;
  ownerName: string;
  email: string;
  phone: string;
  businessType: string;
  gstNumber?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  website?: string;
  password: string;
}

export type RegisterPayload = UserRegisterPayload | ShopRegisterPayload;

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  profile?: {
    gender?: string;
    dateOfBirth?: string;
  };
  shopDetails?: AuthUser['shopDetails'];
}

export interface UpdatePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly userSignal = signal<AuthUser | null>(this.readUserFromStorage());

  readonly user = this.userSignal.asReadonly();
  readonly isLoggedIn = computed(() => !!this.userSignal()?.token);
  readonly role = computed<UserRole | null>(() => this.userSignal()?.role ?? null);

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

  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${environment.apiUrl}/users/profile`);
  }

  updateProfile(payload: Partial<UserProfile> & { shopDetails?: AuthUser['shopDetails'] }): Observable<UserProfile> {
    return this.http
      .put<UserProfile>(`${environment.apiUrl}/users/profile`, payload)
      .pipe(tap((profile) => this.syncUserFromProfile(profile)));
  }

  updatePassword(payload: UpdatePasswordPayload): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${environment.apiUrl}/users/profile/password`, payload);
  }

  logout(): void {
    this.userSignal.set(null);
    localStorage.removeItem(AUTH_KEY);
  }

  getToken(): string | null {
    return this.userSignal()?.token ?? null;
  }

  isRole(role: UserRole): boolean {
    return this.userSignal()?.role === role;
  }

  getDefaultRouteByRole(role?: UserRole | null): string {
    const resolvedRole = role ?? this.userSignal()?.role;

    if (resolvedRole === 'admin') {
      return '/admin/dashboard';
    }
    if (resolvedRole === 'shop') {
      return '/shop/dashboard';
    }
    return '/';
  }

  private setSession(user: AuthUser): void {
    this.userSignal.set(user);
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  }

  private syncUserFromProfile(profile: UserProfile): void {
    const current = this.userSignal();
    if (!current) {
      return;
    }

    this.setSession({
      ...current,
      name: profile.name,
      phone: profile.phone,
      role: profile.role,
      profile: profile.profile,
      shopDetails: profile.shopDetails
    });
  }

  private readUserFromStorage(): AuthUser | null {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      localStorage.removeItem(AUTH_KEY);
      return null;
    }
  }
}