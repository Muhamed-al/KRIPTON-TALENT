import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
@Injectable({
  providedIn: "root",
})
export class QualificationService {
  readonly BASE_URL: string = environment.baseURL + "api/qualifications/skills";

  constructor(private http: HttpClient) {}
}
