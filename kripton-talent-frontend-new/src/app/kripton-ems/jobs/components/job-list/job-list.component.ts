import { DecimalPipe } from "@angular/common";
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { delay, retryWhen, take } from "rxjs";
import { Job } from "src/app/core/models/job.models";
import { JobService } from "src/app/core/services/job.service";

@Component({
  selector: "app-job-list",
  templateUrl: "./job-list.component.html",
  styleUrls: ["./job-list.component.scss"],
  providers: [DecimalPipe],
})
export class JobListComponent implements OnInit {
  @Output() selectJobToBeViewed = new EventEmitter<Job>();
  @Output() updateListEvent = new EventEmitter<any>();
  @Input() listOfJobs!: Job[];

  pageSize: number = 3;
  page: number = 1;
  checkedList!: Array<any>;
  submitted = false;
  selectedJob!: Job;
  masterSelected: boolean | undefined;
  constructor() {}

  ngOnInit(): void {}

  selectJob($event: any) {
    this.selectedJob = $event;
    this.selectJobToBeViewed.emit($event);
  }
  // isAllSelected() {
  //   this.masterSelected = this.jobList?.every(
  //     (item: any) => item.isSelected == true
  //   );
  //   this.getCheckedItemList();
  // }
  // getCheckedItemList() {
  //   let list = [];
  //   for (let i = 0; i < this.jobList?.length; i++) {
  //     if (this.jobList[i].isSelected) {
  //       list.push(this.jobList[i]);
  //     }
  //     this.checkedList = list;
  //   }
  // }
  // checkUncheckAll() {
  //   this.jobList?.forEach((element: Job) => {
  //     element.isSelected = this.masterSelected;
  //   });
  //   this.getCheckedItemList();
  // }

  updateListJobs(event: any) {
    if (event) {
      this.updateListEvent.emit(true);
    }
  }
}
