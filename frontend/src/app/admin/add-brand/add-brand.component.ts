import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-add-brand',
  templateUrl: './add-brand.component.html',
  styleUrls: ['./add-brand.component.css']
})
export class AddBrandComponent implements OnInit {
  form!: FormGroup;
  isLoading: boolean = false;

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.isLoading = false;
    this.form = new FormGroup({
      brand: new FormControl(null, {
        validators: [Validators.required]
      })
    });
  }

  addBrand() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    this.adminService.addBrand(this.form.value.brand);
    this.form.reset();
  }

}
