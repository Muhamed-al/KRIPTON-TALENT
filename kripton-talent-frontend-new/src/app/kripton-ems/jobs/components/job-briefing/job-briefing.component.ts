import { Component, Input, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Candidate } from "src/app/core/models/candidate.models";
import { CandidateService } from "src/app/core/services/candidate.service";
import { JobService } from "src/app/core/services/job.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-job-briefing",
  templateUrl: "./job-briefing.component.html",
  styleUrls: ["./job-briefing.component.scss"],
})
export class JobBriefingComponent implements OnInit {
  @Input() job: any;
  portfolioChart: any;
  masterSelected: boolean | undefined;
  checkedList!: Array<any>;
  listOfCandidates!: Array<Candidate>;

  ngOnInit(): void {
    this._portfolioChart('["--vz-secondary", "--vz-success", "--vz-danger"]');
  }

  private _portfolioChart(colors: any) {
    colors = this.getChartColorsArray(colors);
    this.portfolioChart = {
      series: [98, 63, 35],
      labels: ["New Application", "Approved", "Rejected"],
      chart: {
        type: "donut",
        height: 300,
      },
      legend: {
        position: "bottom",
      },
      dataLabels: {
        dropShadow: {
          enabled: false,
        },
      },
      colors: colors,
    };
  }
  private getChartColorsArray(colors: any) {
    colors = JSON.parse(colors);
    return colors.map(function (value: any) {
      var newValue = value.replace(" ", "");
      if (newValue.indexOf(",") === -1) {
        var color = getComputedStyle(document.documentElement).getPropertyValue(
          newValue
        );
        if (color) {
          color = color.replace(" ", "");
          return color;
        } else return newValue;
      } else {
        var val = value.split(",");
        if (val.length == 2) {
          var rgbaColor = getComputedStyle(
            document.documentElement
          ).getPropertyValue(val[0]);
          rgbaColor = "rgba(" + rgbaColor + "," + val[1] + ")";
          return rgbaColor;
        } else {
          return newValue;
        }
      }
    });
  }
  constructor(
    private jobService: JobService,
    private modalService: NgbModal,
    private candidatesService: CandidateService
  ) {}

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
  deleteMultipleJobs() {
    console.log(this.checkedList);
  }
  getCandidates() {
    this.candidatesService.getCandidates(null).subscribe((candidates) => {
      this.listOfCandidates = candidates;
    });
  }
  deleteMultipleCandidates() {}

  openModalExtraLarge(content: any) {
    this.modalService.open(content, { size: "xl", centered: true });
  }
}
