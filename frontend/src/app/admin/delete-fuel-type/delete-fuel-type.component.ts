import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CarsService } from 'src/app/cars/cars.service';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-delete-fuel-type',
  templateUrl: './delete-fuel-type.component.html',
  styleUrls: ['./delete-fuel-type.component.css']
})
export class DeleteFuelTypeComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  isLoading: boolean = false;
  fuelTypes: string[] = [];
  private fuelTypesSub!: Subscription;

  constructor(private adminService: AdminService) { }


  ngOnInit(): void {
    this.adminService.getFuelTypes();
    this.fuelTypesSub = this.adminService.getFuelTypesUpdateListener()
      .subscribe((fuelTypesData: {fuelTypes: string[]}) => {
        this.fuelTypes = fuelTypesData.fuelTypes;
      });
    this.isLoading = false;
    this.form = new FormGroup({
      fuel: new FormControl(null, {
        validators: [Validators.required]
      })
    });
  }

  deleteFuelType() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    this.adminService.deleteFuelType(this.form.value.fuel);
    this.form.reset();
  }

  ngOnDestroy(): void {
    this.fuelTypesSub.unsubscribe();
  }

}
