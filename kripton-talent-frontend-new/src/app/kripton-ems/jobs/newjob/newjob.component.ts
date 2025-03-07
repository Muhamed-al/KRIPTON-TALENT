import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { JobService } from "../../../core/services/job.service";
import { retryWhen, delay, take } from "rxjs/operators";
import {
  UntypedFormBuilder,
  Validators,
  FormBuilder,
  FormGroup,
  UntypedFormGroup,
  UntypedFormArray,
  AbstractControl,
} from "@angular/forms";
import Swal from "sweetalert2";
import { Job } from "../../../core/models/job.models";
import { Candidate } from "src/app/core/models/candidate.models";
import { CandidateService } from "../../../core/services/candidate.service";
import { DomSanitizer } from "@angular/platform-browser";
import { FileHandler } from "src/app/core/models/file_handle.models";
import skillData from "src/assets/json/skills.json";
import enums from "src/assets/json/enums.json";
import jobTitles from "src/assets/json/job-titles.json";
import countries from "src/assets/json/countries.json";
import { ActivatedRoute, Route, Router } from "@angular/router";
import { LoginService } from "src/app/core/services/login.service";
@Component({
  selector: "app-newjob",
  templateUrl: "./newjob.component.html",
  styleUrls: ["./newjob.component.scss"],
})
export class NewjobComponent implements OnInit {
  // bread crumb items
  breadCrumbItems!: Array<{}>;
  tags: any;
  currentUser!: any;
  // Form
  itemData!: UntypedFormGroup;
  submitted = false;
  imagePreview: any;
  jobImage: any;
  jobForm!: FormGroup;
  skillForm!: FormGroup;
  skillSet: Array<string> = [];
  selectedSkills: Array<string> = [];
  enums: any = {};
  jobTitles: any = {};
  countries: any = {};
  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private jobService: JobService,
    private loginService: LoginService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {
    this.currentUser = this.loginService.currentUserValue;
  }

  ngOnInit(): void {
    /**
     * BreadCrumb
     */
    this.breadCrumbItems = [
      { label: "Jobs" },
      { label: "New Job", active: true },
    ];
    this.skillSet = skillData.skills;
    this.enums = enums;
    this.jobTitles = jobTitles.job_titles;
    this.countries = countries;
    // Validation
    this.jobForm = this.formBuilder.group({
      title: ["", [Validators.required]],
      description: ["", [Validators.required]],
      company: ["", [Validators.required]],
      location: ["", [Validators.required]],
      employmentType: ["", [Validators.required]],
      experienceLevel: ["", [Validators.required]],
      proposedSalary: ["", [Validators.required]],
      startDate: [new Date(), [Validators.required]],
      status: ["", [Validators.required]],
      createdAt: [""],
      image: [""],
      requiredSkills: [""],
    });
    this.skillForm = this.formBuilder.group({
      title: ["", [Validators.minLength(3), Validators.maxLength(15)]],
    });
  }
  get form() {
    return this.jobForm.controls;
  }
  openSkillModal(content: any) {
    this.modalService.open(content, { centered: true });
  }
  saveSkill() {
    let skill = this.skillForm.value;
    if (
      !this.skillSet
        .map((s) => s.toLowerCase())
        .includes(skill.title.toLowerCase())
    ) {
      this.skillSet.push(skill.title);
      this.selectedSkills = [...this.selectedSkills, skill.title];
    } else {
      Swal.fire({
        title: "skill already there !",
      });
    }
    this.skillForm.reset();
  }
  saveJob() {
    let job: Job = this.jobForm.value;
    const jobFormData = this.prepareFormData(job);
    console.log(job);

    Swal.fire({
      title: `Save ${job.title} ?`,
      icon: "success",
      showCancelButton: true,
      confirmButtonText: "Yes, Save it!",
      cancelButtonText: "Close",
    })
      .then((result) => {
        if (result.isConfirmed) {
          this.jobService.addJob(jobFormData).subscribe(
            (data) => {
              if (data) {
                Swal.fire(`Job ${job.title} has been added !`)
                  .then(() => {
                    this.modalService.dismissAll();
                    this.jobForm.reset();
                    this.router.navigateByUrl("/ems/jobs").catch((error) => {
                      console.log(error);
                    });
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              }
            },
            (error) => {
              console.log(error);
            }
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  onImageChange(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    const fileHandler: FileHandler = {
      file: file,
      url: this.sanitizer.bypassSecurityTrustUrl(
        window.URL.createObjectURL(file)
      ),
    };
    this.jobImage = fileHandler;
    reader.onload = (e: any) => {
      this.imagePreview = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  prepareFormData(job: Job): FormData {
    const formData = new FormData();
    formData.append(
      "job",
      new Blob([JSON.stringify(job)], { type: "application/json" })
    );
    formData.append("user", this.currentUser.id);
    if (this.jobImage?.file != null) {
      formData.append("image", this.jobImage.file);
    }
    return formData;
  }
}
