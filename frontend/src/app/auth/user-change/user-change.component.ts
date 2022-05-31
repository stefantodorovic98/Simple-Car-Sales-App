import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-user-change',
  templateUrl: './user-change.component.html',
  styleUrls: ['./user-change.component.css']
})
export class UserChangeComponent implements OnInit {
  isLoading: boolean = false;
  form!: FormGroup;
  userId!: number;

  constructor(private authService: AuthService, private route: ActivatedRoute, private dateAdapter: DateAdapter<Date>) {
    this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy
  }

  ngOnInit(): void {
    this.isLoading = false;
    this.form = new FormGroup({
      firstName: new FormControl(null, [Validators.required]),
      lastName: new FormControl(null, [Validators.required]),
      birthdate: new FormControl(null, [Validators.required]),
      city: new FormControl(null, [Validators.required]),
      country: new FormControl(null, [Validators.required])
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.userId = Number(paramMap.get('userId'));
      this.isLoading = true;
      this.authService.getUserById(this.userId)
        .subscribe(userData => {
          this.isLoading = false;
          this.form.setValue({
            firstName: userData.firstName,
            lastName: userData.lastName,
            birthdate: new Date(userData.timestamp),
            city: userData.city,
            country: userData.country
          });
        });
    });
  }

  onUpdateUser() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.updateUser(this.userId, this.form.value.firstName, this.form.value.lastName,
      this.form.value.birthdate, this.form.value.city, this.form.value.country);
    this.form.reset();
  }

}
