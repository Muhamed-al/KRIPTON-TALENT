import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobBriefingComponent } from './job-briefing.component';

describe('JobBriefingComponent', () => {
  let component: JobBriefingComponent;
  let fixture: ComponentFixture<JobBriefingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobBriefingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobBriefingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
