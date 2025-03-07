import { Component, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { FileHandler } from "src/app/core/models/file_handle.models";
import { DomSanitizer } from "@angular/platform-browser";
import { Candidate } from "src/app/core/models/candidate.models";
import { CandidateService } from "src/app/core/services/candidate.service";
import { LoginService } from "src/app/core/services/login.service";
import { Experience } from "src/app/core/models/experience.models";
import { Education } from "src/app/core/models/education.models";
import { Certification } from "src/app/core/models/certification.models";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import skillData from "src/assets/json/skills.json";
import enums from "src/assets/json/enums.json";
import jobTitles from "src/assets/json/job-titles.json";
import countries from "src/assets/json/countries.json";
import Swal from "sweetalert2";
import { CandidateResponse } from "src/app/core/models/data-service/candidateResponse.models";

@Component({
  selector: "app-new-candidate",
  templateUrl: "./new-candidate.component.html",
  styleUrls: ["./new-candidate.component.scss"],
})
export class NewCandidateComponent implements OnInit {
  userData: any;
  selectValue = [
    "Illustrator",
    "Photoshop",
    "CSS",
    "HTML",
    "Javascript",
    "Python",
    "PHP",
  ];
  progressBarValue: number = 0;
  /**
   *
   *
   *
   *
   *
   */
  currentUser!: any;
  imagePreview: any;
  error!: any;
  candidateImage!: any;
  breadCrumbItems!: Array<{}>;
  /**
   * FormGroups Declarations
   */
  experienceForm!: FormGroup;
  educationForm!: FormGroup;
  certificationForm!: FormGroup;
  candidateForm!: FormGroup;
  skillForm!: FormGroup;
  skillSet: Array<string> = [];
  selectedSkills: Array<string> = [];
  enums: any = {};
  jobTitles: any = {};
  countries: any = {};
  typesOfDegrees: any = [];
  sourcesOfHire: any = [];
  hiringDecision: any = [];

  /**
   * Arrays Declarations ;
   */
  educationArray: Array<Education> = new Array<Education>();
  certificationArray: Array<Certification> = new Array<Certification>();
  experienceArray: Array<Experience> = new Array<Experience>();

  /** Candidate Container */
  candidateToBeSaved: Candidate = {};
  submitted: boolean = false;
  /**
   *
   *
   *
   *
   *
   */
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private sanitizer: DomSanitizer,
    private candidateService: CandidateService,
    private modalService: NgbModal,
    private loginService: LoginService
  ) {
    this.currentUser = this.loginService.currentUserValue;
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: "Candidates" },
      { label: "Create", active: true },
    ];
    this.skillSet = skillData.skills;
    this.sourcesOfHire = enums.sourcesOfHire;
    this.hiringDecision = enums.hiringDecisions;
    this.typesOfDegrees = enums.typesOfDegrees;
    this.jobTitles = jobTitles.job_titles;
    this.countries = countries;

    /**
     * Form Validation
     */
    this.candidateForm = this.formBuilder.group({
      firstName: ["", [Validators.required, Validators.minLength(3)]],
      lastName: ["", [Validators.required, Validators.minLength(3)]],
      description: ["", [Validators.maxLength(250)]],
      designation: ["", [Validators.required]],
      dateOfBirth: [new Date(), [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      phone: ["", [Validators.required, Validators.minLength(7)]],
      source: ["COLLABORATOR", [Validators.required]],
      country: ["", [Validators.minLength(3)]],
      city: ["", [Validators.minLength(3)]],
      zipCode: [""],
      skills: [""],
    });

    this.experienceForm = this.formBuilder.group({
      title: ["", [Validators.required]],
      company: ["", [Validators.required]],
      description: ["", [Validators.maxLength(250)]],
      fromDate: ["", [Validators.required]],
      toDate: ["", [Validators.required]],
    });

    this.educationForm = this.formBuilder.group({
      university: ["", [Validators.required]],
      degree: ["", [Validators.required]],
      fromDate: ["", Validators.required],
      toDate: ["", Validators.required],
    });

    this.certificationForm = this.formBuilder.group({
      name: ["", [Validators.required]],
      certDate: [new Date(), [Validators.required]],
    });

    this.skillForm = this.formBuilder.group({
      title: ["", [Validators.minLength(3), Validators.maxLength(15)]],
    });
    this.check();
  }

  check() {
    const candidateUploadedCheck: CandidateResponse = history.state;
    if (candidateUploadedCheck) {
      console.log(candidateUploadedCheck);
      this.candidateForm = this.formBuilder.group({
        firstName: [candidateUploadedCheck.name, [Validators.required]],
        lastName: [candidateUploadedCheck.name, [Validators.required]],
        designation: [candidateUploadedCheck.designation?.toString()],
        description: [candidateUploadedCheck.companies_worked_at?.toString()],
        country: [candidateUploadedCheck.countries?.toString()],
        city: [""],
        zipCode: [""],
        phone: [candidateUploadedCheck.phone],
        email: [candidateUploadedCheck.email],
        dateOfBirth: [""],
        source: ["DIRECT_CONTACT"],
        skills: [candidateUploadedCheck.skills],
        // rating: [candidateUploadedCheck.rating],

        user: [this.currentUser?.id],
      });
      if (candidateUploadedCheck.skills !== undefined) {
        this.selectedSkills = [...candidateUploadedCheck.skills];
      }
      candidateUploadedCheck.university?.forEach((education) => {
        this.educationArray.push({ university: education });
      });
    } else {
      console.log("it didnt work");
    }
  }
  deleteAllEducation() {
    this.educationArray = [];
  }
  deleteAllExperience() {
    this.experienceArray = [];
  }
  deleteAllCerts() {
    this.certificationArray = [];
  }
  addExperience() {
    this.experienceArray.push(this.experienceForm?.value);
    this.experienceForm.reset();
    console.log(this.experienceArray);
  }
  addEducation() {
    this.educationArray.push(this.educationForm?.value);
    this.educationForm.reset();
    console.log(this.educationArray);
  }
  addCertification() {
    this.certificationArray.push(this.certificationForm?.value);
    this.certificationForm.reset();
    console.log(this.certificationArray);
  }

  deleteCertification(i: number) {
    this.certificationArray.splice(i, 1);
  }
  deleteExperience(index: number) {
    this.experienceArray.splice(index, 1);
  }
  deleteEducation(i: number) {
    this.educationArray.splice(i, 1);
  }
  editExperience(exp: Experience, i: number) {
    this.experienceArray.splice(i, 1);
    this.experienceForm = this.formBuilder.group({
      title: [exp.title, [Validators.required]],
      company: [exp.company, [Validators.required]],
      description: [exp.description],
      fromDate: [exp.fromDate, [Validators.required]],
      toDate: [exp.toDate, [Validators.required]],
    });
  }
  editEducation(edu: Education, i: number) {
    this.educationArray.splice(i, 1);
    this.educationForm = this.formBuilder.group({
      university: [edu.university, [Validators.required]],
      degree: [edu.degree, [Validators.required]],
      fromDate: [edu.fromDate],
      toDate: [edu.toDate],
    });
  }
  editCertification(cert: Certification, i: number) {
    this.certificationArray.splice(i, 1);

    this.certificationForm = this.formBuilder.group({
      name: [cert.name, [Validators.required]],
      certDate: [cert.certDate, [Validators.required]],
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
    this.candidateImage = fileHandler;
    reader.onload = (e: any) => {
      this.imagePreview = e.target.result;
    };
    reader.readAsDataURL(file);
  }
  checkProgressBar() {
    if (this.experienceArray.length > 0 && this.progressBarValue <= 65) {
      this.progressBarValue += this.progressBarValue + 30;
    }
    if (this.educationArray.length > 0 && this.progressBarValue <= 65) {
      this.progressBarValue += this.progressBarValue + 39;
    }
    if (this.certificationArray.length > 0 && this.progressBarValue <= 70) {
      this.progressBarValue += this.progressBarValue + 30;
    }
  }
  saveCandidate() {
    this.checkProgressBar();
    this.candidateToBeSaved = this.candidateForm?.value;
    this.candidateToBeSaved.experiences = this.experienceArray;
    this.candidateToBeSaved.educations = this.educationArray;
    this.candidateToBeSaved.certifications = this.certificationArray;
    const candidateFormData = this.prepareFormData(this.candidateToBeSaved);

    Swal.fire({
      title: "You are about to save a Candidate ?",
      showCancelButton: true,
      confirmButtonText: "Yes, Create it!",
      cancelButtonText: "Close",
    }).then((result) => {
      if (result.value) {
        this.candidateService
          .addCandidate(candidateFormData)
          .subscribe((res) => {
            setTimeout(() => this.router.navigate(["/ems/candidates"]), 1000);
          });
      }
    });
  }

  get getCandidateForm() {
    return this.candidateForm?.controls;
  }
  get getExperienceForm() {
    return this.experienceForm?.controls;
  }
  get getEducationForm() {
    return this.educationForm?.controls;
  }
  get getCertificationForm() {
    return this.certificationForm?.controls;
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
    this.modalService.dismissAll();
  }

  prepareFormData(candidate: Candidate): FormData {
    const formData = new FormData();
    formData.append(
      "candidate",
      new Blob([JSON.stringify(candidate)], { type: "application/json" })
    );
    if (
      this.candidateImage?.file !== null &&
      this.candidateImage?.file !== undefined
    ) {
      formData.append("image", this.candidateImage.file);
    }

    if (this.currentUser != null) {
      formData.append("idUser", this.currentUser.id);
    }
    return formData;
  }
}
