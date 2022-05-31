import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-delete-model',
  templateUrl: './delete-model.component.html',
  styleUrls: ['./delete-model.component.css']
})
export class DeleteModelComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  isLoading: boolean = false;
  brands: string[] = [];
  models: string[] = [];
  private brandsSub!: Subscription;
  private modelsSub!: Subscription;

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.adminService.getBrands();
    this.brandsSub = this.adminService.getBrandsUpdateListener()
      .subscribe((brandsData: {brands: string[]}) => {
        this.brands = brandsData.brands;
      });
    this.modelsSub = this.adminService.getModelsUpdateListener()
      .subscribe((modelsData: {models: string[]}) => {
        this.models = modelsData.models;
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

  deleteModel() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    this.adminService.deleteModel(this.form.value.brand, this.form.value.model);
    this.form.reset();
  }

  onChange(brandName: string) {
    this.adminService.getModels(brandName);
  }

  ngOnDestroy(): void {
    this.brandsSub.unsubscribe();
    this.modelsSub.unsubscribe();
  }

}
