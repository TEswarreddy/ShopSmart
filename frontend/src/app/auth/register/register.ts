import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService, ShopRegisterPayload, UserRegisterPayload, UserRole } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  private readonly formBuilder = inject(FormBuilder);
  readonly registerRoles: Array<'user' | 'shop'> = ['user', 'shop'];

  loading = false;
  error = '';
  selectedRole: 'user' | 'shop' = 'user';
  showPassword = false;
  showConfirmPassword = false;

  readonly form = this.formBuilder.nonNullable.group({
    fullName: [''],
    shopName: [''],
    ownerName: [''],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s]{10,15}$/)]],
    businessType: [''],
    gstNumber: [''],
    addressLine1: [''],
    addressLine2: [''],
    city: ['', [Validators.required]],
    state: ['', [Validators.required]],
    country: ['India', [Validators.required]],
    postalCode: [''],
    website: [''],
    gender: [''],
    dateOfBirth: [''],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
    acceptTerms: [false, [Validators.requiredTrue]]
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.paramMap.subscribe((params) => {
      this.selectedRole = this.resolveRole(params.get('role'));
      this.error = '';
      this.updateRoleValidators();
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
      .register(this.buildPayload(value))
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

  fieldError(controlName: keyof typeof this.form.controls): string {
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

    if (control.errors['pattern']) {
      if (controlName === 'phone') {
        return 'Enter a valid phone number.';
      }
      return 'Invalid format.';
    }

    if (control.errors['minlength']) {
      return 'Password must be at least 6 characters.';
    }

    if (control.errors['requiredTrue']) {
      return 'Please accept terms to continue.';
    }

    return 'Invalid value.';
  }

  private toTitle(label: string): string {
    if (label === 'confirmPassword') {
      return 'Confirm password';
    }
    return label
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (value) => value.toUpperCase())
      .trim();
  }

  routeForRole(role: 'user' | 'shop'): string {
    return `/register/${role}`;
  }

  loginRouteForRole(role: 'user' | 'shop'): string {
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
    if (this.selectedRole === 'shop') {
      return 'Create your Shop account';
    }
    return 'Create your User account';
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  private resolveRole(roleParam: string | null): 'user' | 'shop' {
    if (roleParam === 'shop') {
      return 'shop';
    }

    return 'user';
  }

  private updateRoleValidators(): void {
    const fullName = this.form.controls.fullName;
    const shopName = this.form.controls.shopName;
    const ownerName = this.form.controls.ownerName;
    const businessType = this.form.controls.businessType;
    const addressLine1 = this.form.controls.addressLine1;
    const postalCode = this.form.controls.postalCode;

    fullName.clearValidators();
    shopName.clearValidators();
    ownerName.clearValidators();
    businessType.clearValidators();
    addressLine1.clearValidators();
    postalCode.clearValidators();

    if (this.selectedRole === 'user') {
      fullName.setValidators([Validators.required, Validators.minLength(2)]);
    }

    if (this.selectedRole === 'shop') {
      shopName.setValidators([Validators.required, Validators.minLength(2)]);
      ownerName.setValidators([Validators.required, Validators.minLength(2)]);
      businessType.setValidators([Validators.required]);
      addressLine1.setValidators([Validators.required]);
      postalCode.setValidators([Validators.required]);
    }

    fullName.updateValueAndValidity();
    shopName.updateValueAndValidity();
    ownerName.updateValueAndValidity();
    businessType.updateValueAndValidity();
    addressLine1.updateValueAndValidity();
    postalCode.updateValueAndValidity();
  }

  private buildPayload(value: ReturnType<typeof this.form.getRawValue>): UserRegisterPayload | ShopRegisterPayload {
    if (this.selectedRole === 'shop') {
      return {
        role: 'shop',
        shopName: value.shopName,
        ownerName: value.ownerName,
        email: value.email,
        phone: value.phone,
        businessType: value.businessType,
        gstNumber: value.gstNumber || undefined,
        addressLine1: value.addressLine1,
        addressLine2: value.addressLine2 || undefined,
        city: value.city,
        state: value.state,
        postalCode: value.postalCode,
        country: value.country,
        website: value.website || undefined,
        password: value.password
      };
    }

    return {
      role: 'user',
      fullName: value.fullName,
      email: value.email,
      phone: value.phone,
      city: value.city,
      state: value.state,
      country: value.country,
      gender: value.gender || undefined,
      dateOfBirth: value.dateOfBirth || undefined,
      password: value.password
    };
  }
}
