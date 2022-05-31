import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../auth/auth.service";

@Injectable()
export class BlockGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const isBlocked: boolean = this.authService.getIsBlocked();
    if (isBlocked) {
      this.router.navigate(['/']);
    }
    return !isBlocked;
  }

}
