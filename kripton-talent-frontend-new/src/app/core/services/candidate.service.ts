import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable, map, tap } from "rxjs";
import { Candidate } from "../models/candidate.models";
import { CandidateResponse } from "../models/data-service/candidateResponse.models";
import { Job } from "../models/job.models";
import { environment } from "src/environments/environment";
@Injectable({
  providedIn: "root",
})
export class CandidateService {
  readonly BASE_URL: string = environment.baseURL + "api/candidates";

  constructor(private http: HttpClient) {}

  addCandidate(candidate: FormData): Observable<Candidate> {
    return this.http.post(this.BASE_URL, candidate);
  }
  getCandidates(params: any): Observable<Candidate[]> {
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
    return this.http.get<Array<Candidate>>(this.BASE_URL, {
      params: httpParams,
    });
  }
  getCandidate(id: number): Observable<Candidate> {
    return this.http.get(`${this.BASE_URL}/${id}`);
  }
  deleteCandidate(candidate: Candidate): Observable<any> {
    return this.http.delete(`${this.BASE_URL}/${candidate.id}`);
  }
  updateCandidate(
    id: number | undefined,
    candidate: FormData
  ): Observable<Candidate> {
    return this.http.put(`${this.BASE_URL}/${id}`, candidate);
  }

  uploadBatch(candidates: FormData): Observable<string> {
    return this.http.post<string>(`${this.BASE_URL}/upload-batch`, candidates);
  }

  uploadCandidateResume(candidateCv: FormData): Observable<CandidateResponse> {
    return this.http.post(`${this.BASE_URL}/upload-candidate-cv`, candidateCv);
  }
  getRecommendation(
    idJob: any,
    numberOfCandidates: any
  ): Observable<Candidate[]> {
    return this.http.get<Candidate[]>(
      `${this.BASE_URL}/recommend-candidates/${idJob}/${numberOfCandidates}`
    );
  }
  getJobsRecommendation(
    idCandidate: any,
    numberOfJobs: any
  ): Observable<Job[]> {
    return this.http.get<Job[]>(
      `${this.BASE_URL}/recommend-jobs/${idCandidate}/${numberOfJobs}`
    );
  }
  sendMails(candidates: Array<number>, topic: string): Observable<string> {
    const requestBody = {
      candidates: candidates,
      topic: topic,
    };
    return this.http.post<string>(`${this.BASE_URL}/send-emails`, requestBody);
  }
  getStats(): Observable<any> {
    return this.http.get(this.BASE_URL + "/stats");
  }

  printResume(candidateId: any): Observable<string> {
    return this.http.get(this.BASE_URL + "/generate-resume/" + candidateId, {
      responseType: "text",
    });
  }

  getCandidateByInfoFromToken(
    firstName: any,
    lastName: any,
    email: any
  ): Observable<Candidate> {
    let queryParams = {
      firstName: firstName,
      lastName: lastName,
      email: email,
    };

    const httpParams = new HttpParams({ fromObject: queryParams });
    return this.http.get(this.BASE_URL + `/get-candidate-by-fle`, {
      params: httpParams,
    });
  }
}
