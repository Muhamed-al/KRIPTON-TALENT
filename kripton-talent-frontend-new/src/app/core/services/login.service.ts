import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Login } from "../models/login.models";
import jwt_decode from "jwt-decode";
import { environment } from "src/environments/environment";
@Injectable({
  providedIn: "root",
})
export class LoginService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  readonly BASE_URL: string = environment.baseURL + "api/users/";

  public loginRequest: any = environment.loginRequest;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem("currentUser")!)
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  /**
   * current user
   */
  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  /**
   * Performs the auth
   * @param email email of user
   * @param password password of user
   */
  login(username: string, password: string) {
    this.loginRequest = {
      ...this.loginRequest,
      username: username,
      password: password,
    };
    return this.http
      .post<Login>(this.BASE_URL + "auth/login", this.loginRequest)
      .pipe(
        map((response) => {
          const decoded_token: any | undefined = jwt_decode(
            response?.access_token as string
          );
          let user: any = {};
          // login successful if there's a jwt token in the response
          user["id"] = decoded_token["sub"];
          user["email"] = decoded_token["email"];
          user["username"] = decoded_token["name"];
          user["firstName"] = decoded_token["given_name"];
          user["lastName"] = decoded_token["family_name"];
          user["roles"] = decoded_token["realm_access"].roles;
          user["session"] = decoded_token["session_state"];
          user["token"] = response?.access_token as string;
          let userRoles: [string] = user.roles;
          if (userRoles.includes("candidate")) user["status"] = "candidate";
          if (userRoles.includes("recruiter")) user["status"] = "recruiter";
          if (userRoles.includes("manager")) user["status"] = "manager";

          localStorage.setItem("currentUser", JSON.stringify(user));
          this.currentUserSubject.next(user);
          return user;
        })
      );
  }

  /**
   * Logout the user
   */
  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem("currentUser");
    this.currentUserSubject.next(null!);
  }

  register(request: any): Observable<any> {
    return this.http.post(this.BASE_URL + "auth/register", request, {
      responseType: "text",
    });
  }
}
