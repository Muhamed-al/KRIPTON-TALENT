import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Candidate } from "src/app/core/models/candidate.models";
import { Job } from "src/app/core/models/job.models";
import { JobApplication } from "src/app/core/models/jobApplication.models";
import { CandidateService } from "src/app/core/services/candidate.service";
import { JobApplicationService } from "src/app/core/services/job-application.service";
import { JobService } from "src/app/core/services/job.service";
// Sweet Alert
import Swal from "sweetalert2";
// Data Get
import { related } from "./data";
import { Candidate_Rec } from "src/app/core/models/Candidate_Rec.models";

@Component({
  selector: "app-overview",
  templateUrl: "./overview.component.html",
  styleUrls: ["./overview.component.scss"],
})
export class OverviewComponent implements OnInit {
  relatedjobs: any;
  bookmark: boolean = true;
  selectedJob!: Job;
  jobApplications!: [JobApplication];
  assignedCandidatesToThisJob!: Array<Candidate>;
  recommendedCandidates!: Array<Candidate_Rec>;
  constructor(
    private route: ActivatedRoute,
    private jobService: JobService,
    private candidateService: CandidateService,
    private jobApplicationService: JobApplicationService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get("id");
    if (id !== null) {
      this.jobService.getJobById(parseInt(id)).subscribe((res) => {
        this.selectedJob = res;
        this.getRecommendedCandidate();
        this.jobApplicationService
          .getJobApplicationsOfCertainJob(parseInt(id))
          .subscribe((apps) => {
            this.jobApplications = apps;
          });
      });
      this.getAssignedCandidatesToThisJob(parseInt(id));
    }
  }
  getAssignedCandidatesToThisJob(jobId: number) {
    this.jobService.getAssignedCandidatesOfJob(jobId).subscribe(
      (res) => {
        this.assignedCandidatesToThisJob = res;
      },
      (error) => {
        console.error(error);
      }
    );
  }
  removeAssignment(candidate: Candidate) {
    this.jobService
      .removeAssignment(candidate, this.selectedJob)
      .toPromise()
      .then(
        (res) => {
          Swal.fire({
            title: `${candidate.lastName} is no longer assigned to this job`,
            text: "Ok !",
            icon: "info",
          });
          this.assignedCandidatesToThisJob.splice(
            this.assignedCandidatesToThisJob.indexOf(candidate),
            1
          );
        },
        (err) => {
          console.error(err);
        }
      );
  }
  getRecommendedCandidate() {
    this.candidateService
      .getRecommendation(this.selectedJob.id, 2)
      .subscribe((res) => {
        this.recommendedCandidates = res;
        console.log(this.recommendedCandidates);
      });
  }
  deleteCandidate(candidate: Candidate) {
    Swal.fire({
      title: `You are about to delete candidate : ${candidate?.lastName} ${candidate?.firstName} ?`,
      text: "Confirm !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "rgb(3, 142, 220)",
      cancelButtonColor: "rgb(243, 78, 78)",
      confirmButtonText: "Delete!",
      cancelButtonText: "Close",
    }).then((result) => {
      if (result.isConfirmed) {
        this.candidateService
          .deleteCandidate(candidate)
          .toPromise()
          .then((res) => {
            console.log(res);
            Swal.fire(
              "Success !",
              `Candidate : ${candidate.id} has been Deleted.`,
              "success"
            ).then(() => {
              location.reload();
            });
          })
          .catch((err) => {
            console.error(err);
          });
      }
    });
  }
}
