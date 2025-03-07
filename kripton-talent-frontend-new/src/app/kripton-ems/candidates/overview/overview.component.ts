import { Component, OnInit } from "@angular/core";
import { Candidate } from "src/app/core/models/candidate.models";
import { ActivatedRoute } from "@angular/router";
import { CandidateService } from "src/app/core/services/candidate.service";

@Component({
  selector: "app-overview",
  templateUrl: "./overview.component.html",
  styleUrls: ["./overview.component.scss"],
})
export class OverviewComponent implements OnInit {
  candidateDetail!: Candidate;
  breadCrumbItems!: Array<{}>;

  constructor(
    private route: ActivatedRoute,
    private candidateService: CandidateService
  ) {}
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get("id");
    if (id != null) {
      this.getCandidateDetail(id);
    }
    this.breadCrumbItems = [{ label: "Candidate Overview" }];
  }

  getCandidateDetail(id: string) {
    this.candidateService.getCandidate(parseInt(id)).subscribe((res) => {
      this.candidateDetail = res;
    });
  }

  generatePdf(id: any) {
    this.candidateService.printResume(id).subscribe((encodedString: string) => {
      this.openPdfInNewTab(encodedString);
    });
  }

  private openPdfInNewTab(base64String: string) {
    const binaryString = window.atob(base64String);
    const binaryLen = binaryString.length;
    const bytes = new Uint8Array(binaryLen);
    for (let i = 0; i < binaryLen; i++) {
      const ascii = binaryString.charCodeAt(i);
      bytes[i] = ascii;
    }
    const blob = new Blob([bytes], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    window.open(url, "_blank");
  }
}
