import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule, DecimalPipe } from "@angular/common";
import {
  NgbDropdownModule,
  NgbTooltipModule,
  NgbPaginationModule,
  NgbNavModule,
} from "@ng-bootstrap/ng-bootstrap";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
// Apex Chart Package
import { NgApexchartsModule } from "ng-apexcharts";

// Feather Icon
import { FeatherModule } from "angular-feather";
import { allIcons } from "angular-feather/icons";

// Flat Picker
import { FlatpickrModule } from "angularx-flatpickr";
import { NgbToastModule } from "@ng-bootstrap/ng-bootstrap";

// Ng Select
import { NgSelectModule } from "@ng-select/ng-select";
// Load Icon
import { defineElement } from "lord-icon-element";
import lottie from "lottie-web";
import { SharedModule } from "src/app/shared/shared.module";

import { CandidatesRoutingModule } from "./candidates-routing.module";
import { NewCandidateComponent } from "./new-candidate/new-candidate.component";
import { OverviewComponent } from "./overview/overview.component";
import { CandidateListComponent } from "./components/candidate-list/candidate-list.component";
import { CandidateGridComponent } from "./components/candidate-grid/candidate-grid.component";
import { CandidateGridCardComponent } from "./components/candidate-grid-card/candidate-grid-card.component";
import { CandidateListCardComponent } from "./components/candidate-list-card/candidate-list-card.component";
import { LandingComponent } from "./landing/landing.component";
import { ToastsContainer } from "./components/toast/toasts-container.component";
import { CompleteProfileComponent } from './complete-profile/complete-profile.component';
@NgModule({
  declarations: [
    NewCandidateComponent,

    OverviewComponent,
    CandidateListComponent,
    CandidateGridComponent,
    CandidateGridCardComponent,
    CandidateListCardComponent,
    LandingComponent,
    ToastsContainer,
    CompleteProfileComponent,
  ],
  imports: [
    CommonModule,
    CandidatesRoutingModule,
    SharedModule,
    NgApexchartsModule,
    FeatherModule.pick(allIcons),
    NgbDropdownModule,
    NgbTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    FlatpickrModule,
    NgSelectModule,
    NgbPaginationModule,
    NgbNavModule,
    NgbToastModule,
  ],
  providers: [DecimalPipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CandidatesModule {
  constructor() {
    defineElement(lottie.loadAnimation);
  }
}
