import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { ToastService } from "../toast/toast-service";
@Component({
  selector: "app-candidate-list",
  templateUrl: "./candidate-list.component.html",
  styleUrls: ["./candidate-list.component.scss"],
})
export class CandidateListComponent implements OnInit {
  @Input() candidateList!: Array<any>;
  @Output() updateCandidateListEvent = new EventEmitter<boolean>();
  pageSize: number = 5;
  page: number = 1;

  constructor(public toastService: ToastService) {}
  ngOnInit(): void {}

  updateListCandidates(event: any) {
    if (event === true) {
      this.updateCandidateListEvent.emit(true);
    }
  }
}
