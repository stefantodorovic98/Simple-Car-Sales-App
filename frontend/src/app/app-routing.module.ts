import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddBrandComponent } from './admin/add-brand/add-brand.component';
import { AddColorComponent } from './admin/add-color/add-color.component';
import { AddFuelTypeComponent } from './admin/add-fuel-type/add-fuel-type.component';
import { AddModelComponent } from './admin/add-model/add-model.component';
import { AdminControllerComponent } from './admin/admin-controller/admin-controller.component';
import { AdminGuard } from './admin/admin.guard';
import { BlockGuard } from './admin/block.guard';
import { DeleteBrandComponent } from './admin/delete-brand/delete-brand.component';
import { DeleteColorComponent } from './admin/delete-color/delete-color.component';
import { DeleteFuelTypeComponent } from './admin/delete-fuel-type/delete-fuel-type.component';
import { DeleteModelComponent } from './admin/delete-model/delete-model.component';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { PasswordChangeComponent } from './auth/password-change/password-change.component';
import { RegisterComponent } from './auth/register/register.component';
import { UserChangeComponent } from './auth/user-change/user-change.component';
import { UserInfoComponent } from './auth/user-info/user-info.component';
import { CarAddComponent } from './cars/car-add/car-add.component';
import { CarEditComponent } from './cars/car-edit/car-edit.component';
import { CarInfoComponent } from './cars/car-info/car-info.component';
import { CarListComponent } from './cars/car-list/car-list.component';
import { MyCarListComponent } from './cars/my-car-list/my-car-list.component';

const routes: Routes = [
  { path: '', component: CarListComponent },
  { path: 'add', component: CarAddComponent, canActivate: [AuthGuard, BlockGuard]},
  { path: 'carInfo/:carId', component: CarInfoComponent, canActivate: [AuthGuard] },
  { path: 'carEdit/:carId', component: CarEditComponent, canActivate: [AuthGuard, BlockGuard] },
  { path: 'myCarList', component: MyCarListComponent, canActivate: [AuthGuard, BlockGuard] },
  { path: 'admin', component: AdminControllerComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'addFuelType', component: AddFuelTypeComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'deleteFuelType', component: DeleteFuelTypeComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'addColor', component: AddColorComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'deleteColor', component: DeleteColorComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'addBrand', component: AddBrandComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'deleteBrand', component: DeleteBrandComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'addModel', component: AddModelComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'deleteModel', component: DeleteModelComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'userInfo/:userId', component: UserInfoComponent, canActivate: [AuthGuard] },
  { path: 'passwordChange/:userId', component: PasswordChangeComponent, canActivate: [AuthGuard] },
  { path: 'userChange/:userId', component: UserChangeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, AdminGuard, BlockGuard]
})
export class AppRoutingModule { }
