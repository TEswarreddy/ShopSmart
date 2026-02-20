import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact-support',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact-support.html',
  styleUrl: './contact-support.css'
})
export class ContactSupportComponent {
  formData = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  submitted = false;

  onSubmit(): void {
    if (this.formData.name && this.formData.email && this.formData.message) {
      this.submitted = true;
      setTimeout(() => {
        this.submitted = false;
        this.formData = { name: '', email: '', subject: '', message: '' };
      }, 3000);
    }
  }
}
