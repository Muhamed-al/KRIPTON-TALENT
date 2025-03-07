import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { TaskUser } from "../models/task-user.models";
import { environment } from "src/environments/environment";
@Injectable({
  providedIn: "root",
})
export class UserManagementService {
  readonly BASE_URL: string = environment.baseURL + "api/users/manage";

  constructor(private http: HttpClient) {}

  getUsers(): Observable<Array<TaskUser>> {
    return this.http.get<Array<TaskUser>>(this.BASE_URL);
  }
  getUsersInEachRole(): Observable<Array<TaskUser>> {
    return this.http.get<Array<TaskUser>>(this.BASE_URL + "/users");
  }
}
