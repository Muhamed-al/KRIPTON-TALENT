import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Candidate } from "src/app/core/models/candidate.models";
import { FileHandler } from "src/app/core/models/file_handle.models";
import { Job } from "src/app/core/models/job.models";
import { JobApplication } from "src/app/core/models/jobApplication.models";
import { CandidateService } from "src/app/core/services/candidate.service";
import { JobApplicationService } from "src/app/core/services/job-application.service";
import { JobService } from "src/app/core/services/job.service";
import Swal from "sweetalert2";
import skillData from "src/assets/json/skills.json";
import enums from "src/assets/json/enums.json";
import jobTitles from "src/assets/json/job-titles.json";
import countries from "src/assets/json/countries.json";
@Component({
  selector: "app-candidate-list-card",
  templateUrl: "./candidate-list-card.component.html",
  styleUrls: ["./candidate-list-card.component.scss"],
})
export class CandidateListCardComponent {
  @Input() candidate!: Candidate;
  @Input() index!: number;
  @Output() candidateEditedEvent = new EventEmitter<boolean>();
  @Output() candidateDeletedEvent = new EventEmitter<boolean>();
  listview: any;

  error!: any;
  imageUpdatePreview: any;
  candidateUpdateImage!: any;

  listOfJobApplications!: JobApplication[];
  listOfJobs!: Job[];
  masterSelected: boolean | undefined;
  checkedList!: Array<any>;
  searchBox = "";
  candidateForm!: FormGroup;
  selectValue = ["Newest", "Oldest"];
  default = "Newest";
  enums: any = {};
  jobTitles: any = {};
  countries: any = {};
  typesOfDegrees: any = [];
  sourcesOfHire: any = [];
  skillSet: Array<string> = [];
  hiringDecisions: any = [];
  recruitingStatus: any = [];
  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private jobApplicationService: JobApplicationService,
    private jobService: JobService,
    private candidateService: CandidateService,
    private sanitizer: DomSanitizer
  ) {}
  get form() {
    return this.candidateForm.controls;
  }
  ngOnInit(): void {
    this.candidateForm = this.formBuilder.group({
      firstName: ["", [Validators.required]],
      lastName: ["", [Validators.required]],
      description: ["", [Validators.maxLength(250)]],
      email: ["", [Validators.email]],
      designation: [""],
      phone: [""],
      country: [""],
      city: [""],
      decision: [""],
      status: [""],
      skills: [""],
    });
    this.skillSet = skillData.skills;
    this.sourcesOfHire = enums.sourcesOfHire;
    this.typesOfDegrees = enums.typesOfDegrees;
    this.jobTitles = jobTitles.job_titles;
    this.countries = countries;
    this.recruitingStatus = enums.recruitingStatus;
    this.hiringDecisions = enums.hiringDecisions;
  }
  openModal(content: any) {
    this.modalService.open(content, { size: "md", centered: true });
  }
  openModalLarge(content: any) {
    this.modalService.open(content, { size: "lg", centered: true });
  }
  openModalExtraLarge(content: any) {
    this.modalService.open(content, { size: "xl", centered: true });
  }

  deleteCandidate(candidate: Candidate) {
    Swal.fire({
      title: `Deleting : ${candidate?.lastName} ${candidate?.firstName} `,

      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Close",
    }).then((result) => {
      if (result.isConfirmed) {
        this.candidateService
          .deleteCandidate(candidate)
          .toPromise()
          .then(() => {
            this.candidateDeletedEvent.emit(true);
          })
          .catch((err) => {
            this.candidateDeletedEvent.emit(false);
            console.error(err);
          });
      }
    });
  }
  sendCompletionMail(candidate: Candidate) {
    if (candidate.email) {
      console.log("ooo");
      const candidates: Array<number> = [candidate.id!];
      this.candidateService
        .sendMails(candidates, "completion-mail")
        .subscribe((res) => {
          Swal.fire({ title: "Email Sent successfully !", timer: 2000 });
        });
    } else {
      Swal.fire({ title: "Candidate Email is not valid" });
    }
  }
  selectCandidateToBeEdited() {
    this.candidateForm = this.formBuilder.group({
      firstName: [this.candidate.firstName, [Validators.required]],
      lastName: [this.candidate.lastName, [Validators.required]],
      designation: [this.candidate.designation],
      description: [this.candidate.description],
      country: [this.candidate.country],
      city: [this.candidate.city],
      zipCode: [this.candidate.zipCode],
      phone: [this.candidate.phone],
      email: [this.candidate.email],
      dateOfBirth: [this.candidate.dateOfBirth],
      decision: [this.candidate.decision],
      status: [this.candidate.status],
      source: [this.candidate.source],
      skills: [this.candidate.skills],
      rating: [this.candidate.rating],
      createdAt: [this.candidate.createdAt],
      user: [this.candidate.user],
    });
  }
  saveEdit() {
    let candidate: Candidate = this.candidateForm.value;
    const candidateFormData = this.prepareUpdateFormData(candidate);
    Swal.fire({
      title: `Updating : ${candidate.firstName}`,
      showCancelButton: true,
      confirmButtonText: "Update",
      cancelButtonText: "Close",
    }).then((response) => {
      if (response.isConfirmed) {
        this.candidateService
          .updateCandidate(this.candidate.id, candidateFormData)
          .subscribe(
            () => {
              this.candidateEditedEvent.emit(true);
              this.modalService.dismissAll();
              this.candidateForm.reset();
            },
            (error) => {
              this.error = error;
              this.candidateEditedEvent.emit(false);
              console.log(error);
            }
          );
      }
    });
  }

  onImageUpdateChange(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    const fileHandler: FileHandler = {
      file: file,
      url: this.sanitizer.bypassSecurityTrustUrl(
        window.URL.createObjectURL(file)
      ),
    };
    this.candidateUpdateImage = fileHandler;
    reader.onload = (e: any) => {
      this.candidate = { ...this.candidate, imagePath: e.target.result };
    };
    reader.readAsDataURL(file);
  }

  prepareUpdateFormData(candidate: Candidate): FormData {
    const formData = new FormData();
    formData.append(
      "candidate",
      new Blob([JSON.stringify(candidate)], { type: "application/json" })
    );
    if (
      this.candidateUpdateImage !== null &&
      this.candidateUpdateImage !== undefined
    ) {
      formData.append("image", this.candidateUpdateImage.file);
    }
    return formData;
  }
  getCandidateJobApplications(candidateId: any) {
    this.jobApplicationService
      .getJobApplicationsOfCertainCandidate(candidateId)
      .subscribe((res) => {
        if (res.length) {
          this.listOfJobApplications = res;
        } else {
          Swal.fire({
            title: "No Job Applications found for this Candidate !",
          });
        }
      });
  }
  getJobsNotAssignedToCandidate() {
    this.jobService
      .getJobsThatCandidateIsNotAssignedTo(this.candidate.id)
      .subscribe((res: Job[]) => {
        console.log(res);
        this.listOfJobs = res;
      });
  }
  deleteMultipleJobs() {
    console.log("multiple jobs deleted");
  }
  assignCandidateToMultipleJobs() {
    console.log(this.candidate);
    this.jobService
      .assignJobsToCandidate(
        this.checkedList.map((job) => job.id),
        this.candidate
      )
      .subscribe((res) => {
        Swal.fire({
          title: `${this.candidate.lastName} ${this.candidate.firstName} `,
          text: `assigned successfully`,
        });
        this.modalService.dismissAll();
      });
  }
  checkUncheckAll() {
    this.listOfJobs?.forEach((element: Job) => {
      element.isSelected = this.masterSelected;
    });
    this.getCheckedItemList();
  }
  isAllSelected() {
    this.masterSelected = this.listOfJobs?.every(
      (item: any) => item.isSelected == true
    );
    this.getCheckedItemList();
  }
  getCheckedItemList() {
    let list = [];
    for (let i = 0; i < this.listOfJobs?.length; i++) {
      if (this.listOfJobs[i].isSelected) {
        list.push(this.listOfJobs[i]);
      }
      this.checkedList = list;
    }
  }
  deleteJobApplication(jobApp: JobApplication) {
    console.log("deleting job app");
    this.jobApplicationService
      .deleteJobApplication(jobApp.id)
      .subscribe((res) => {
        this.getCandidateJobApplications(this.candidate?.id);
        Swal.fire({
          title: "Deleted Successfully ! ",
          icon: "success",
        });
        this.modalService.dismissAll();
      });
  }
}
