import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService, USER_ROLES, UserRole } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  private readonly formBuilder = inject(FormBuilder);

  loading = false;
  error = '';
  selectedRole: UserRole = 'user';
  readonly roles = USER_ROLES;

  readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
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

    const value = this.form.getRawValue();
    if (value.password !== value.confirmPassword) {
      this.error = 'Password and confirm password must match.';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService
      .register({
        name: value.name,
        email: value.email,
        password: value.password,
        role: this.selectedRole
      })
      .subscribe({
        next: (user) => {
          const returnUrl =
            this.route.snapshot.queryParamMap.get('returnUrl') || this.authService.getDefaultRouteByRole(user.role);
          void this.router.navigateByUrl(returnUrl);
        },
        error: (err: { error?: { message?: string } }) => {
          this.error = err.error?.message || 'Registration failed. Please try again.';
          this.loading = false;
        }
      });
  }

  fieldError(controlName: 'name' | 'email' | 'password' | 'confirmPassword'): string {
    const control = this.form.controls[controlName];
    if (!control.touched || !control.errors) {
      return '';
    }

    if (control.errors['required']) {
      return `${this.toTitle(controlName)} is required.`;
    }

    if (control.errors['email']) {
      return 'Enter a valid email address.';
    }

    if (control.errors['minlength']) {
      if (controlName === 'name') {
        return 'Name should be at least 2 characters.';
      }
      return 'Password must be at least 6 characters.';
    }

    return 'Invalid value.';
  }

  private toTitle(label: string): string {
    if (label === 'confirmPassword') {
      return 'Confirm password';
    }
    return label.charAt(0).toUpperCase() + label.slice(1);
  }

  routeForRole(role: UserRole): string {
    return `/register/${role}`;
  }

  loginRouteForRole(role: UserRole): string {
    return `/login/${role}`;
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

  nameLabel(): string {
    return this.selectedRole === 'shop' ? 'Shop name' : 'Your name';
  }

  submitLabel(): string {
    if (this.selectedRole === 'admin') {
      return 'Create your Admin account';
    }
    if (this.selectedRole === 'shop') {
      return 'Create your Shop account';
    }
    return 'Create your User account';
  }

  private resolveRole(roleParam: string | null): UserRole {
    if (roleParam && USER_ROLES.includes(roleParam as UserRole)) {
      return roleParam as UserRole;
    }

    return 'user';
  }
}
