import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { LayoutComponent } from "./layouts/layout.component";

import { LandingPageComponent } from "./kripton-ems/landing-page/landing-page.component";
import { UpdateProfileCandidateComponent } from "./kripton-ems/update-profile-candidate/update-profile-candidate.component";
import { AuthGuard } from "./core/guards/auth.guard";

const routes: Routes = [
  {
    path: "",
    component: LandingPageComponent,
  },
  {
    path: "update-profile",
    component: UpdateProfileCandidateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "auth",
    loadChildren: () =>
      import("./account/account.module").then((m) => m.AccountModule),
  },
  {
    path: "ems",
    component: LayoutComponent,
    loadChildren: () =>
      import("./kripton-ems/kripton-ems.module").then(
        (m) => m.KriptonEmsModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
