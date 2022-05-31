import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-add-fuel-type',
  templateUrl: './add-fuel-type.component.html',
  styleUrls: ['./add-fuel-type.component.css']
})
export class AddFuelTypeComponent implements OnInit {
  form!: FormGroup;
  isLoading: boolean = false;

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.isLoading = false;
    this.form = new FormGroup({
      fuel: new FormControl(null, {
        validators: [Validators.required]
      })
    });
  }

  addFuelType() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    this.adminService.addFuelType(this.form.value.fuel);
    this.form.reset();
  }

}
