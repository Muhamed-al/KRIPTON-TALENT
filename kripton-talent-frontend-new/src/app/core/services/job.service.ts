import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Job } from "../models/job.models";
import { Observable } from "rxjs";
import { Candidate } from "../models/candidate.models";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class JobService {
  readonly BASE_URL: string = environment.baseURL + "api/jobs";

  constructor(private http: HttpClient) {}

  addJob(job: FormData): Observable<Job> {
    return this.http.post(this.BASE_URL, job);
  }
  getJobs(params?: any): Observable<Job[]> {
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
    return this.http.get<Array<Job>>(this.BASE_URL, { params: httpParams });
  }
  getJobById(id: number): Observable<Job> {
    return this.http.get(`${this.BASE_URL}/${id}`);
  }
  updateJob(job: FormData, id: number | undefined): Observable<Job> {
    return this.http.put(`${this.BASE_URL}/${id}`, job);
  }
  deleteJob(id: number | undefined): Observable<any> {
    return this.http.delete(`${this.BASE_URL}/${id}`);
  }

  /**
   * assign candidate or candidates to job
   */
  assignCandidateToJob(candidate: Candidate, job: Job): Observable<any> {
    return this.http.put(
      `${this.BASE_URL}/assign-job/${job.id}/to-candidate/${candidate.id}`,
      {}
    );
  }

  assignCandidatesToJob(candidates: Array<any>, job: Job): Observable<any> {
    return this.http.put(
      `${this.BASE_URL}/assign-multiple/${job.id}`,
      candidates
    );
  }

  assignJobsToCandidate(
    jobIds: Array<any>,
    candidate: Candidate
  ): Observable<string> {
    return this.http.put<string>(
      `${this.BASE_URL}/assign-candidate/${candidate.id}/jobs`,
      jobIds
    );
  }

  /**
   *
   */
  getAssignedCandidatesOfJob(
    jobId: number | undefined
  ): Observable<Candidate[]> {
    return this.http.get<Candidate[]>(
      `${this.BASE_URL}/assigned-candidates/${jobId}`
    );
  }
  removeAssignment(candidate: Candidate, job: Job): Observable<any> {
    return this.http.delete(
      `${this.BASE_URL}/unassign-candidate/${candidate.id}/job/${job.id}`
    );
  }

  getJobsThatCandidateIsNotAssignedTo(
    candidateId: number | undefined
  ): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.BASE_URL}/candidate/${candidateId}`);
  }

  getStats(): Observable<any> {
    return this.http.get(this.BASE_URL + "/stats");
  }
}
