import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  NgbDropdownModule,
  NgbTooltipModule,
  NgbPaginationModule,
  NgbNavModule,
} from "@ng-bootstrap/ng-bootstrap";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "src/app/shared/shared.module";

import { JobsRoutingModule } from "./jobs-routing.module";
import { NewjobComponent } from "./newjob/newjob.component";
// Apex Chart Package
import { NgApexchartsModule } from "ng-apexcharts";

// Feather Icon
import { FeatherModule } from "angular-feather";
import { allIcons } from "angular-feather/icons";

// Flat Picker
import { FlatpickrModule } from "angularx-flatpickr";

// Ng Select
import { NgSelectModule } from "@ng-select/ng-select";
// Load Icon
import { defineElement } from "lord-icon-element";
import lottie from "lottie-web";

import { OverviewComponent } from "./overview/overview.component";
import { JobCardComponent } from "./components/job-card/job-card.component";
import { JobListComponent } from "./components/job-list/job-list.component";
import { JobGridComponent } from "./components/job-grid/job-grid.component";
import { JobBriefingComponent } from "./components/job-briefing/job-briefing.component";
import { JobCardGridComponent } from "./components/job-card-grid/job-card-grid.component";
import { ApplicationComponent } from "./application/application.component";
import { LandingComponent } from "./components/landing/landing.component";
import { NgxSliderModule } from "@angular-slider/ngx-slider";
@NgModule({
  declarations: [
    NewjobComponent,
    OverviewComponent,
    JobCardComponent,
    LandingComponent,
    JobListComponent,
    JobGridComponent,
    JobBriefingComponent,
    JobCardGridComponent,
    ApplicationComponent,
  ],
  imports: [
    CommonModule,
    JobsRoutingModule,
    SharedModule,
    NgApexchartsModule,
    FeatherModule.pick(allIcons),
    NgbDropdownModule,
    NgbTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSliderModule,
    FlatpickrModule,
    NgSelectModule,
    NgbPaginationModule,
    NgbNavModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class JobsModule {
  constructor() {
    defineElement(lottie.loadAnimation);
  }
}
