import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AdminService } from '../admin.service';
import { User } from '../user.model';

@Component({
  selector: 'app-admin-controller',
  templateUrl: './admin-controller.component.html',
  styleUrls: ['./admin-controller.component.css']
})
export class AdminControllerComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;
  users: User[] = [];
  displayedColumns: string[] = ['firstName', 'lastName', 'userInfo', 'userOptions'];
  private usersSub!: Subscription;

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.isLoading = false;
    this.adminService.getUsers();
    this.usersSub = this.adminService.getUsersUpdateListener()
      .subscribe((usersData: {users: User[]}) => {
        this.users = usersData.users;
      });
    this.adminService.getUsers();
  }

  blockUser(userId: number) {
    this.adminService.blockUser(userId);
  }

  unblockUser(userId: number) {
    this.adminService.unblockUser(userId);
  }

  ngOnDestroy(): void {
    this.usersSub.unsubscribe();
  }
}
