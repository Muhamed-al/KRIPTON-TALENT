import { Component, OnInit } from "@angular/core";
import { LoginService } from "../../core/services/login.service";
import { Router } from "@angular/router";
import { User } from "src/app/core/models/auth.models";

@Component({
  selector: "app-landing-page",
  templateUrl: "./landing-page.component.html",
  styleUrls: ["./landing-page.component.scss"],
})
export class LandingPageComponent implements OnInit {
  currentSection = "home";
  currentUser!: User;
  
  public isCollapsed = true;

  constructor(private loginService: LoginService, private router: Router) {}

  ngOnInit(): void {
    this.currentUser = this.loginService.currentUserValue;
  }
  logout() {
    this.currentUser = {};
    this.loginService.logout();
    location.reload();
  }

  /**
   * Section changed method
   * @param sectionId specify the current sectionID
   */
  onSectionChange(sectionId: string) {
    this.currentSection = sectionId;
  }
  /**
   * Window scroll method
   */
  // tslint:disable-next-line: typedef
  windowScroll() {
    const navbar = document.getElementById("navbar");
    if (
      document.body.scrollTop > 40 ||
      document.documentElement.scrollTop > 40
    ) {
      navbar?.classList.add("is-sticky");
    } else {
      navbar?.classList.remove("is-sticky");
    }

    // Top Btn Set
    if (
      document.body.scrollTop > 100 ||
      document.documentElement.scrollTop > 100
    ) {
      (document.getElementById("back-to-top") as HTMLElement).style.display =
        "block";
    } else {
      (document.getElementById("back-to-top") as HTMLElement).style.display =
        "none";
    }
  }

  // When the user clicks on the button, scroll to the top of the document
  topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }
}
