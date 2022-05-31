import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Car } from './car.model';

@Injectable({
  providedIn: 'root'
})
export class CarsService {
  private cars: Car[] = [];
  private myCars: Car[] = [];
  private carsUpdated = new Subject<{cars: Car[], carCount: number}>();
  private myCarsUpdated = new Subject<{cars: Car[], carCount: number}>();

  constructor(private http: HttpClient, private router: Router) { }

  getCarsUpdateListener() {
    return this.carsUpdated.asObservable();
  }

  getMyCarsUpdateListener() {
    return this.myCarsUpdated.asObservable();
  }

  addCar(title: string, brand: string, model: string, mileage: number, registration: number,
     price: number, fuel: string, color: string,  phone: string, content: string, image: File) {
    const car: Car = {
      id: -1,
      title: title,
      brand: brand,
      model: model,
      mileage: mileage,
      registration: registration,
      price: price,
      fuel: fuel,
      color: color,
      phone: phone,
      content: content,
      path: "",
      owner_id: -1
    };
    let titleArray: string[] = title.trim().split(/\s+/);
    let titleConnected: string = titleArray.join('-');
    const carData = new FormData();
    console.log( JSON.stringify(car))
    carData.append('image', image, titleConnected);
    carData.append('car', JSON.stringify(car));
    this.http.post<Car>('http://localhost:8081/api/cars/addCar', carData)
      .subscribe(carResponse => {
        this.router.navigate(["/"]);
      })
  }

  getCar(id: number) {
    return this.http.get<{
        id: number,
        title: string,
        brand: {
          id: number,
          name: string
        },
        model: {
          id: number,
          name: string
        },
        mileage: number,
        registration: number,
        price: number,
        fuel: {
          id: number,
          name: string
        },
        color: {
          id: number,
          name: string
        },
        phone: string,
        content: string,
        path: string,
        owner: {
          id: number,
          firstName: string,
          lastName: string,
          city: string,
          country: string
        }
      }>
      ('http://localhost:8081/api/cars/getCar/' + id);
  }

  getCars(carsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${carsPerPage}&page=${currentPage}`;
    this.http.get<{
      cars: {
        id: number,
        title: string,
        brand: {
          id: number,
          name: string
        },
        model: {
          id: number,
          name: string
        },
        mileage: number,
        registration: number,
        price: number,
        fuel: {
          id: number,
          name: string
        },
        color: {
          id: number,
          name: string
        },
        phone: string,
        content: string,
        path: string,
        owner: {
          id: number,
          firstName: string,
          lastName: string,
          city: string,
          country: string
        }
      }[],
      count: number
    }>('http://localhost:8081/api/cars/getCars' + queryParams)
      .subscribe(carResponse => {
        this.cars = [];
        carResponse.cars.forEach(element => {
          const car: Car = {
            id: element.id,
            title: element.title,
            brand: element.brand.name,
            model: element.model.name,
            mileage: element.mileage,
            registration: element.registration,
            price: element.price,
            fuel: element.fuel.name,
            color: element.color.name,
            phone: element.phone,
            content: element.content,
            path: element.path,
            owner_id: element.owner.id
          };
          this.cars.push(car);
        });
        this.carsUpdated.next({cars: [...this.cars], carCount: carResponse.count});
      });
  }

  getMyCars(userId: number, carsPerPage: number, currentPage: number) {
    let id = userId;
    const queryParams = `?pagesize=${carsPerPage}&page=${currentPage}`;
    this.http.get<{
      cars: {
        id: number,
        title: string,
        brand: {
          id: number,
          name: string
        },
        model: {
          id: number,
          name: string
        },
        mileage: number,
        registration: number,
        price: number,
        fuel: {
          id: number,
          name: string
        },
        color: {
          id: number,
          name: string
        },
        phone: string,
        content: string,
        path: string,
        owner: {
          id: number,
          firstName: string,
          lastName: string,
          city: string,
          country: string
        }
      }[],
      count: number
    }>('http://localhost:8081/api/cars/getMyCars/' + id + queryParams).
      subscribe(carResponse => {
        console.log(carResponse);
        this.myCars = [];
        carResponse.cars.forEach(element => {
          const car: Car = {
            id: element.id,
            title: element.title,
            brand: element.brand.name,
            model: element.model.name,
            mileage: element.mileage,
            registration: element.registration,
            price: element.price,
            fuel: element.fuel.name,
            color: element.color.name,
            phone: element.phone,
            content: element.content,
            path: element.path,
            owner_id: element.owner.id
          };
          this.myCars.push(car);
        });
        this.myCarsUpdated.next({cars: [...this.myCars], carCount: carResponse.count});
      });
  }

  updateCar(id: number, title: string, brand: string, model: string,
    image: File | string, mileage: number, registration: number,
    price: number, fuel: string, color: string, phone: string, content: string) {
      const car: Car = {
        id: id,
        title: title,
        brand: brand,
        model: model,
        mileage: mileage,
        registration: registration,
        price: price,
        fuel: fuel,
        color: color,
        phone: phone,
        content: content,
        path: "",
        owner_id: -1
      };
      if (typeof(image) === 'object') {
        let titleArray: string[] = title.trim().split(/\s+/);
        let titleConnected: string = titleArray.join('-');
        const carData = new FormData();
        carData.append('image', image, titleConnected);
        carData.append('car', JSON.stringify(car));
        this.http.put<Car>('http://localhost:8081/api/cars/updateCarImage/' + id, carData)
        .subscribe({
          next: response => {
            console.log(response);
            this.router.navigate(["/myCarList"]);
          },
          error: error => {
            console.log(error);
            this.router.navigate(["/myCarList"]);
          }
        });
      } else {
        this.http.put<Car>('http://localhost:8081/api/cars/updateCarNoImage/' + id, car)
        .subscribe({
          next: response => {
            console.log(response);
            this.router.navigate(["/myCarList"]);
          },
          error: error => {
            console.log(error);
            this.router.navigate(["/myCarList"]);
          }
        });
      }
  }

  deleteCar(carId: number) {
    return this.http.delete('http://localhost:8081/api/cars/deleteCar/' + carId)
  }

}
