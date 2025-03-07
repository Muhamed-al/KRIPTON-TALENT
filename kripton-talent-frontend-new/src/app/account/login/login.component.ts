import { Component, OnInit } from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

// Login Auth
import { environment } from "../../../environments/environment";

import { first } from "rxjs/operators";
import { ToastService } from "./toast-service";
import { LoginService } from "src/app/core/services/login.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})

/**
 * Login Component
 */
export class LoginComponent implements OnInit {
  // Login Form
  loginForm!: UntypedFormGroup;
  submitted = false;
  fieldTextType!: boolean;
  error = "";
  returnUrl!: string;
  // set the current year
  year: number = new Date().getFullYear();

  constructor(
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public toastService: ToastService,
    private loginService: LoginService
  ) {
    // redirect to home if already logged in
    if (this.loginService.currentUserValue) {
      this.loginService.logout();
    }
  }

  ngOnInit(): void {
    if (localStorage.getItem("currentUser")) {
      this.loginService.logout();
    }
    /**
     * Form Validatyion
     */
    this.loginForm = this.formBuilder.group({
      email: [
        "mohamed.alouani@tek-up.de",
        [Validators.required, Validators.email],
      ],
      password: ["123456", [Validators.required]],
    });
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  /**
   * Form submit
   */
  onSubmit() {
    this.submitted = true;
    console.log("login");
    if (this.loginForm.invalid) {
      return;
    } else {
      this.loginService
        .login(this.f["email"].value, this.f["password"].value)
        .pipe(first())
        .subscribe((data) => {
          if (data != null) {
            localStorage.setItem("toast", "true");
            if (this.loginService.currentUserValue.status === "candidate") {
              this.router.navigate(["/"]);
            } else {
              this.router.navigate(["/ems"]);
            }
          }
        });
    }
  }

  /**
   * Password Hide/Show
   */
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
}
