import { DecimalPipe } from "@angular/common";
import { Component, OnInit, OnChanges, SimpleChanges } from "@angular/core";

import { Job } from "src/app/core/models/job.models";
import { JobService } from "src/app/core/services/job.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-landing",
  templateUrl: "./landing.component.html",
  styleUrls: ["./landing.component.scss"],
  providers: [DecimalPipe],
})
export class LandingComponent implements OnInit {
  breadCrumbItems!: Array<{}>;
  searchTerm!: string;
  listViewSelected: boolean;
  selectedJob!: any;
  sortBySelect: string = "createdAt";
  listOfJobs!: Job[];
  constructor(private jobService: JobService) {
    this.listViewSelected = true;
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: "Jobs" }];
    this.getJobs(this.sortBySelect);
  }

  toggleView() {
    this.listViewSelected = !this.listViewSelected;
  }
  updateSelected($event: Job) {
    this.selectedJob = $event;
  }
  sortChanged() {
    this.getJobs(this.sortBySelect);
  }
  searchChanged() {
    console.log("search changing");
    if (this.searchTerm !== "" && this.searchTerm !== undefined) {
      this.listOfJobs = this.listOfJobs.filter((job) => {
        return (
          job.title?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          job.company?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          job.description?.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      });
    } else {
      this.getJobs(this.sortBySelect);
    }
  }

  getJobs(sort: any) {
    this.jobService.getJobs(sort).subscribe((data) => {
      this.listOfJobs = data;
    });
  }
}
