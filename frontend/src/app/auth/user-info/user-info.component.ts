import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { AdminService } from 'src/app/admin/admin.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;
  form!: FormGroup;
  userId!: number;
  loggedUserId!: number;
  private authStatusSub!: Subscription;

  constructor(private authService: AuthService, private route: ActivatedRoute, private dateAdapter: DateAdapter<Date>) {
    this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy
  }

  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
        this.loggedUserId = this.authService.getUserId();
      }
    );
    this.isLoading = false;
    this.loggedUserId = this.authService.getUserId();
    this.form = new FormGroup({
      firstName: new FormControl(null, []),
      lastName: new FormControl(null, []),
      birthdate: new FormControl(null, []),
      city: new FormControl(null, []),
      country: new FormControl(null, [])
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

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }

}
