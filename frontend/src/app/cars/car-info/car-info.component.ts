import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { AdminService } from 'src/app/admin/admin.service';
import { AuthService } from 'src/app/auth/auth.service';
import { CarsService } from '../cars.service';

@Component({
  selector: 'app-car-info',
  templateUrl: './car-info.component.html',
  styleUrls: ['./car-info.component.css']
})
export class CarInfoComponent implements OnInit, OnDestroy {
  path!:string;
  isLoading: boolean = false;
  form!: FormGroup;
  ownerName!: string;
  ownerId!: number;
  userIsAuthenticated: boolean = false;
  userIsAdmin: boolean = false;
  private carId!: number;
  private authStatusSub!: Subscription;
  private adminStatusSub!: Subscription;

  constructor(public carsService: CarsService, public route: ActivatedRoute, private authService: AuthService, private adminService: AdminService) { }

  ngOnInit(): void {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService.getAuthStatusListener()
      .subscribe(authStatus => {
        this.userIsAuthenticated = authStatus;
        this.isLoading = false;
      });
    this.userIsAdmin = this.authService.getIsAdmin();
    this.adminStatusSub = this.authService.getAdminStatusListener()
      .subscribe(isAdmin => {
        this.userIsAdmin = isAdmin;
      });
    this.isLoading = false;
    this.form = new FormGroup({
      title: new FormControl(null, []),
      brand: new FormControl(null, []),
      model: new FormControl(null, []),
      mileage: new FormControl(null, []),
      registration: new FormControl(null, []),
      price: new FormControl(null,[]),
      fuel: new FormControl(null, []),
      color: new FormControl(null, []),
      phone: new FormControl(null, []),
      content: new FormControl(null, [])
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.carId = Number(paramMap.get('carId'));
      this.isLoading = true;
      this.carsService.getCar(this.carId)
        .subscribe(carData => {
          this.path = carData.path;
          this.isLoading = false;
          this.ownerName = carData.owner.firstName + " " + carData.owner.lastName;
          this.ownerId = carData.owner.id;
          this.form.setValue({
            title: carData.title,
            brand: carData.brand.name,
            model: carData.model.name,
            mileage: carData.mileage,
            registration: carData.registration,
            price: carData.price,
            fuel: carData.fuel.name,
            color: carData.color.name,
            phone: carData.phone,
            content: carData.content
          });
        });
    });
  }

  onAdminDelete() {
    if (this.carId) {
      this.isLoading = true;
      this.adminService.adminDeleteCar(this.carId);
    }
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
    this.adminStatusSub.unsubscribe();
  }


}
