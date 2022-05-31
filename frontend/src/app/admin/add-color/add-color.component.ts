import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-add-color',
  templateUrl: './add-color.component.html',
  styleUrls: ['./add-color.component.css']
})
export class AddColorComponent implements OnInit {
  form!: FormGroup;
  isLoading: boolean = false;

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.isLoading = false;
    this.form = new FormGroup({
      color: new FormControl(null, {
        validators: [Validators.required]
      })
    });
  }

  addColor() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    this.adminService.addColor(this.form.value.color);
    this.form.reset();
  }

}
