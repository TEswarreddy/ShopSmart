import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService, AuthUser, UserProfile } from '../services/auth';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  private readonly formBuilder = inject(FormBuilder);

  loading = true;
  savingProfile = false;
  changingPassword = false;
  errorMessage = '';
  successMessage = '';
  isEditing = false;
  profileData: UserProfile | null = null;

  readonly editForm = this.formBuilder.nonNullable.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.pattern(/^[0-9+\-\s]{10,15}$/)]],
      gender: [''],
      dateOfBirth: [''],
      shopName: [''],
      ownerName: [''],
      businessType: [''],
      gstNumber: [''],
      addressLine1: [''],
      addressLine2: [''],
      city: [''],
      state: [''],
      postalCode: [''],
      country: [''],
      website: [''],
    });

  readonly passwordForm = this.formBuilder.nonNullable.group({
      currentPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    });

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.editForm.disable();
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.getProfile().subscribe({
      next: (data) => {
        this.profileData = data;
        this.populateEditForm(data);
        this.loading = false;
      },
      error: (error: { error?: { message?: string } }) => {
        this.errorMessage = error.error?.message || 'Failed to load profile. Please try again.';
        this.loading = false;
      },
    });
  }

  populateEditForm(profile: UserProfile): void {
    this.editForm.patchValue({
      name: profile.name,
      phone: profile.phone || '',
      gender: profile.profile?.gender || '',
      dateOfBirth: this.toDateInputValue(profile.profile?.dateOfBirth),
      shopName: profile.shopDetails?.shopName || '',
      ownerName: profile.shopDetails?.ownerName || '',
      businessType: profile.shopDetails?.businessType || '',
      gstNumber: profile.shopDetails?.gstNumber || '',
      addressLine1: profile.shopDetails?.addressLine1 || '',
      addressLine2: profile.shopDetails?.addressLine2 || '',
      city: profile.shopDetails?.city || '',
      state: profile.shopDetails?.state || '',
      postalCode: profile.shopDetails?.postalCode || '',
      country: profile.shopDetails?.country || '',
      website: profile.shopDetails?.website || '',
    });
  }

  startEdit(): void {
    this.isEditing = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.editForm.enable();
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.errorMessage = '';
    this.successMessage = '';
    if (this.profileData) {
      this.populateEditForm(this.profileData);
    }
    this.editForm.disable();
  }

  saveProfile(): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }

    this.savingProfile = true;
    this.errorMessage = '';
    this.successMessage = '';

    const values = this.editForm.getRawValue();
    const relevantFields: Partial<UserProfile> & { shopDetails?: AuthUser['shopDetails'] } = {
      name: values.name,
      phone: values.phone || '',
    };

    if (this.isUserRole()) {
      relevantFields.profile = {
        gender: values.gender || undefined,
        dateOfBirth: values.dateOfBirth || undefined,
      };
    }

    if (this.isShopRole()) {
      relevantFields.shopDetails = {
        shopName: values.shopName || undefined,
        ownerName: values.ownerName || undefined,
        businessType: values.businessType || undefined,
        gstNumber: values.gstNumber || undefined,
        addressLine1: values.addressLine1 || undefined,
        addressLine2: values.addressLine2 || undefined,
        city: values.city || undefined,
        state: values.state || undefined,
        postalCode: values.postalCode || undefined,
        country: values.country || undefined,
        website: values.website || undefined,
      };
    }

    this.authService.updateProfile(relevantFields).subscribe({
      next: (data) => {
        this.profileData = data;
        this.populateEditForm(data);
        this.isEditing = false;
        this.editForm.disable();
        this.successMessage = 'Profile updated successfully!';
        this.savingProfile = false;
      },
      error: (error: { error?: { message?: string } }) => {
        this.errorMessage = error.error?.message || 'Failed to update profile. Please try again.';
        this.savingProfile = false;
      },
    });
  }

  changePassword(): void {
    if (this.passwordForm.invalid || this.passwordMismatch()) {
      this.passwordForm.markAllAsTouched();
      this.errorMessage = this.passwordMismatch()
        ? 'New password and confirm password must match.'
        : 'Please fill in all password fields correctly.';
      return;
    }

    this.changingPassword = true;
    this.errorMessage = '';
    this.successMessage = '';

    const { currentPassword, newPassword } = this.passwordForm.getRawValue();

    this.authService.updatePassword({ currentPassword, newPassword }).subscribe({
      next: (response) => {
        this.passwordForm.reset({ currentPassword: '', newPassword: '', confirmPassword: '' });
        this.successMessage = response.message || 'Password changed successfully!';
        this.changingPassword = false;
      },
      error: (error: { error?: { message?: string } }) => {
        this.errorMessage = error.error?.message || 'Failed to change password. Please try again.';
        this.changingPassword = false;
      },
    });
  }

  fieldError(controlName: keyof typeof this.editForm.controls): string {
    const control = this.editForm.controls[controlName];
    if (!control.touched || !control.errors) {
      return '';
    }

    if (control.errors['required']) {
      return 'This field is required.';
    }
    if (control.errors['minlength']) {
      return 'Value is too short.';
    }
    if (control.errors['pattern']) {
      return 'Enter a valid phone number.';
    }

    return 'Invalid value.';
  }

  passwordFieldError(controlName: keyof typeof this.passwordForm.controls): string {
    const control = this.passwordForm.controls[controlName];
    if (!control.touched || !control.errors) {
      return '';
    }

    if (control.errors['required']) {
      return 'This field is required.';
    }
    if (control.errors['minlength']) {
      return 'Password must be at least 6 characters.';
    }

    return 'Invalid value.';
  }

  passwordMismatch(): boolean {
    const values = this.passwordForm.getRawValue();
    return !!values.newPassword && !!values.confirmPassword && values.newPassword !== values.confirmPassword;
  }

  isUserRole(): boolean {
    return this.profileData?.role === 'user';
  }

  isShopRole(): boolean {
    return this.profileData?.role === 'shop';
  }

  private toDateInputValue(value?: string): string {
    if (!value) {
      return '';
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return '';
    }

    return date.toISOString().split('T')[0];
  }
}
