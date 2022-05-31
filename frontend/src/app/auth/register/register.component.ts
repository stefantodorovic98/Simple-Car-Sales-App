import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;
  isLoading = false;
  private authStatusSub!: Subscription;

  constructor(public authService: AuthService, private dateAdapter: DateAdapter<Date>) {
    this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      firstName: new FormControl(null, [Validators.required]),
      lastName: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(
        null,
        [
          Validators.required,
          Validators.pattern("^(?=.*[A-Z])(?=.*\\d)[a-zA-Z].{6,}$")
        ]
      ),
      birthdate: new FormControl(null, [Validators.required]),
      city: new FormControl(null, [Validators.required]),
      country: new FormControl(null, [Validators.required])
    });
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
  }

  onRegister() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    let birthdate: Date = new Date(this.form.value.birthdate);
    this.authService.createUser(this.form.value.firstName, this.form.value.lastName, this.form.value.email,
       this.form.value.password,birthdate, this.form.value.city, this.form.value.country);
    this.form.reset();
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }

}
