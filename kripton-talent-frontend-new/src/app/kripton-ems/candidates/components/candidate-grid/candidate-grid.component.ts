import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
} from "@angular/core";

@Component({
  selector: "app-candidate-grid",
  templateUrl: "./candidate-grid.component.html",
  styleUrls: ["./candidate-grid.component.scss"],
})
export class CandidateGridComponent implements OnInit {
  pageSize: number = 9;
  page: number = 1;
  @Input() candidateList!: Array<any>;
  @Output() updateCandidateListEvent = new EventEmitter<boolean>();
  constructor() {}
  ngOnInit(): void {}
  updateListCandidates(event: any) {
    if (event === true) {
      this.updateCandidateListEvent.emit(true);
    }
  }
}
