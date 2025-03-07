import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Project } from "../models/project.models";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ProjectService {
  readonly BASE_URL: string = environment.baseURL + "api/projects";

  constructor(private http: HttpClient) {}

  addProject(project: Project): Observable<Project> {
    return this.http.post(this.BASE_URL, project);
  }
  deleteProject(projectId: any): Observable<any> {
    return this.http.delete(this.BASE_URL + `/${projectId}`);
  }
  getAllProjects(params: any): Observable<Array<Project>> {
    if (params === null || params === undefined) {
      params = "createdAt";
    }
    let queryParams = { sortByAttribute: params };
    if (params) {
      queryParams = {
        ...queryParams,
        ...params,
      };
    }
    const httpParams = new HttpParams({ fromObject: queryParams });
    return this.http.get<Array<Project>>(this.BASE_URL, { params: httpParams });
  }
}
