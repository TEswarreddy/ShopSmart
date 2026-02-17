import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent {

  name = '';
  email = '';
  password = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  register() {
    this.authService.register({
      name: this.name,
      email: this.email,
      password: this.password
    }).subscribe(() => {
      alert("Registration successful");
      this.router.navigate(['/login']);
    });
  }
}
