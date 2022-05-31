import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { SignupData } from './singup-data.model';
import { LoginData } from './login-data.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated: boolean = false;
  private isAdmin: boolean = false;
  private isBlocked: boolean = false;
  private token: string = "";
  private tokenTimer!: any;
  private userId!: number;
  private authStatusListener = new Subject<boolean>();
  private adminStatusListener = new Subject<boolean>();
  private blockedStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) { }

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getIsAdmin() {
    return this.isAdmin;
  }

  getIsBlocked() {
    console.log(this.isBlocked)
    return this.isBlocked;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getAdminStatusListener() {
    return this.adminStatusListener.asObservable();
  }

  getBlockedStatusListener() {
    return this.blockedStatusListener.asObservable();
  }

  getUserId() {
    return this.userId;
  }

  login(email: string, password: string) {
    const loginData: LoginData = {username: email, password: password};
    this.http.post<{access_token: string, expiresIn: string}>("http://localhost:8081/api/users/login", loginData)
      .subscribe({
        next : response => {
            const token = response.access_token;
            this.token = token;
            if (token !== null && token !== "") {
              const expiresInDuration: number = Number(response.expiresIn);
              this.setAuthTimer(expiresInDuration);
              this.isAuthenticated = true;
              this.authStatusListener.next(true);
              const now = new Date();
              const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
              console.log(expirationDate);
              this.http.get<number>("http://localhost:8081/api/users/getUserId")
                .subscribe(response => {
                  console.log(response)
                  const userId = response;
                  this.userId = userId;
                  this.http.get<boolean>("http://localhost:8081/api/users/hasAdminPrivilege")
                    .subscribe(response => {
                      this.isAdmin = response;
                      this.adminStatusListener.next(response);
                      this.http.get<boolean>("http://localhost:8081/api/users/isBlocked/" + this.userId)
                        .subscribe(response => {
                            this.isBlocked = response;
                            this.blockedStatusListener.next(response);
                            this.saveAuthData(token, expirationDate, userId, this.isAdmin, this.isBlocked);
                        });
                    });
                  this.router.navigate(['/']);
                });
            }
        },
        error : error => {
          console.log(error);
          this.authStatusListener.next(false);
        }
      });
  }

  getUserById(userId: number) {
    return this.http.get<{
            id: number,
            firstName: string,
            lastName: string,
            timestamp: number,
            city: string,
            country: string
          }>('http://localhost:8081/api/users/getUserById/' + userId);
  }

  createUser(firstName: string, lastName: string, email: string, password: string,
     birthdate: Date, city: string, country: string) {
    const signupData: SignupData = {
      firstName: firstName,
      lastName: lastName,
      username: email,
      password: password,
      timestamp: birthdate.getTime(),
      city: city,
      country: country
    };
    console.log(signupData);
    this.http.post('http://localhost:8081/api/users/signup', signupData)
      .subscribe({
        next: response => {
          this.router.navigate(["/"]);
        },
        error: error => {
          this.authStatusListener.next(false);
        }
      });
  }

  changePassword(userId: number, oldPassword: string, newPassword: string) {
    const changePasswordData = {userId: userId, oldPassword: oldPassword, newPassword: newPassword};
    this.http.post('http://localhost:8081/api/users/changePassword', changePasswordData)
    .subscribe({
      next: response => {
        alert("Lozinka je promenjena!")
        this.router.navigate(["/userInfo", userId]);
      },
      error: error => {
        this.router.navigate(["/userInfo", userId]);
      }
    });
  }

  updateUser(userId: number, firstName: string, lastName: string, birthdate: Date, city: string, country: string) {
      const changeUserData = {firstName: firstName, lastName: lastName, timestamp: birthdate.getTime(), city: city, country: country};
      this.http.put('http://localhost:8081/api/users/updateUser/' + userId, changeUserData)
        .subscribe({
          next: response => {
            alert("Promenjeni su podaci!");
            this.router.navigate(["/userInfo", userId]);
          },
          error: error => {
            this.router.navigate(["/userInfo", userId]);
          }
        });
  }

  logout() {
    this.token = "";
    this.isAuthenticated = false;
    this.userId = -100;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    if (this.isAdmin) {
      this.isAdmin = false;
      this.adminStatusListener.next(false);
    }
    if (this.isBlocked) {
      this.isBlocked = false;
      this.blockedStatusListener.next(false);
    }
    this.http.get("http://localhost:8081/api/users/logout")
      .subscribe(response => {
        console.log(response);
        this.router.navigate(['/']);
      })

  }

  autoAuthUser() {
    const authInformation  = this.getAuthData();
    const now = new Date();
    if (!authInformation) {
      return;
    }
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      console.log(authInformation)
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.isAdmin = authInformation.isAdmin;
      this.isBlocked = authInformation.isBlocked;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
      this.http.get<boolean>("http://localhost:8081/api/users/hasAdminPrivilege")
        .subscribe(response => {
          this.isAdmin = response;
          this.adminStatusListener.next(response);
          this.http.get<boolean>("http://localhost:8081/api/users/isBlocked/" + this.userId)
          .subscribe(response => {
              this.isBlocked = response;
              this.blockedStatusListener.next(response);
          });
        });
    }

  }

  private setAuthTimer(duration: number) {
    console.log("Setting timer: " + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, exiprationDate: Date, userId: number, isAdmin: boolean, isBlocked: boolean) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", exiprationDate.toISOString());
    localStorage.setItem("userId", userId + "");
    localStorage.setItem("isAdmin", (isAdmin ? 1 : 0) + "");
    localStorage.setItem("isBlocked", (isBlocked ? 1 : 0) + "");
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("isBlocked");
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = Number(localStorage.getItem("userId"));
    const isAdmin = (Number(localStorage.getItem("isAdmin")) === 1) ? true : false;
    const isBlocked = (Number(localStorage.getItem("isBlocked")) === 1) ? true : false;
    if (!token || !expirationDate || !userId) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId,
      isAdmin: isAdmin,
      isBlocked: isBlocked
    }
  }
}
