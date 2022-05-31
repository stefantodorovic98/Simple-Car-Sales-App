import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private users: User[] = [];
  private brands: string[] = [];
  private models: string[] = [];
  private fuelTypes: string[] = [];
  private colors: string[] = [];
  private usersUpdated = new Subject<{users: User[]}>();
  private brandsUpdated = new Subject<{brands: string[]}>();
  private modelsUpdated = new Subject<{models: string[]}>();
  private fuelTypesUpdated = new Subject<{fuelTypes: string[]}>();
  private colorsUpdated = new Subject<{colors: string[]}>();

  constructor(private http: HttpClient, private router: Router) { }

  blockUser(userId: number) {
    this.http.get<User>('http://localhost:8081/api/admin/blockUser/' + userId)
      .subscribe({
        next: response => {
          console.log(response)
          this.getUsers();
        },
        error: error => {
          console.log(error);
          this.getUsers();
        }
      });
  }

  unblockUser(userId: number) {
    this.http.get<User>('http://localhost:8081/api/admin/unblockUser/' + userId)
      .subscribe({
        next: response => {
          console.log(response)
          this.getUsers();
        },
        error: error => {
          console.log(error);
          this.getUsers();
        }
      });
  }

  getUsers() {
    this.http.get<User[]>('http://localhost:8081/api/admin/getUsers')
      .subscribe(usersResponse => {
        this.users = [];
        usersResponse.forEach(element => {
          const user: User = {
            id: element.id,
            firstName: element.firstName,
            lastName: element.lastName,
            city: element.city,
            country: element.country,
            banned: element.banned
          };
          this.users.push(user);
        });
        this.usersUpdated.next({users: [...this.users]});
      });
  }

  adminDeleteCar(carId: number) {
    this.http.delete('http://localhost:8081/api/admin/adminDeleteCar/' + carId)
      .subscribe({
        next: response => {
          this.router.navigate(["/"]);
        },
        error: error => {
          console.log(error);
          this.router.navigate(["/"]);
        }
      });
  }

  getBrands() {
    this.http.get<{id: number, name: string}[]>('http://localhost:8081/api/admin/getBrands')
      .subscribe(brandResponse => {
        this.brands = [];
        brandResponse.forEach(element => {
          this.brands.push(element.name);
        });
        this.brandsUpdated.next({brands: [...this.brands]});
      });
  }

  addBrand(brandName: string) {
    this.http.post('http://localhost:8081/api/admin/addBrand', brandName)
      .subscribe({
        next: response => {
          this.router.navigate(["/admin"]);
        },
        error: error => {
          console.log(error);
          this.router.navigate(["/admin"]);
        }
      });
  }

  deleteBrand(brandName: string) {
    this.http.delete('http://localhost:8081/api/admin/deleteBrand/' + brandName)
      .subscribe({
        next: response => {
          this.router.navigate(["/admin"]);
        },
        error: error => {
          console.log(error);
          this.router.navigate(["/admin"]);
        }
      });
  }

  getModels(brandName: string) {
    this.http.get<{id: number, name: string}[]>('http://localhost:8081/api/admin/getModels/' + brandName)
      .subscribe(modelResponse => {
        this.models = [];
        modelResponse.forEach(element => {
          this.models.push(element.name);
        });
        this.modelsUpdated.next({models: [...this.models]});
      });
  }

  addModel(brandName: string, modelName: string) {
    const modelData = {brandName: brandName, modelName: modelName}
    this.http.post('http://localhost:8081/api/admin/addModel', modelData)
      .subscribe({
        next: response => {
          this.router.navigate(["/admin"]);
        },
        error: error => {
          console.log(error);
          this.router.navigate(["/admin"]);
        }
      });
  }

  deleteModel(brandName: string, modelName: string) {
    this.http.delete('http://localhost:8081/api/admin/deleteModel/' + brandName + '/' + modelName)
      .subscribe({
        next: response => {
          this.router.navigate(["/admin"]);
        },
        error: error => {
          console.log(error);
          this.router.navigate(["/admin"]);
        }
      });
  }

  getFuelTypes() {
    this.http.get<{id: number, name: string}[]>('http://localhost:8081/api/admin/getFuelTypes')
      .subscribe(fuelTypeResponse => {
        this.fuelTypes = [];
        fuelTypeResponse.forEach(element => {
          this.fuelTypes.push(element.name);
        });
        this.fuelTypesUpdated.next({fuelTypes: [...this.fuelTypes]});
      });
  }

  addFuelType(fuelType: string) {
    this.http.post('http://localhost:8081/api/admin/addFuelType', fuelType)
    .subscribe({
      next: response => {
        this.router.navigate(["/admin"]);
      },
      error: error => {
        console.log(error);
        this.router.navigate(["/admin"]);
      }
    });
  }

  deleteFuelType(fuelType: string) {
    this.http.delete('http://localhost:8081/api/admin/deleteFuelType/' + fuelType)
      .subscribe({
        next: response => {
          this.router.navigate(["/admin"]);
        },
        error: error => {
          console.log(error);
          this.router.navigate(["/admin"]);
        }
      });
  }

  getColors() {
    this.http.get<{id: number, name: string}[]>('http://localhost:8081/api/admin/getColors')
      .subscribe(colorResponse => {
        this.colors = [];
        colorResponse.forEach(element => {
          this.colors.push(element.name);
        });
        this.colorsUpdated.next({colors: [...this.colors]});
      });
  }

  addColor(colorName: string) {
    this.http.post('http://localhost:8081/api/admin/addColor', colorName)
      .subscribe({
        next: response => {
          this.router.navigate(["/admin"]);
        },
        error: error => {
          console.log(error);
          this.router.navigate(["/admin"]);
        }
      });
  }

  deleteColor(colorName: string) {
    this.http.delete('http://localhost:8081/api/admin/deleteColor/' + colorName)
      .subscribe({
        next: response => {
          this.router.navigate(["/admin"]);
        },
        error: error => {
          console.log(error);
          this.router.navigate(["/admin"]);
        }
      });
  }

  getUsersUpdateListener() {
    return this.usersUpdated.asObservable();
  }

  getBrandsUpdateListener() {
    return this.brandsUpdated.asObservable();
  }

  getModelsUpdateListener() {
    return this.modelsUpdated.asObservable();
  }

  getFuelTypesUpdateListener() {
    return this.fuelTypesUpdated.asObservable();
  }

  getColorsUpdateListener() {
    return this.colorsUpdated.asObservable();
  }
}
