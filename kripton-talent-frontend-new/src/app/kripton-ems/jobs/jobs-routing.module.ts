import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NewjobComponent } from "./newjob/newjob.component";
import { OverviewComponent } from "./overview/overview.component";
import { LandingComponent } from "./components/landing/landing.component";
import { ApplicationComponent } from "./application/application.component";

const routes: Routes = [
  {
    path: "",
    component: LandingComponent,
  },
  {
    path: "overview/:id",
    component: OverviewComponent,
  },
  {
    path: "create-job",
    component: NewjobComponent,
  },
  {
    path: "applications",
    component: ApplicationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JobsRoutingModule {}
