import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DatePipe } from '@angular/common';

// Ck Editer
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";

// Sweet Alert
import Swal from "sweetalert2";

// Email Data Get
import { emailData } from "./data";
import { Email , EmailPayload, FlaskEmail , ToRecipient, mapFlaskEmailToAngularEmail } from "./mailbox.model";
import { MailingService } from "src/app/core/services/mailing.service";

@Component({
  selector: "app-mailbox",
  templateUrl: "./mailbox.component.html",
  styleUrls: ["./mailbox.component.scss"],
 // providers: [DatePipe]
})

/**
 * Mailbox Component
 */
export class MailboxComponent implements OnInit {
  public Editor = ClassicEditor;
  emailData!: Email[];
  emailIds: number[] = [];
  emailDatas: any;
  dataCount: any;
  cat: any;
  masterSelected!: boolean;
  userEmails !: any[];

  inboxEmails : any;
  sentEmails : any;
  //FOR SEND EMAIL
  toRecipientAddress: string = '';
  emailSubject: string = '';
  emailContent: string = '';
  constructor(private modalService: NgbModal,
              private mailingService : MailingService,
              private datePipe: DatePipe) {}

  ngOnInit(): void {
    console.log("INSIDE MAILBOX COMPONENT")
    console.log("this is working");
    /**
     * Fetches the data
     */
    this.fetchData();

    // Compose Model Hide/Show
    var isShowMenu = false;
    document.querySelectorAll(".email-menu-btn").forEach(function (item) {
      item.addEventListener("click", function (e) {
        e.preventDefault();
        isShowMenu = true;
        document.getElementById("menusidebar")?.classList.add("menubar-show");
      });
    });
    document
      .querySelector(".email-wrapper")
      ?.addEventListener("click", function () {
        if (
          document
            .querySelector(".email-menu-sidebar")
            ?.classList.contains("menubar-show")
        ) {
          if (!isShowMenu) {
            document
              .querySelector(".email-menu-sidebar")
              ?.classList.remove("menubar-show");
          }
          isShowMenu = false;
        }
      });

      //**********GET ALL EMAILS 
      //this.inboxEmails = this.getAllEmails("Inbox");
      // this.sentEmails = this.getAllEmails("SentItems");
  }

  nbEmails?:number;
  getAllEmails(emailType: string) {
    this.mailingService.getAllEmails(emailType).subscribe(
      (flaskEmails: FlaskEmail[]) => {
        this.userEmails = flaskEmails.map((flaskEmail: FlaskEmail) =>
          mapFlaskEmailToAngularEmail(flaskEmail)
        );
        console.log("USER_EMAILS-------- " , this.userEmails.length)
        this.nbEmails = this.userEmails.length;
      },
      (error: any) => {
        console.log('Error retrieving emails:', error);
      }
    );
  }

  //***SEND EMAIL */
  // sendEmail(): void {
  //   const recipient: ToRecipient = {
  //     emailAddress: {
  //       address: this.toRecipientAddress,
  //     },
  //   };

  //   const payload: EmailPayload = {
  //     subject: this.emailSubject,
  //     content: this.emailContent,
  //     to_recipients: [recipient],
  //   };

  //   this.mailingService.sendEmail(payload)
  //     .subscribe(
  //       response => {
  //         console.log('Email sent successfully!', response);
  //         // Additional logic or UI updates after successful email sending
  //       },
  //       error => {
  //         console.error('Error sending email:', error);
  //         // Handle error and display appropriate message to the user
  //       }
  //     );
  // }
  sendEmail(): void {
    const recipientEmails: string[] = this.toRecipientAddress.split(',');
    const recipients: ToRecipient[] = recipientEmails.map(email => ({
      emailAddress: {
        address: email.trim(),
      },
    }));
  
    const payload: EmailPayload = {
      subject: this.emailSubject,
      content: this.emailContent,
      to_recipients: recipients,
    };
  
    this.mailingService.sendEmail(payload)
      .subscribe(
        response => {
          console.log('Email sent successfully!', response);
          this.closeChat()
        },
        error => {
          console.error('Error sending email:', error);
          // Handle error and display appropriate message to the user
        }
      );
  }
  

  /**
   * Fetches the data
   */
  private fetchData() {
    document.getElementById("emaildata")?.classList.add("d-none");
    setTimeout(() => {
      document.getElementById("emaildata")?.classList.remove("d-none");
      this.emailData = emailData;
      this.emailDatas = Object.assign([], this.emailData);
      this.dataCount = this.emailDatas.length;
      document.getElementById("elmLoader")?.classList.add("d-none");
    }, 1000);
  }

  /**
   * Open modal
   * @param content content
   */
  open(content: any) {
    this.modalService.open(content, { size: "lg", centered: true });
  }

  /**
   * on settings button clicked from topbar
   */
  singleData: any = [];
  onSettingsButtonClicked(event: any, id: any) {
    this.singleData = this.emailData.filter((order: any) => {
      return order.id === id;
    });
    this.singleData.forEach((item: any) => {
      this.singleData = item;
    });
    document.body.classList.add("email-detail-show");
  }

  /**
   * Hide the sidebar
   */
  public hide() {
    document.body.classList.remove("email-detail-show");
  }

  /**
   * Confirmation mail model
   */
  confirm(content: any) {
    this.modalService.open(content, { centered: true });
    var checkboxes: any = document.getElementsByName("checkAll");
    var checkedVal: any[] = [];
    var result;
    for (var i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        result = checkboxes[i].value;
        checkedVal.push(result);
      }
    }
    this.emailIds = checkedVal;
  }

  /***
   * Delete Mail
   */
  deleteData() {
    this.emailIds.forEach((item: any) => {
      document.getElementById("chk-" + item)?.remove();
      for (var i = 0; i < this.emailData.length; i++) {
        if (this.emailData[i].id == item) {
          this.emailData[i].category = "trash";
        }
      }
    });
    (
      document.getElementById("email-topbar-actions") as HTMLElement
    ).style.display = "none";
  }

  /***
   * send mail select multiple mail
   */
  selectMail(event: any, id: any) {
    var checkboxes: any = document.getElementsByName("checkAll");
    var checkedVal: any[] = [];
    var result;
    for (var i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        result = checkboxes[i].value;
        checkedVal.push(result);
      }
    }
    this.emailIds = checkedVal;
    this.emailIds.length > 0
      ? ((
          document.getElementById("email-topbar-actions") as HTMLElement
        ).style.display = "block")
      : ((
          document.getElementById("email-topbar-actions") as HTMLElement
        ).style.display = "none");
  }

  // The master checkbox will check/ uncheck all items
  checkUncheckAll(ev: any) {
    this.emailDatas.forEach(
      (x: { state: any }) => (x.state = ev.target.checked)
    );
    if (ev.target.checked) {
      (
        document.getElementById("email-topbar-actions") as HTMLElement
      ).style.display = "block";
    } else {
      (
        document.getElementById("email-topbar-actions") as HTMLElement
      ).style.display = "none";
    }
  }

  // Active Star
  activeStar(id: any, i: any) {
    if (this.emailData[i].category != "starred") {
      this.cat = this.emailData[i].category;
      this.emailData[i].category = "starred";
    } else {
      this.emailData[i].category = this.cat;
    }
    document.querySelector(".star_" + id)?.classList.toggle("active");
  }

  /**
   * Category Filtering
   */
  // categoryFilter(e: any, name: any) {
  //   var removeClass = document.querySelectorAll(".mail-list a");
  //   removeClass.forEach((element: any) => {
  //     element.classList.remove("active");
  //   });
  //   e.target.closest(".mail-list a").classList.add("active");
  //   if (name == "all") {
  //     this.emailDatas = this.emailData;
  //   } else {
  //     this.emailDatas = this.emailData.filter((email: any) => {
  //       return email.category === name;
  //     });
  //   }
  // }
  categoryFilter(e: any, name: any) {
    const removeClass = document.querySelectorAll(".mail-list a");
    removeClass.forEach((element: any) => {
      element.classList.remove("active");
    });
    e.target.closest("a").classList.add("active");
    if (name === "inbox" || name === "all") {
      this.getAllEmails("Inbox");
    } else if (name === "sent") {
      this.getAllEmails("SentItems");
    } else {
      this.getAllEmails("drafts");
    }
  }

  /**
   * Label Filtering
   */
  labelsFilter(e: any, name: any) {
    var removeClass = document.querySelectorAll(".mail-list a");
    removeClass.forEach((element: any) => {
      element.classList.remove("active");
    });
    e.target.closest(".mail-list a").classList.add("active");
    this.emailDatas = this.emailData.filter((email: any) => {
      return email.label === name;
    });
  }

  /**
   * Chat Filtering
   */
  userName: any;
  profile: any = "user-dummy-img.jpg";
  chatFilter(e: any, name: any, image: any) {
    (
      document.getElementById("emailchat-detailElem") as HTMLElement
    ).style.display = "block";
    this.userName = name;
    this.profile = image ? image : "user-dummy-img.jpg";
  }

  // Close Chat
  closeChat() {
    (
      document.getElementById("emailchat-detailElem") as HTMLElement
    ).style.display = "none";
  }

  // formatDate(dateString: string): string {
  //   const date = new Date(dateString);
  //   const today = new Date();
    
  //   if (date.toDateString() === today.toDateString()) {
  //     return this.datePipe.transform(date, 'hh:mm a');
  //   } else {
  //     return this.datePipe.transform(date, 'dd MMM');
  //   }
  formatDate(dateString: string ): string {
    if (!dateString) {
      return ''; // Return an empty string if dateString is null or undefined
    }
    
    const date = new Date(dateString);
    const today = new Date();
    
    if (date.toDateString() === today.toDateString()) {
      return this.datePipe.transform(date, 'hh:mm a') as string;
    } else {
      return this.datePipe.transform(date, 'dd MMM') as string;
    }
  }


  

}
