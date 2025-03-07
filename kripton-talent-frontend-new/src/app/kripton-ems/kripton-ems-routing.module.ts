import { NgModule, Component } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { TodoComponent } from "./todo/todo.component";
import { RecruiterGuard } from "../core/guards/recruiter.guard";
import { AuthGuard } from "../core/guards/auth.guard";
import { MailboxComponent } from "./mailbox/mailbox.component";
import { CalComponent } from "./cal/cal.component";
import { RecommendComponent } from "./recommend/recommend.component";

const routes: Routes = [
  {
    path: "",
    component: DashboardComponent,
    //canActivate: [AuthGuard, RecruiterGuard],
  },
  {
    path: "jobs",
    loadChildren: () => import("./jobs/jobs.module").then((m) => m.JobsModule),
    //canActivate: [AuthGuard, RecruiterGuard],
  },
  {
    path: "recommend",
    component: RecommendComponent,
    //canActivate: [AuthGuard, RecruiterGuard],
  },
  {
    path: "mailbox",
    component: MailboxComponent,
    //canActivate: [AuthGuard, RecruiterGuard],
  },
  {
    path: "calendar",
    component: CalComponent,
    //canActivate: [AuthGuard, RecruiterGuard],
  },
  {
    path: "tasks",
    component: TodoComponent,
    //canActivate: [AuthGuard, RecruiterGuard],
  },
  {
    path: "candidates",
    loadChildren: () =>
      import("./candidates/candidates.module").then((m) => m.CandidatesModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KriptonEmsRoutingModule {}
