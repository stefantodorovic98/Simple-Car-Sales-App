import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated: boolean = false;
  userIsAdmin: boolean = false;
  userIsBlocked: boolean = false;
  userId!: number;
  private authStatusSub!: Subscription;
  private adminStatusSub!: Subscription;
  private blockedStatusSub!: Subscription;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
    this.userIsAdmin = this.authService.getIsAdmin();
    this.adminStatusSub = this.authService.getAdminStatusListener()
      .subscribe(isAdmin => {
        this.userIsAdmin = isAdmin;
      });
    this.userIsBlocked = this.authService.getIsBlocked();
    this.blockedStatusSub = this.authService.getBlockedStatusListener()
      .subscribe(isBlocked => {
        this.userIsBlocked = isBlocked;
      })
  }

  userInfo() {
    this.userId = this.authService.getUserId();
    if (this.userId) {
      this.router.navigate(['/userInfo', this.userId]);
    }
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
    this.adminStatusSub.unsubscribe();
    this.blockedStatusSub.unsubscribe();
  }

}
