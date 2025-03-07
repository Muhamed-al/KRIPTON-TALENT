import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateGridCardComponent } from './candidate-grid-card.component';

describe('CandidateGridCardComponent', () => {
  let component: CandidateGridCardComponent;
  let fixture: ComponentFixture<CandidateGridCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateGridCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidateGridCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
