import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { Observable } from "rxjs";
import { LoginService } from "../services/login.service";

@Injectable({
  providedIn: "root",
})
export class ManagerGuard implements CanActivate {
  constructor(private router: Router, private loginService: LoginService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const currentUser = this.loginService.currentUserValue;
    const userRoles: [string] = currentUser?.roles;
    if (userRoles.map((role) => role.toLowerCase()).includes("manager")) {
      return true;
    } else {
      this.router.navigate(["/auth/errors/404-basic"]);
      return false;
    }
  }
}
