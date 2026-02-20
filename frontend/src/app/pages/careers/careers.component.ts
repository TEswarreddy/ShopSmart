import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-careers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './careers.html',
  styleUrl: './careers.css'
})
export class CareersComponent {
  jobs = [
    { title: 'Senior Full Stack Developer', location: 'Bangalore, India', type: 'Full-time' },
    { title: 'Product Manager', location: 'Mumbai, India', type: 'Full-time' },
    { title: 'Customer Support Specialist', location: 'Pune, India', type: 'Full-time' },
    { title: 'Marketing Manager', location: 'Delhi, India', type: 'Full-time' },
    { title: 'Backend Engineer (Node.js)', location: 'Bangalore, India', type: 'Full-time' },
    { title: 'Frontend Engineer (Angular)', location: 'Hyderabad, India', type: 'Full-time' }
  ];
}
