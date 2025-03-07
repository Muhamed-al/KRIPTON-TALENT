import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { JobApplication } from "../models/jobApplication.models";
import { environment } from "src/environments/environment";
@Injectable({
  providedIn: "root",
})
export class JobApplicationService {
  readonly BASE_URL: string = environment.baseURL + "api/jobs/job-applications";

  constructor(private http: HttpClient) {}

  getJobApplications(): Observable<Array<JobApplication>> {
    return this.http.get<Array<JobApplication>>(this.BASE_URL);
  }
  addJobApplication(
    jobApplication: JobApplication,
    idCandidate: number,
    idJob: number
  ): Observable<JobApplication> {
    return this.http.post(
      this.BASE_URL + `/candidate/${idCandidate}/job/${idJob}`,
      jobApplication
    );
  }
  getJobApplicationsOfCertainCandidateToACertainJob(
    idCandidate: number,
    idJob: number
  ): Observable<JobApplication> {
    return this.http.get(
      this.BASE_URL + `/candidate/${idCandidate}/job/${idJob}`
    );
  }
  getJobApplicationsOfCertainCandidate(
    idCandidate: number | undefined
  ): Observable<JobApplication[]> {
    return this.http.get<JobApplication[]>(
      this.BASE_URL + `/candidate/${idCandidate}`
    );
  }
  getJobApplicationsOfCertainJob(idJob: number): Observable<[JobApplication]> {
    return this.http.get<[JobApplication]>(this.BASE_URL + `/job/${idJob}`);
  }

  deleteJobApplication(idApplication: number | undefined): Observable<string> {
    return this.http.delete<string>(this.BASE_URL + `/${idApplication}`);
  }

  updateJobApplication(
    jobApplication: JobApplication,
    idJobApplication: number | undefined
  ): Observable<JobApplication> {
    return this.http.put(
      this.BASE_URL + `/${idJobApplication}`,
      jobApplication
    );
  }
  deleteMultipleJobApps(jobAppsIds: any): Observable<string> {
    return this.http.post<string>(this.BASE_URL + "/multiple", jobAppsIds);
  }
}
