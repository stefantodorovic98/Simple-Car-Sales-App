import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-delete-color',
  templateUrl: './delete-color.component.html',
  styleUrls: ['./delete-color.component.css']
})
export class DeleteColorComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  isLoading: boolean = false;
  colors: string[] = [];
  private colorsSub!: Subscription;

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.adminService.getColors();
    this.colorsSub = this.adminService.getColorsUpdateListener()
      .subscribe((colorsData: {colors: string[]}) => {
        this.colors = colorsData.colors;
      });
    this.isLoading = false;
    this.form = new FormGroup({
      color: new FormControl(null, {
        validators: [Validators.required]
      })
    });
  }

  deleteColor() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    this.adminService.deleteColor(this.form.value.color);
    this.form.reset();
  }

  ngOnDestroy(): void {
    this.colorsSub.unsubscribe();
  }

}
