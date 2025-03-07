import { DecimalPipe } from "@angular/common";
import { AfterViewInit, Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  UntypedFormBuilder,
  Validators,
  UntypedFormGroup,
  FormGroup,
} from "@angular/forms";

import { ApplicationService } from "./application.service";
import { Options } from "@angular-slider/ngx-slider";

// Sweet Alert
import Swal from "sweetalert2";
import { JobApplicationService } from "src/app/core/services/job-application.service";
import { JobApplication } from "src/app/core/models/jobApplication.models";
import { JobService } from "src/app/core/services/job.service";
import { Job } from "src/app/core/models/job.models";
import { CandidateService } from "src/app/core/services/candidate.service";

@Component({
  selector: "app-application",
  templateUrl: "./application.component.html",
  styleUrls: ["./application.component.scss"],
  providers: [ApplicationService, DecimalPipe],
})
export class ApplicationComponent implements OnInit, AfterViewInit {
  // bread crumb items
  breadCrumbItems!: Array<{}>;
  currentDate!: any;
  applications: any;
  masterSelected!: boolean;
  searchTerm: string = "";
  checkedList!: Array<any>;
  // Form
  applicationData!: UntypedFormGroup;
  applicationDataUpdate!: FormGroup;
  submitted = false;
  jobs!: Array<any>;
  candidates!: Array<any>;
  modalUpdate: boolean = false;
  // Table data
  applicationList!: Array<JobApplication>;
  newApplicationsList!: Array<JobApplication>;
  totalApplications: number = -1;
  pageSize: number = 5;
  pageAll: number = 1;

  constructor(
    public formBuilder: UntypedFormBuilder,
    public modalService: NgbModal,
    private jobApplicationService: JobApplicationService,
    private jobService: JobService,
    private candidateService: CandidateService
  ) {}
  ngAfterViewInit(): void {
    this.getCompanies();
    this.getCandidates();
  }

  ngOnInit(): void {
    /**
     * BreadCrumb
     */
    this.breadCrumbItems = [
      { label: "Jobs" },
      { label: "Application", active: true },
    ];
    this.getJobApplications();

    this.applicationData = this.formBuilder.group({
      id: [""],
      opportunity: ["", [Validators.required]],
      availability: ["", [Validators.required]],
      candidate: ["", [Validators.required]],
      desiredSalary: ["", [Validators.required]],
      coverLetter: [""],
    });
    this.applicationDataUpdate = this.formBuilder.group({
      id: [""],
      availability: ["", [Validators.required]],
      desiredSalary: ["", [Validators.required]],
      coverLetter: [""],
    });
  }
  getCompanies() {
    this.jobService.getJobs().subscribe((res: Job[]) => {
      this.jobs = res.filter((job) => job.company !== null);
    });
  }
  getCandidates() {
    this.candidateService.getCandidates(null).subscribe((res) => {
      this.candidates = res.filter((candidate) => candidate.completed == false);
    });
  }
  getJobApplications() {
    this.jobApplicationService
      .getJobApplications()
      .subscribe((res: Array<JobApplication>) => {
        this.applicationList = res;
        this.totalApplications = res.length;
        const today = new Date();
        const lastMonthStart = new Date(
          today.getFullYear(),
          today.getMonth() - 1,
          1
        );

        // Filter the JobApplication objects based on the createdAt property
        this.newApplicationsList = this.applicationList.filter(
          (application) => {
            if (application.createdAt != null) {
              const createdAt = new Date(application.createdAt);
              return createdAt >= lastMonthStart && createdAt <= today;
            }
            return false;
          }
        );

        document.getElementById("elmLoader")?.classList.add("d-none");
        document.getElementById("job-overview")?.classList.remove("d-none");
      });
  }

  searchForJobApps() {
    if (this.searchTerm != "" && this.searchTerm != undefined) {
      this.applicationList = this.applicationList.filter(
        (application) =>
          application.candidate?.firstName
            ?.toLowerCase()
            .includes(this.searchTerm.toLowerCase()) ||
          application.candidate?.lastName
            ?.toLowerCase()
            .includes(this.searchTerm.toLowerCase()) ||
          application.job?.title
            ?.toLowerCase()
            .includes(this.searchTerm.toLowerCase()) ||
          application.job?.company
            ?.toLowerCase()
            .includes(this.searchTerm.toLowerCase()) ||
          application.candidate?.designation
            ?.toLowerCase()
            .includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.getJobApplications();
    }
  }
  resetInputDate() {
    this.currentDate = null;
    this.getJobApplications();
  }
  dateRangeChanged() {
    if (
      this.currentDate.from != undefined &&
      this.currentDate?.to != undefined
    ) {
      this.applicationList = this.applicationList.filter((application) => {
        if (application.createdAt) {
          return (
            new Date(application.createdAt) >=
              new Date(this.currentDate?.from) &&
            new Date(application.createdAt) <= new Date(this.currentDate?.to)
          );
        } else return false;
      });
    } else {
      this.getJobApplications();
    }
  }
  /**
   * Returns form
   */
  get form() {
    return this.applicationData.controls;
  }

  saveApplication() {
    if (this.applicationData.valid) {
      let jobApplication = new JobApplication();
      console.log("saving jobapp");
      jobApplication.desiredSalary =
        this.applicationData.get("desiredSalary")?.value;
      jobApplication.availability =
        this.applicationData.get("availability")?.value;
      jobApplication.coverLetter =
        this.applicationData.get("coverLetter")?.value;

      const candidateId = this.applicationData.get("candidate")?.value;
      const jobId = this.applicationData.get("opportunity")?.value;
      this.jobApplicationService
        .addJobApplication(jobApplication, candidateId, jobId)
        .subscribe((res) => {
          this.getJobApplications();
          Swal.fire({
            title: "Application Saved Successfully !",
          })
            .then(() => {
              this.applicationData.reset();
              this.modalService.dismissAll();
            })
            .catch((error) => {
              console.log(error);
            });
        });
    }
  }

  updateApplicationModal(modal: any, jobApp: JobApplication) {
    this.modalUpdate = true;
    this.applicationDataUpdate = this.formBuilder.group({
      id: [jobApp.id],
      opportunity: [jobApp.job?.id, [Validators.required]],
      availability: [jobApp?.availability, [Validators.required]],
      candidate: [jobApp.candidate?.id, [Validators.required]],
      desiredSalary: [jobApp?.desiredSalary, [Validators.required]],
      coverLetter: [jobApp?.coverLetter],
    });
    this.openModal(modal);
  }
  updateApplication() {
    let jobApplication = new JobApplication();
    jobApplication.desiredSalary =
      this.applicationDataUpdate.get("desiredSalary")?.value;
    jobApplication.availability =
      this.applicationDataUpdate.get("availability")?.value;
    jobApplication.coverLetter =
      this.applicationDataUpdate.get("coverLetter")?.value;
    this.jobApplicationService
      .updateJobApplication(
        jobApplication,
        this.applicationDataUpdate.get("id")?.value
      )
      .subscribe((res) => {
        Swal.fire({
          title: "Application Edited successfully !",
        }).then((value) => {
          if (value) {
            this.modalService.dismissAll();
            this.getJobApplications();
            this.applicationData.reset();
            this.modalUpdate = false;
          }
        });
      });
  }
  deleteApplication(jobApp: JobApplication) {
    Swal.fire({
      title: "Are you Sure you want to delete it !",
      showDenyButton: true,
      icon: "warning",
    }).then((val) => {
      console.log(val);
      if (val.value) {
        this.jobApplicationService
          .deleteJobApplication(jobApp.id)
          .subscribe(() => {
            Swal.fire({
              title: "Deleted successfully !",
            });
            this.getJobApplications();
          });
      }
    });
  }
  isAllSelected() {
    this.masterSelected = this.applicationList?.every(
      (item: any) => item.isSelected == true
    );
    this.getCheckedItemList();
  }
  getCheckedItemList() {
    let list = [];
    for (let i = 0; i < this.applicationList?.length; i++) {
      if (this.applicationList[i].isSelected) {
        list.push(this.applicationList[i]);
      }
      this.checkedList = list;
    }
  }
  checkUncheckAll() {
    this.applicationList?.forEach((element: JobApplication) => {
      element.isSelected = this.masterSelected;
    });
    this.getCheckedItemList();
  }
  openModal(modal: any) {
    this.modalService.open(modal, { size: "md", centered: true });
  }

  // Delete Data
  deleteMultiple() {
    const selectedJobApps = this.checkedList.map(
      (app: JobApplication) => app.id
    );
    this.jobApplicationService
      .deleteMultipleJobApps(selectedJobApps)
      .subscribe((res) => {
        console.log(res);
        this.getJobApplications();
        Swal.fire({
          title: "Deleted Successfully",
        });
      });
    console.log("deleting this selection", this.checkedList);
  }
}
