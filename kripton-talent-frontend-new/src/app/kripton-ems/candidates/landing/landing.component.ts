import { DecimalPipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { CandidateService } from "../../../core/services/candidate.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import { CandidateResponse } from "src/app/core/models/data-service/candidateResponse.models";
import { FileHandler } from "src/app/core/models/file_handle.models";
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { LoginService } from "src/app/core/services/login.service";
import { Candidate } from "src/app/core/models/candidate.models";

@Component({
  selector: "app-landing",
  templateUrl: "./landing.component.html",
  styleUrls: ["./landing.component.scss"],
  providers: [DecimalPipe],
})
export class LandingComponent implements OnInit {
  searchTerm: string = "";
  sortBySelect: string = "createdAt";
  breadCrumbItems!: Array<{}>;
  candidateList!: Array<any>;
  listViewSelected: boolean;
  candidatesCsv: any;
  candidateResume!: any;
  currentUser!: any;
  submitted: boolean = false;
  constructor(
    private candidateService: CandidateService,
    private modalService: NgbModal,
    private loginService: LoginService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {
    this.listViewSelected = true;
    this.currentUser = this.loginService.currentUserValue;
  }
  ngOnInit(): void {
    this.breadCrumbItems = [{ label: "Candidates" }];
    this.getCandidates(this.sortBySelect);
  }
  openModal(content: any) {
    this.modalService.open(content, { size: "md", centered: true });
  }
  toggleView() {
    this.listViewSelected = !this.listViewSelected;
  }

  uploadBatch() {
    const formData = new FormData();
    formData.append("file", this.candidatesCsv.file);
    formData.append("userId", this.currentUser.id);
    let fieldNames: string =
      "firstName,lastName,email,phone,country,designation";
    formData.append("fieldNames", fieldNames);
    this.candidateService.uploadBatch(formData).subscribe((res: any) => {
      const response: string = res.message;

      if (response.startsWith("success")) {
        this.modalService.dismissAll();
        this.getCandidates(this.sortBySelect);
      }
    });
  }
  uploadResume() {
    this.submitted = true;
    const formData = new FormData();
    formData.append("file", this.candidateResume.file);
    this.candidateService.uploadCandidateResume(formData).subscribe(
      (res: CandidateResponse) => {
        const candidate: CandidateResponse = res;
        this.submitted = false;
        this.modalService.dismissAll();
        Swal.fire({
          title: "Uploaded Successfully",
        }).then(() => {
          this.router.navigateByUrl("/ems/candidates/create-candidate", {
            state: candidate,
          });
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }
  onCsvFileChange(event: any) {
    const file = event.target.files[0];
    const fileHandler: FileHandler = {
      file: file,
      url: this.sanitizer.bypassSecurityTrustUrl(
        window.URL.createObjectURL(file)
      ),
    };
    this.candidatesCsv = fileHandler;
    console.log("file changed");
  }
  onUploadResumeChange(event: any) {
    const file = event.target.files[0];
    const fileHandler: FileHandler = {
      file: file,
      url: this.sanitizer.bypassSecurityTrustHtml(
        window.URL.createObjectURL(file)
      ),
    };
    this.candidateResume = fileHandler;
    console.log("Resume changed");
  }
  searchForCandidates() {
    if (this.searchTerm !== "" && this.searchTerm !== undefined) {
      this.candidateList = this.candidateList.filter((candidate: Candidate) => {
        return (
          candidate.firstName
            ?.toLowerCase()
            .includes(this.searchTerm.toLowerCase()) ||
          candidate.lastName
            ?.toLowerCase()
            .includes(this.searchTerm.toLowerCase()) ||
          candidate.designation
            ?.toLowerCase()
            .includes(this.searchTerm.toLowerCase()) ||
          candidate.country
            ?.toLowerCase()
            .includes(this.searchTerm.toLowerCase()) ||
          candidate.description
            ?.toLowerCase()
            .includes(this.searchTerm.toLowerCase())
        );
      });
    } else {
      this.getCandidates(this.sortBySelect);
    }
  }
  sortChanged() {
    console.log("sort changed");
    this.getCandidates(this.sortBySelect);
  }
  getCandidates(sort: string) {
    this.candidateService.getCandidates(sort).subscribe((data) => {
      this.candidateList = data;
    });
  }
}
