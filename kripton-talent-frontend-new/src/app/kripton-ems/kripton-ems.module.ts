import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  NgbToastModule,
  NgbProgressbarModule,
  NgbDropdownModule,
  NgbTooltipModule,
  NgbCollapseModule,
  NgbCarouselModule,
  NgbAccordionModule,
  NgbNavModule,
} from "@ng-bootstrap/ng-bootstrap";
// Apex Chart
import { NgApexchartsModule } from "ng-apexcharts";
import { NgChartsModule } from "ng2-charts";
import { NgxEchartsModule } from "ngx-echarts";
import { ScrollToModule } from "@nicky-lenaers/ngx-scroll-to";
import { FlatpickrModule } from "angularx-flatpickr";
import { CountToModule } from "angular-count-to";
import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { SimplebarAngularModule } from "simplebar-angular";
// Select Droup down
import { NgSelectModule } from "@ng-select/ng-select";

// Swiper Slider
import { NgxUsefulSwiperModule } from "ngx-useful-swiper";

import { LightboxModule } from "ngx-lightbox";

// Load Icons
import { defineElement } from "lord-icon-element";
import lottie from "lottie-web";
import { SharedModule } from "../shared/shared.module";
import { WidgetModule } from "../shared/widget/widget.module";
import { MatTableModule } from "@angular/material/table";
//  Drag and drop
import { DndModule } from "ngx-drag-drop";

// NG2 Search Filter
import { Ng2SearchPipeModule } from "ng2-search-filter";

import { DragDropModule } from "@angular/cdk/drag-drop";
import { SortByPipe } from "./sort-by.pipe";

// Ck Editer
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
// components modules
import { KriptonEmsRoutingModule } from "./kripton-ems-routing.module";
import { JobsModule } from "./jobs/jobs.module";
import { CandidatesModule } from "./candidates/candidates.module";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ToastsContainer } from "./dashboard/toasts-container.component";
import { TodoComponent } from "./todo/todo.component";
import { LandingPageComponent } from "./landing-page/landing-page.component";
import { MailboxComponent } from "./mailbox/mailbox.component";
import { NgxSliderModule } from "@angular-slider/ngx-slider";
import { CalComponent } from "./cal/cal.component";
import { FullCalendarModule } from "@fullcalendar/angular";
import { RecommendComponent } from "./recommend/recommend.component";
import { NgbdApikeySortableHeader } from "./todo/apikey-sortable.directive";
import { UpdateProfileCandidateComponent } from './update-profile-candidate/update-profile-candidate.component';

@NgModule({
  declarations: [
    DashboardComponent,
    ToastsContainer,
    TodoComponent,
    NgbdApikeySortableHeader,
    SortByPipe,
    LandingPageComponent,
    MailboxComponent,
    CalComponent,
    RecommendComponent,
    UpdateProfileCandidateComponent,
  ],
  imports: [
    CommonModule,
    KriptonEmsRoutingModule,
    JobsModule,
    CandidatesModule,
    NgSelectModule,
    NgbToastModule,
    NgbProgressbarModule,
    FormsModule,
    ReactiveFormsModule,
    FlatpickrModule.forRoot(),
    Ng2SearchPipeModule,
    DragDropModule,
    CKEditorModule,
    ScrollToModule.forRoot(),
    NgxSliderModule,
    CountToModule,
    LeafletModule,
    NgbDropdownModule,
    NgxUsefulSwiperModule,
    LightboxModule,
    SharedModule,
    WidgetModule,
    NgbTooltipModule,
    MatTableModule,
    DndModule,
    NgbCollapseModule,
    NgbCarouselModule,
    NgbAccordionModule,
    SimplebarAngularModule,
    NgbNavModule,
    NgxSliderModule,
    FullCalendarModule,
    NgApexchartsModule,
    NgChartsModule,
    NgxEchartsModule.forRoot({
      echarts: () => import("echarts"),
    }),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [DatePipe],
})
export class KriptonEmsModule {
  constructor() {
    defineElement(lottie.loadAnimation);
  }
}
