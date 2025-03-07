import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobCardGridComponent } from './job-card-grid.component';

describe('JobCardGridComponent', () => {
  let component: JobCardGridComponent;
  let fixture: ComponentFixture<JobCardGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobCardGridComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobCardGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
