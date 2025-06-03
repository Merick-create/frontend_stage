import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  registerForm: FormGroup;
  registerError: string = '';

  constructor(
    private fb: FormBuilder,
    private registerService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      role: ['', Validators.required], 
      picture: [''],
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

  }

  register() {
    if (this.registerForm.invalid) return;

    const newUser: AuthService = this.registerForm.value;

    this.registerService.add(newUser).subscribe({
      next: (res) => {
        console.log('Registrazione riuscita', res);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error(err);
        this.registerError = 'Registrazione fallita. Riprova.';
      }
    });
  }
}
