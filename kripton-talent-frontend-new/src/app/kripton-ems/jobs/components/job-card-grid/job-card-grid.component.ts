import { Component, EventEmitter, Input, Output, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FileHandler } from "src/app/core/models/file_handle.models";
import { Job } from "src/app/core/models/job.models";
import { JobService } from "src/app/core/services/job.service";
import Swal from "sweetalert2";
import skillData from "src/assets/json/skills.json";
import enums from "src/assets/json/enums.json";
import jobTitles from "src/assets/json/job-titles.json";
import countries from "src/assets/json/countries.json";
import { Candidate } from "src/app/core/models/candidate.models";
import { CandidateService } from "src/app/core/services/candidate.service";
@Component({
  selector: "app-job-card-grid",
  templateUrl: "./job-card-grid.component.html",
  styleUrls: ["./job-card-grid.component.scss"],
})
export class JobCardGridComponent implements OnInit {
  @Input()
  job!: Job;
  @Output() jobEditedEvent = new EventEmitter<boolean>();
  @Output() jobDeletedEvent = new EventEmitter<boolean>();
  @Output() selectJobEvent = new EventEmitter<Job>();
  masterSelected: boolean | undefined;
  checkedList!: Array<any>;
  imageUpdatePreview: any;
  jobUpdateImage: any;
  jobToBeUpdated!: Job;
  jobForm!: FormGroup;
  error = "";
  listOfCandidates!: Array<Candidate>;
  employmentTypeValues!: [any];
  experienceLevelValues!: [any];
  statusValues!: [any];
  skillSet: Array<string> = [];
  selectedSkills: Array<string> = [];
  enums: any = {};
  jobTitles: any = {};
  countries: any = {};
  skillForm!: FormGroup;
  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private jobService: JobService,
    private sanitizer: DomSanitizer,
    private candidatesService: CandidateService
  ) {}

  ngOnInit(): void {
    this.skillSet = skillData.skills;
    this.enums = enums;
    this.jobTitles = jobTitles.job_titles;
    this.countries = countries;
    this.employmentTypeValues = enums.jobEmploymentTypes;
    this.statusValues = enums.currentJobStatus;
    this.experienceLevelValues = enums.requiredJobExperienceLevel;
    this.jobForm = this.formBuilder.group({
      title: [this.job.title, [Validators.required]],
      description: [this.job.description, [Validators.required]],
      company: [this.job.company, [Validators.required]],
      location: [this.job.location, [Validators.required]],
      imagePath: [this.job.imagePath],
      employmentType: [this.job.employmentType, [Validators.required]],
      experienceLevel: [this.job.experienceLevel, [Validators.required]],
      proposedSalary: [this.job.proposedSalary, [Validators.required]],
      startDate: [this.job.startDate, [Validators.required]],
      status: [this.job.status, [Validators.required]],
      createdAt: [this.job.createdAt],
      requiredSkills: [""],
    });
    this.skillForm = this.formBuilder.group({
      title: ["", [Validators.minLength(3), Validators.maxLength(15)]],
    });
  }
  isAllSelected() {
    this.masterSelected = this.listOfCandidates?.every(
      (item: any) => item.isSelected == true
    );
    this.getCheckedItemList();
  }
  getCheckedItemList() {
    let list = [];
    for (let i = 0; i < this.listOfCandidates?.length; i++) {
      if (this.listOfCandidates[i].isSelected) {
        list.push(this.listOfCandidates[i]);
      }
      this.checkedList = list;
    }
  }
  checkUncheckAll() {
    this.listOfCandidates?.forEach((element: Candidate) => {
      element.isSelected = this.masterSelected;
    });
    this.getCheckedItemList();
  }
  deleteMultipleCandidates() {}
  assignMultipleCandidatesToJob() {
    this.jobService
      .assignCandidatesToJob(this.checkedList, this.job)
      .subscribe(() => {
        Swal.fire({
          icon: "success",
          title: "Candidates assigned successfully !",
          showConfirmButton: true,
        }).then((res) => {
          if (res) {
            this.modalService.dismissAll();
          }
        });
      });
  }
  openModal(content: any) {
    this.modalService.open(content, { size: "lg", centered: true });
  }
  openModalExtraLarge(content: any) {
    this.modalService.open(content, { size: "xl", centered: true });
  }
  get form() {
    return this.jobForm.controls;
  }
  getAssignedCandidatesToThisJob() {
    this.jobService.getAssignedCandidatesOfJob(this.job.id).subscribe((res) => {
      console.log(res);
      this.job = { ...this.job, assignedCandidates: res };
    });
  }
  getCandidates() {
    this.candidatesService.getCandidates(null).subscribe((candidates) => {
      this.listOfCandidates = candidates;
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
    this.jobUpdateImage = fileHandler;
    reader.onload = (e: any) => {
      this.job = { ...this.job, imagePath: e.target.result };
    };
    reader.readAsDataURL(file);
  }

  updateJob() {
    let job: Job = this.jobForm.value;
    const jobFormData = this.prepareUpdateFormData(job);
    Swal.fire({
      title: `Updating : ${job.title}`,
      text: "Confirm !",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Close",
    }).then((result) => {
      if (result.isConfirmed) {
        this.jobService.updateJob(jobFormData, this.job?.id).subscribe(
          (data) => {
            console.log(data);
            this.jobEditedEvent.emit(true);
            this.modalService.dismissAll();
            this.jobForm.reset();
          },
          (error) => {
            this.jobEditedEvent.emit(false);
            this.error = error;
            console.log(error);
          }
        );
      }
    });
  }
  deleteJob(job: Job) {
    Swal.fire({
      title: `Deleting ${job.title}`,
      text: "Confirm !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        this.jobService.deleteJob(job?.id).subscribe(
          (data) => {
            this.jobDeletedEvent.emit(true);
          },
          (error) => {
            this.jobDeletedEvent.emit(false);
            this.error = error;
            console.log(error);
          }
        );
      }
    });
  }
  selectJob() {
    this.selectJobEvent.emit(this.job);
  }
  prepareUpdateFormData(job: Job): FormData {
    const formData = new FormData();
    formData.append(
      "job",
      new Blob([JSON.stringify(job)], { type: "application/json" })
    );
    if (this.jobUpdateImage !== null && this.jobUpdateImage !== undefined) {
      formData.append("image", this.jobUpdateImage.file);
    }
    return formData;
  }
}
