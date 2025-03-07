import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobGridComponent } from './job-grid.component';

describe('JobGridComponent', () => {
  let component: JobGridComponent;
  let fixture: ComponentFixture<JobGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobGridComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
