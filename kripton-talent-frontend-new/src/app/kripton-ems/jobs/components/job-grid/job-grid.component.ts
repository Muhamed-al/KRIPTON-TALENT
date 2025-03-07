import { DecimalPipe } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Job } from "src/app/core/models/job.models";
import { JobService } from "src/app/core/services/job.service";

@Component({
  selector: "app-job-grid",
  templateUrl: "./job-grid.component.html",
  styleUrls: ["./job-grid.component.scss"],
  providers: [DecimalPipe],
})
export class JobGridComponent implements OnInit {
  @Output() updateListEvent = new EventEmitter<any>();
  @Input() listOfJobs!: Job[];
  pageSize: number = 6;
  page: number = 1;
  checkedList!: Array<any>;
  submitted = false;
  selectedJob!: Job;
  masterSelected: boolean | undefined;

  constructor(private jobService: JobService) {}
  ngOnInit(): void {}

  selectJob($event: any) {
    this.selectedJob = $event;

    this.jobService.getAssignedCandidatesOfJob($event?.id).subscribe((res) => {
      console.log(res);
      this.selectedJob = { ...this.selectedJob, assignedCandidates: res };
    });
  }

  updateListJobs(event: any) {
    if (event) {
      this.updateListEvent.emit(true);
    }
  }
}
