import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-delete-brand',
  templateUrl: './delete-brand.component.html',
  styleUrls: ['./delete-brand.component.css']
})
export class DeleteBrandComponent implements OnInit, OnDestroy {
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
      })
    });
  }

  deleteBrand() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    this.adminService.deleteBrand(this.form.value.brand);
    this.form.reset();
  }

  ngOnDestroy(): void {
    this.brandsSub.unsubscribe();
  }

}
