import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService, USER_ROLES, UserRole } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private readonly formBuilder = inject(FormBuilder);

  loading = false;
  error = '';
  selectedRole: UserRole = 'user';
  readonly roles = USER_ROLES;
  showPassword = false;

  readonly form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.paramMap.subscribe((params) => {
      this.selectedRole = this.resolveRole(params.get('role'));
      this.error = '';
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';

    const payload = {
      ...this.form.getRawValue(),
      role: this.selectedRole
    };

    this.authService.login(payload).subscribe({
      next: (user) => {
        if (user.role !== this.selectedRole) {
          this.error = `This account belongs to ${this.roleLabel(user.role)}. Please use the correct role sign in.`;
          this.authService.logout();
          this.loading = false;
          return;
        }

        const returnUrl =
          this.route.snapshot.queryParamMap.get('returnUrl') || this.authService.getDefaultRouteByRole(user.role);

        void this.router.navigateByUrl(returnUrl);
      },
      error: (err: { error?: { message?: string } }) => {
        this.error = err.error?.message || 'Login failed. Please try again.';
        this.loading = false;
      }
    });
  }

  fieldError(controlName: 'email' | 'password'): string {
    const control = this.form.controls[controlName];
    if (!control.touched || !control.errors) {
      return '';
    }

    if (control.errors['required']) {
      return `${controlName === 'email' ? 'Email' : 'Password'} is required.`;
    }
    if (control.errors['email']) {
      return 'Enter a valid email address.';
    }
    if (control.errors['minlength']) {
      return 'Password must be at least 6 characters.';
    }

    return 'Invalid value.';
  }

  routeForRole(role: UserRole): string {
    return `/login/${role}`;
  }

  registerRouteForRole(role: UserRole): string {
    if (role === 'shop') {
      return '/register/shop';
    }
    return `/register/${role}`;
  }

  roleLabel(role: UserRole): string {
    if (role === 'shop') {
      return 'Shop';
    }
    if (role === 'admin') {
      return 'Admin';
    }
    return 'User';
  }

  private resolveRole(roleParam: string | null): UserRole {
    if (roleParam && USER_ROLES.includes(roleParam as UserRole)) {
      return roleParam as UserRole;
    }

    return 'user';
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}
