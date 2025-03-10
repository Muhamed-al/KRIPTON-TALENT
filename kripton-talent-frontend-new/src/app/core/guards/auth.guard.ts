import { Injectable } from "@angular/core";
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";

// Auth Services
import { environment } from "../../../environments/environment";
import { LoginService } from "../services/login.service";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private loginService: LoginService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.loginService.currentUserValue;
    if (currentUser) {
      return true;
    } else {
      // not logged in so redirect to login page with the return url
      this.router.navigate(["/auth/login"], {
        queryParams: { returnUrl: state.url },
      });
      return false;
    }
  }
}
