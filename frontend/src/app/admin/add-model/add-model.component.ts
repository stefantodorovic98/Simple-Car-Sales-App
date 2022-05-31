import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-add-model',
  templateUrl: './add-model.component.html',
  styleUrls: ['./add-model.component.css']
})
export class AddModelComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  isLoading: boolean = false;
  brands: string[] = [];
  private brandsSub!: Subscription;

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.adminService.getBrands();
    this.brandsSub = this.adminService.getBrandsUpdateListener()
      .subscribe((brandsData: {brands: string[]}) => {
        this.brands = brandsData.brands;
      });
    this.isLoading = false;
    this.form = new FormGroup({
      brand: new FormControl(null, {
        validators: [Validators.required]
      }),
      model: new FormControl(null, {
        validators: [Validators.required]
      })
    });
  }

  addModel() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    this.adminService.addModel(this.form.value.brand, this.form.value.model);
    this.form.reset();
  }

  ngOnDestroy(): void {
    this.brandsSub.unsubscribe();
  }

}
