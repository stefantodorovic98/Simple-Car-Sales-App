import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { AdminService } from 'src/app/admin/admin.service';
import { AuthService } from 'src/app/auth/auth.service';
import { CarsService } from '../cars.service';
import { mimeType } from "./mime-type.validator";


@Component({
  selector: 'app-car-add',
  templateUrl: './car-add.component.html',
  styleUrls: ['./car-add.component.css']
})
export class CarAddComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  imagePreview!: string;
  isLoading: boolean = false;
  brands: string[] = [];
  models: string[] = [];
  fuelTypes: string[] = [];
  colors: string[] = [];
  years: number[] = [];
  imageErrorMessage: string = "";
  private authStatusSub!: Subscription;
  private brandsSub!: Subscription;
  private modelsSub!: Subscription;
  private fuelTypesSub!: Subscription;
  private colorsSub!: Subscription;

  constructor(public carsService: CarsService, public route: ActivatedRoute, private authService: AuthService, private adminService: AdminService) { }

  ngOnInit(): void {
    let date: Date = new Date();
    let finalYear = date.getFullYear();
    for(let i = finalYear; i >= 1980; i--) {
      this.years.push(i);
    }

    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
    this.adminService.getBrands();
    this.brandsSub = this.adminService.getBrandsUpdateListener()
      .subscribe((brandsData: {brands: string[]}) => {
        this.brands = brandsData.brands;
      });
    this.modelsSub = this.adminService.getModelsUpdateListener()
      .subscribe((modelsData: {models: string[]}) => {
        this.models = modelsData.models;
      });
    this.adminService.getFuelTypes();
    this.fuelTypesSub = this.adminService.getFuelTypesUpdateListener()
      .subscribe((fuelTypesData: {fuelTypes: string[]}) => {
        this.fuelTypes = fuelTypesData.fuelTypes;
      });
    this.adminService.getColors();
    this.colorsSub = this.adminService.getColorsUpdateListener()
      .subscribe((colorsData: {colors: string[]}) => {
        this.colors = colorsData.colors;
      });

    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required]
      }),
      brand: new FormControl(null, {
        validators: [Validators.required]
      }),
      model: new FormControl(null, {
        validators: [Validators.required]
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      }),
      mileage: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.pattern("^\\d{1,6}$")
        ]
      }),
      registration: new FormControl(null, {
        validators: [Validators.required]
      }),
      price: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.pattern("^\\d{1,6}$")
        ]
      }),
      fuel: new FormControl(null, {
        validators: [Validators.required]
      }),
      color: new FormControl(null, {
        validators: [Validators.required]
      }),
      phone: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.pattern("^\\+381/?[0-9]{2}-?[0-9]{2}-?[0-9]{2}-?[0-9]{3}$")
        ]
      }),
      content: new FormControl(null, {
        validators: [Validators.required]
      })
    });
  }

  onImagePicked(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files !== null) {
      const file = files[0];
      this.form.patchValue({ 'image': file });
      this.form.get('image')?.updateValueAndValidity();
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSaveCar() {
    if (this.form.get('image')?.invalid) {
      this.imageErrorMessage = "Unesite sliku.";
    }
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    this.carsService.addCar(
      this.form.value.title,
      this.form.value.brand,
      this.form.value.model,
      this.form.value.mileage,
      this.form.value.registration,
      this.form.value.price,
      this.form.value.fuel,
      this.form.value.color,
      this.form.value.phone,
      this.form.value.content,
      this.form.value.image
    );
    this.form.reset();
  }

  onChange(brandName: string) {
    this.adminService.getModels(brandName);
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
    this.brandsSub.unsubscribe();
    this.modelsSub.unsubscribe();
    this.fuelTypesSub.unsubscribe();
    this.colorsSub.unsubscribe();
  }

}
