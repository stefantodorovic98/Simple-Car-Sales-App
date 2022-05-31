import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Car } from '../car.model';
import { CarsService } from '../cars.service';
import { AuthService } from 'src/app/auth/auth.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-my-car-list',
  templateUrl: './my-car-list.component.html',
  styleUrls: ['./my-car-list.component.css']
})
export class MyCarListComponent implements OnInit, OnDestroy {
  myCars: Car[] = [];
  isLoading: boolean = false;
  totalCars = 0;
  carsPerPage = 2;
  currentPage = 0;
  pageSizeOptions = [1, 2, 5, 10, 20];
  userIsAuthenticated: boolean = false;
  userId!: number;
  private myCarsSub!: Subscription;
  private authStatusSub!: Subscription;

  constructor(public carsService: CarsService, public authService: AuthService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.userId = this.authService.getUserId();
    this.carsService.getMyCars(this.userId, this.carsPerPage, this.currentPage);
    this.myCarsSub = this.carsService.getMyCarsUpdateListener()
      .subscribe((myCarData: {cars: Car[], carCount: number}) => {
        this.isLoading = false;
        this.totalCars = myCarData.carCount;
        this.myCars = myCarData.cars;
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
    this.userId = this.authService.getUserId();
    this.carsService.getMyCars(this.userId, this.carsPerPage, this.currentPage);
  }

  onDelete(carId: number) {
    this.isLoading = true;
    this.carsService.deleteCar(carId)
      .subscribe({
        next: response => {
          console.log(response);
          this.carsService.getMyCars(this.userId, this.carsPerPage, this.currentPage);
        },
        error: error => {
          console.log(error);
          this.isLoading = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.myCarsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

}
