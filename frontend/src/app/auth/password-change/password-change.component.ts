import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.css']
})
export class PasswordChangeComponent implements OnInit {
  form!: FormGroup;
  isLoading = false;
  userId!: number;

  constructor(private authService: AuthService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.isLoading = false;
    this.form = new FormGroup({
      oldPassword: new FormControl(null, [Validators.required]),
      newPassword: new FormControl(
        null,
        [
          Validators.required,
          Validators.pattern("^(?=.*[A-Z])(?=.*\\d)[a-zA-Z].{6,}$")
        ]
      )
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.userId = Number(paramMap.get('userId'));
    });
  }

  onChangePassword() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.changePassword(this.userId, this.form.value.oldPassword, this.form.value.newPassword);
    this.form.reset();
  }

}
