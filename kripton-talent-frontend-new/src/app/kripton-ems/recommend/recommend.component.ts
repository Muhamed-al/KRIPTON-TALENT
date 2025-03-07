import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Candidate } from "src/app/core/models/candidate.models";
import { Job } from "src/app/core/models/job.models";
import { CandidateService } from "src/app/core/services/candidate.service";
import { JobService } from "src/app/core/services/job.service";
import { LoginService } from "src/app/core/services/login.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-recommend",
  templateUrl: "./recommend.component.html",
  styleUrls: ["./recommend.component.scss"],
})
export class RecommendComponent implements OnInit {
  breadCrumbItems!: Array<{}>;
  numberOfRecs: number = 3;
  candidateRecSelected: boolean = true;
  searchTermCandidates: string = "";
  searchTermJobs: string = "";
  sortBySelectCandidates: string = "createdAt";
  sortBySelectJobs: string = "createdAt";
  candidateList!: Array<Candidate>;
  selectedCandidate!: any;
  selectedJob!: any;
  recommendedCandidates!: Array<any>;
  jobList!: Array<Job>;
  recommendedJobs!: Array<any>;
  constructor(
    private modalService: NgbModal,
    private loginService: LoginService,
    private candidateService: CandidateService,
    private jobService: JobService
  ) {}
  ngOnInit(): void {
    this.breadCrumbItems = [{ label: "Recommendations" }];

    this.getJobs(this.sortBySelectJobs);
    this.getCandidates(this.sortBySelectCandidates);
  }

  openModal(content: any) {
    this.modalService.open(content, { size: "md", centered: true });
  }
  toggleView() {
    this.candidateRecSelected = !this.candidateRecSelected;
  }
  searchForJobs() {
    if (this.searchTermJobs !== "" && this.searchTermJobs !== undefined) {
      this.recommendedJobs = this.recommendedJobs.filter((job: Job) => {
        return (
          job.title
            ?.toLowerCase()
            .includes(this.searchTermJobs.toLowerCase()) ||
          job.company
            ?.toLowerCase()
            .includes(this.searchTermJobs.toLowerCase()) ||
          job.description
            ?.toLowerCase()
            .includes(this.searchTermJobs.toLowerCase())
        );
      });
    } else {
      this.getRecommendation();
    }
  }
  searchForCandidates() {
    if (this.selectedJob) {
      if (
        this.searchTermCandidates !== "" &&
        this.searchTermCandidates !== undefined
      ) {
        this.recommendedCandidates = this.recommendedCandidates.filter(
          (candidate: any) => {
            return (
              candidate.first_name
                ?.toLowerCase()
                .includes(this.searchTermCandidates.toLowerCase()) ||
              candidate.last_name
                ?.toLowerCase()
                .includes(this.searchTermCandidates.toLowerCase()) ||
              candidate.designation
                ?.toLowerCase()
                .includes(this.searchTermCandidates.toLowerCase()) ||
              candidate.phone
                ?.toLowerCase()
                .includes(this.searchTermCandidates.toLowerCase())
            );
          }
        );
      } else {
        this.getRecommendation();
      }
    } else {
      Swal.fire({
        title: "Select a job first",
        icon: "warning",
      });
    }
  }
  numberOfRecsChange() {
    if (!this.numberOfRecs) {
      Swal.fire({
        title: "Please choose the number of recommendations",
        icon: "warning",
      });
    }
    this.getRecommendation();
  }
  sortChanged() {
    console.log("sort changed");
    this.getCandidates(this.sortBySelectCandidates);
  }
  sortJobChanged() {
    console.log("sort changed");
    this.getCandidates(this.sortBySelectCandidates);
  }
  getCandidates(sort: string) {
    this.candidateService.getCandidates(sort).subscribe((data) => {
      this.candidateList = data;
    });
  }
  getJobs(sort: any) {
    this.jobService.getJobs(sort).subscribe((data) => {
      this.jobList = data;
    });
  }
  candidateSelectChange() {
    this.getRecommendation();
  }
  jobSelectChange() {
    this.getRecommendation();
  }
  getRecommendation() {
    if (this.candidateRecSelected) {
      if (this.selectedJob) {
        this.candidateService
          .getRecommendation(this.selectedJob, this.numberOfRecs)
          .subscribe((res) => {
            console.log(res);
            this.recommendedCandidates = res;
          });
      } else {
        Swal.fire({
          title: "Select a Job First",
          icon: "warning",
        });
      }
    } else {
      if (this.selectedCandidate) {
        this.candidateService
          .getJobsRecommendation(this.selectedCandidate, this.numberOfRecs)
          .subscribe((res) => {
            console.log(res);
            this.recommendedJobs = res;
          });
      } else {
        Swal.fire({
          title: "Select a Candidate First",
          icon: "warning",
        });
      }
    }
  }
}
