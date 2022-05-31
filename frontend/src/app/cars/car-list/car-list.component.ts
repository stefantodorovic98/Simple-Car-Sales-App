import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Car } from '../car.model';
import { CarsService } from '../cars.service';

@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.css']
})
export class CarListComponent implements OnInit, OnDestroy {
  cars: Car[] = [];
  isLoading: boolean = false;
  totalCars = 0;
  carsPerPage = 2;
  currentPage = 0;
  pageSizeOptions = [1, 2, 5, 10, 20];
  userIsAuthenticated: boolean = false;
  userId!: number;
  displayedColumns: string[] = ['title', 'brand', 'model', 'price', 'carInfo', 'path'];
  private carsSub!: Subscription;
  private authStatusSub!: Subscription;

  constructor(public carsService: CarsService, private authService: AuthService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.carsService.getCars(this.carsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.carsSub = this.carsService.getCarsUpdateListener()
      .subscribe((carData: {cars: Car[], carCount: number}) => {
        this.isLoading = false;
        this.totalCars = carData.carCount;
        this.cars = carData.cars;
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex;
    this.carsPerPage = pageData.pageSize;
    this.carsService.getCars(this.carsPerPage, this.currentPage);
  }

  onDelete(carId: number) {
    this.isLoading = true;
    this.carsService.deleteCar(carId)
      .subscribe({
        next: response => {
          this.carsService.getCars(this.carsPerPage, this.currentPage);
        },
        error: error => {
          this.isLoading = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.carsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

}
