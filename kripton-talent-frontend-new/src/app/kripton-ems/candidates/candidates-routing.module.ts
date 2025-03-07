import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LandingComponent } from "./landing/landing.component";
import { NewCandidateComponent } from "./new-candidate/new-candidate.component";
import { OverviewComponent } from "./overview/overview.component";
import { RecruiterGuard } from "src/app/core/guards/recruiter.guard";
import { AuthGuard } from "src/app/core/guards/auth.guard";
import { CompleteProfileComponent } from "./complete-profile/complete-profile.component";

const routes: Routes = [
  {
    path: "",
    component: LandingComponent,
    //canActivate: [AuthGuard, RecruiterGuard],
  },
  { path: "create-candidate", component: NewCandidateComponent },
  {
    path: "candidate-overview/:id",
    component: OverviewComponent,
    // canActivate: [AuthGuard, RecruiterGuard],
  },
  {
    path: "complete-profile/:id",
    component: CompleteProfileComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CandidatesRoutingModule {}
