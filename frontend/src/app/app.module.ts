import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { ErrorComponent } from './error/error.component';
import { CarAddComponent } from './cars/car-add/car-add.component';
import { CarListComponent } from './cars/car-list/car-list.component';
import { AuthInterceptor } from './auth/auth-interceptor';
import { ErrorInterceptor } from './error-interceptor';

import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from "@angular/material/core";
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { CarInfoComponent } from './cars/car-info/car-info.component';
import { MyCarListComponent } from './cars/my-car-list/my-car-list.component';
import { CarEditComponent } from './cars/car-edit/car-edit.component';
import { AdminControllerComponent } from './admin/admin-controller/admin-controller.component';
import { AddFuelTypeComponent } from './admin/add-fuel-type/add-fuel-type.component';
import { DeleteFuelTypeComponent } from './admin/delete-fuel-type/delete-fuel-type.component';
import { AddColorComponent } from './admin/add-color/add-color.component';
import { DeleteColorComponent } from './admin/delete-color/delete-color.component';
import { AddBrandComponent } from './admin/add-brand/add-brand.component';
import { DeleteBrandComponent } from './admin/delete-brand/delete-brand.component';
import { AddModelComponent } from './admin/add-model/add-model.component';
import { DeleteModelComponent } from './admin/delete-model/delete-model.component';
import { UserInfoComponent } from './auth/user-info/user-info.component';
import { PasswordChangeComponent } from './auth/password-change/password-change.component';
import { UserChangeComponent } from './auth/user-change/user-change.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    RegisterComponent,
    LoginComponent,
    ErrorComponent,
    CarAddComponent,
    CarListComponent,
    CarInfoComponent,
    MyCarListComponent,
    CarEditComponent,
    AdminControllerComponent,
    AddFuelTypeComponent,
    DeleteFuelTypeComponent,
    AddColorComponent,
    DeleteColorComponent,
    AddBrandComponent,
    DeleteBrandComponent,
    AddModelComponent,
    DeleteModelComponent,
    UserInfoComponent,
    PasswordChangeComponent,
    UserChangeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatSelectModule,
    MatTableModule,
    MatIconModule,
    HttpClientModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent]
})
export class AppModule { }
