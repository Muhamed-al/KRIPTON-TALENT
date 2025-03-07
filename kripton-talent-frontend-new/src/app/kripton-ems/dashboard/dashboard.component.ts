import { Component, OnInit } from "@angular/core";
// Date Format
import { DecimalPipe } from "@angular/common";

import { Candidate } from "src/app/core/models/candidate.models";
import { Job } from "src/app/core/models/job.models";
import { JobService } from "src/app/core/services/job.service";
import { CandidateService } from "../../core/services/candidate.service";
import Swal from "sweetalert2";
@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
  providers: [DecimalPipe],
})
export class DashboardComponent implements OnInit {
  // bread crumb items
  breadCrumbItems!: Array<{}>;
  candidatelist!: Candidate[];
  jobList!: Array<Job>;
  searchCandidateTerm: string = "";
  candidatedetail: any;
  candidateStats: any;
  jobStats: any;
  newApplicationsList: any;
  recomendedjobs: any;

  /**
   *
   */
  closedJobsChart: any;
  openJobsChart: any = {};
  partTimeJobsChart: any;
  interviewChart: any;
  freelanceJobsChart: any;
  dashedLineChart: any;
  HiredChart: any;
  ApplicationChart: any;
  InterviewedChart: any;
  RejectedChart: any;
  VisitorChart: any;
  simpleDonutChart: any;
  DealTypeChart: any;
  splineAreaChart: any;
  hiredChart: any;
  // Polar Chart
  polarChart1!: any;
  polarChart2!: any;
  constructor(
    public jobService: JobService,
    private candidateService: CandidateService
  ) {
    // Chart Color Data Get Function
    this._hiredChart('["--vz-primary" , "--vz-transparent"]');
    this._applicationChart('["--vz-primary" , "--vz-transparent"]');
    this._interviewChart('["--vz-primary" , "--vz-transparent"]');
    this._rejectedChart('["--vz-danger", "--vz-transparent"]');
    this._visitorChart(
      '["--vz-primary", "--vz-danger", "--vz-secondary", "--vz-success","--vz-warning", "--vz-success"]'
    );
    this._simpleDonutChart('["--vz-secondary", "--vz-danger", "--vz-primary"]');
    this._DealTypeChart('["--vz-primary", "--vz-secondary"]');
  }
  ngOnInit(): void {
    this.breadCrumbItems = [{ label: "Dashboard", active: true }];
    this.getCandidates();
    this.getJobs();

    this.jobService.getStats().subscribe((res) => {
      this.jobStats = res;
      console.log(res);
      const openJobsData =
        (this.jobStats.openJobs / this.jobStats.allJobs) * 100;
      const closedJobsData =
        (this.jobStats.closedJobs / this.jobStats.allJobs) * 100;
      const partTimeJobsData =
        (this.jobStats.partTimeJobs / this.jobStats.allJobs) * 100;
      const temporaryJobs =
        (this.jobStats.temporaryJobs / this.jobStats.allJobs) * 100;
      const experienceData: any = {
        senior: this.jobStats.seniorJobs,
        junior: this.jobStats.midJobs,
        no_exp: this.jobStats.entryJobs,
      };

      this._closedJobsChart('["--vz-primary"]', closedJobsData);
      this._openJobsChart('["--vz-primary"]', openJobsData);
      this._partTimeJobsChart('["--vz-primary"]', partTimeJobsData);

      this._freelanceJobsChart('["--vz-danger"]', temporaryJobs);
      this._dashedLineChart('["--vz-secondary", "--vz-info", "--vz-primary"]');
      this._polarChart1(
        '["--vz-danger", "--vz-info",  "--vz-warning"]',
        experienceData
      );
    });

    this.candidateService.getStats().subscribe((res) => {
      this.candidateStats = res;
      const candidatesData: any = {
        hired: this.candidateStats.decisionHired,
        not_hired: this.candidateStats.decisionNotHired,
        pending: this.candidateStats.decisionPending,
        placed: this.candidateStats.decisionPlaced,
        wait_list: this.candidateStats.decisionWaitList,
      };
      this._polarChart2(
        '["--vz-primary", "--vz-info",  "--vz-success","--vz-warning","--vz-secondary"]',
        candidatesData
      );
    });
  }

  /**
   * Polar Chart
   */
  private _polarChart1(colors: any, data: any) {
    colors = this.getChartColorsArray(colors);
    this.polarChart1 = {
      labels: [
        "Jobs for seniors",
        "Jobs for juniors",
        "Jobs with no experience",
      ],
      datasets: [
        {
          data: [data?.senior, data?.junior, data?.no_exp],

          label: "Required Experience", // for legend
          hoverBorderColor: "#fff",
        },
      ],
      options: {
        maintainAspectRatio: false,

        legend: {
          position: "bottom",
          showForNullSeries: true,
          showForZeroSeries: true,
        },
      },
    };
  }
  private _polarChart2(colors: any, data: any) {
    colors = this.getChartColorsArray(colors);
    this.polarChart2 = {
      labels: [
        "Rejected Candidates",
        "Hired Candidates",
        "Pending Candidates",
        "Wait List",
        "Placed Candidates",
      ],
      datasets: [
        {
          data: [
            data?.not_hired,
            data?.hired,
            data?.pending,
            data?.wait_list,
            data?.placed,
          ],

          label: "Candidates Summary", // for legend
          hoverBorderColor: "#fff",
        },
      ],
      options: {
        maintainAspectRatio: false,
        legend: {
          position: "bottom",
          showForNullSeries: true,
          showForZeroSeries: true,
        },
      },
    };
  }
  /**
   * TOTAL JOBS Chart
   */
  private _closedJobsChart(colors: any, data: any) {
    colors = this.getChartColorsArray(colors);

    this.closedJobsChart = {
      series: [Math.round(data)],
      chart: {
        type: "radialBar",
        width: 105,
        sparkline: {
          enabled: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      plotOptions: {
        radialBar: {
          hollow: {
            margin: 0,
            size: "70%",
          },
          track: {
            margin: 1,
          },
          dataLabels: {
            show: true,
            name: {
              show: false,
            },
            value: {
              show: true,
              fontSize: "16px",
              fontWeight: 600,
              offsetY: 8,
            },
          },
        },
      },
      colors: colors,
    };
  }

  //  apply jobs Charts
  private _openJobsChart(colors: any, data: any) {
    colors = this.getChartColorsArray(colors);
    this.openJobsChart = {
      series: [Math.round(data)],
      chart: {
        type: "radialBar",
        width: 105,
        sparkline: {
          enabled: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      plotOptions: {
        radialBar: {
          hollow: {
            margin: 0,
            size: "70%",
          },
          track: {
            margin: 1,
          },
          dataLabels: {
            show: true,
            name: {
              show: false,
            },
            value: {
              show: true,
              fontSize: "16px",
              fontWeight: 600,
              offsetY: 8,
            },
          },
        },
      },
      colors: colors,
    };
  }

  //  new jobs Charts
  private _partTimeJobsChart(colors: any, data: any) {
    colors = this.getChartColorsArray(colors);
    this.partTimeJobsChart = {
      series: [Math.round(data)],
      chart: {
        type: "radialBar",
        width: 105,
        sparkline: {
          enabled: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      plotOptions: {
        radialBar: {
          hollow: {
            margin: 0,
            size: "70%",
          },
          track: {
            margin: 1,
          },
          dataLabels: {
            show: true,
            name: {
              show: false,
            },
            value: {
              show: true,
              fontSize: "16px",
              fontWeight: 600,
              offsetY: 8,
            },
          },
        },
      },
      colors: colors,
    };
  }

  //  Rejected Chart
  private _freelanceJobsChart(colors: any, data: any) {
    colors = this.getChartColorsArray(colors);
    this.freelanceJobsChart = {
      series: [Math.round(data)],
      chart: {
        type: "radialBar",
        width: 105,
        sparkline: {
          enabled: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      plotOptions: {
        radialBar: {
          hollow: {
            margin: 0,
            size: "70%",
          },
          track: {
            margin: 1,
          },
          dataLabels: {
            show: true,
            name: {
              show: false,
            },
            value: {
              show: true,
              fontSize: "16px",
              fontWeight: 600,
              offsetY: 8,
            },
          },
        },
      },
      colors: colors,
    };
  }

  //  Dashed line chart

  private _dashedLineChart(colors: any) {
    colors = this.getChartColorsArray(colors);
    this.dashedLineChart = {
      chart: {
        height: 345,
        type: "line",
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      colors: colors,
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: [3, 4, 3],
        curve: "straight",
        dashArray: [0, 8, 5],
      },
      series: [
        {
          name: "New Application",
          data: [89, 56, 74, 98, 72, 38, 64, 46, 84, 58, 46, 49],
        },
        {
          name: "Interview",
          data: [45, 52, 38, 24, 33, 26, 21, 20, 6, 8, 15, 10],
        },
        {
          name: " Hired",
          data: [36, 42, 60, 42, 13, 18, 29, 37, 36, 51, 32, 35],
        },
      ],
      markers: {
        size: 0,

        hover: {
          sizeOffset: 6,
        },
      },
      xaxis: {
        categories: [
          "01 Jan",
          "02 Jan",
          "03 Jan",
          "04 Jan",
          "05 Jan",
          "06 Jan",
          "07 Jan",
          "08 Jan",
          "09 Jan",
          "10 Jan",
          "11 Jan",
          "12 Jan",
        ],
      },
      grid: {
        borderColor: "#f1f1f1",
      },
    };
  }
  // open candidate detail
  opendetail(candidate: Candidate) {
    this.candidatedetail = candidate;
  }

  sendCompletionMail(candidate: Candidate) {
    if (candidate.email) {
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

  getCandidates() {
    this.candidateService
      .getCandidates("createdAt")
      .subscribe((res: Array<Candidate>) => {
        this.candidatelist = res;
        this.candidatedetail = res[0];
      });
  }
  getJobs() {
    this.jobService
      .getJobs({ sortByAttribute: "createdAt" })
      .subscribe((res) => {
        this.jobList = res;
      });
  }
  searchForCandidate() {
    if (this.searchCandidateTerm !== "") {
      this.candidatelist = this.candidatelist.filter(
        (candidate) =>
          candidate.firstName
            ?.toLowerCase()
            ?.includes(this.searchCandidateTerm.toLowerCase()) ||
          candidate.lastName
            ?.toLowerCase()
            ?.includes(this.searchCandidateTerm.toLowerCase()) ||
          candidate.email
            ?.toLowerCase()
            .includes(this.searchCandidateTerm.toLowerCase()) ||
          candidate.designation
            ?.toLowerCase()
            .includes(this.searchCandidateTerm.toLowerCase())
      );
    } else {
      this.getCandidates();
    }
  }
  // Chart Colors Set
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

  /**
   * Application Chart
   */
  private _applicationChart(colors: any) {
    colors = this.getChartColorsArray(colors);
    this.ApplicationChart = {
      series: [
        {
          name: "Results",
          data: [0, 110, 95, 75, 120],
        },
      ],
      chart: {
        width: 140,
        type: "area",
        sparkline: {
          enabled: true,
        },
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        width: 1.5,
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          inverseColors: false,
          opacityFrom: 0.45,
          opacityTo: 0.05,
          stops: [50, 100, 100, 100],
        },
      },
      colors: colors,
    };
  }

  /**
   * Interviewed Chart
   */
  private _interviewChart(colors: any) {
    colors = this.getChartColorsArray(colors);
    this.InterviewedChart = {
      series: [
        {
          name: "Results",
          data: [0, 68, 35, 90, 99],
        },
      ],
      chart: {
        width: 140,
        type: "area",
        sparkline: {
          enabled: true,
        },
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        width: 1.5,
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          inverseColors: false,
          opacityFrom: 0.45,
          opacityTo: 0.05,
          stops: [50, 100, 100, 100],
        },
      },
      colors: colors,
    };
  }

  /**
   * Hired Chart
   */
  private _hiredChart(colors: any) {
    colors = this.getChartColorsArray(colors);
    this.HiredChart = {
      series: [
        {
          name: "Results",
          data: [0, 36, 110, 95, 130],
        },
      ],
      chart: {
        width: 140,
        type: "area",
        sparkline: {
          enabled: true,
        },
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        width: 1.5,
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          inverseColors: false,
          opacityFrom: 0.45,
          opacityTo: 0.05,
          stops: [50, 100, 100, 100],
        },
      },
      colors: colors,
    };
  }

  /**
   * Rejected Chart
   */
  private _rejectedChart(colors: any) {
    colors = this.getChartColorsArray(colors);
    this.RejectedChart = {
      series: [
        {
          name: "Results",
          data: [0, 98, 85, 90, 67],
        },
      ],
      chart: {
        width: 140,
        type: "area",
        sparkline: {
          enabled: true,
        },
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        width: 1.5,
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          inverseColors: false,
          opacityFrom: 0.45,
          opacityTo: 0.05,
          stops: [50, 100, 100, 100],
        },
      },
      colors: colors,
    };
  }

  /**
   * Distributed Treemap Chart
   */
  private _visitorChart(colors: any) {
    colors = this.getChartColorsArray(colors);
    this.VisitorChart = {
      series: [
        {
          data: [
            {
              x: "USA",
              y: 321,
            },
            {
              x: "Russia",
              y: 165,
            },
            {
              x: "India",
              y: 184,
            },
            {
              x: "China",
              y: 98,
            },
            {
              x: "Canada",
              y: 84,
            },
            {
              x: "Brazil",
              y: 31,
            },
            {
              x: "UK",
              y: 70,
            },
            {
              x: "Australia",
              y: 30,
            },
            {
              x: "Germany",
              y: 44,
            },
            {
              x: "Italy",
              y: 68,
            },
            {
              x: "Israel",
              y: 28,
            },
            {
              x: "Indonesia",
              y: 19,
            },
            {
              x: "Bangladesh",
              y: 29,
            },
          ],
        },
      ],
      legend: {
        show: false,
      },
      chart: {
        height: 350,
        type: "treemap",
        toolbar: {
          show: false,
        },
      },
      title: {
        text: "Visitors Location",
        align: "center",
        style: {
          fontWeight: 500,
        },
      },
      colors: colors,
      plotOptions: {
        treemap: {
          distributed: true,
          enableShades: false,
        },
      },
    };
  }

  /**
   * Simple Donut Chart
   */
  private _simpleDonutChart(colors: any) {
    colors = this.getChartColorsArray(colors);
    this.simpleDonutChart = {
      series: [78.56, 105.02, 42.89],
      labels: ["Desktop", "Mobile", "Tablet"],
      chart: {
        type: "donut",
        height: 219,
      },
      plotOptions: {
        pie: {
          donut: {
            size: "76%",
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
        position: "bottom",
        horizontalAlign: "center",
        offsetX: 0,
        offsetY: 0,
        markers: {
          width: 20,
          height: 6,
          radius: 2,
        },
        itemMargin: {
          horizontal: 12,
          vertical: 0,
        },
      },
      stroke: {
        width: 0,
      },
      yaxis: {
        labels: {
          formatter: function (value: any) {
            return value + "k" + " Users";
          },
        },
        tickAmount: 4,
        min: 0,
      },
      colors: colors,
    };
  }

  /**
   * Deal Type Chart
   */
  private _DealTypeChart(colors: any) {
    colors = this.getChartColorsArray(colors);
    this.DealTypeChart = {
      series: [
        {
          name: "Following",
          data: [80, 50, 30, 40, 100, 20],
        },
        {
          name: "Followers",
          data: [20, 30, 40, 80, 20, 80],
        },
      ],
      chart: {
        height: 341,
        type: "radar",
        dropShadow: {
          enabled: true,
          blur: 1,
          left: 1,
          top: 1,
        },
        toolbar: {
          show: false,
        },
      },
      stroke: {
        width: 2,
      },
      fill: {
        opacity: 0.2,
      },
      legend: {
        show: true,
        fontWeight: 500,
        offsetX: 0,
        offsetY: -8,
        markers: {
          width: 8,
          height: 8,
          radius: 6,
        },
        itemMargin: {
          horizontal: 10,
          vertical: 0,
        },
      },
      markers: {
        size: 0,
      },
      colors: colors,
      xaxis: {
        categories: ["2016", "2017", "2018", "2019", "2020", "2021"],
      },
    };
  }
}
