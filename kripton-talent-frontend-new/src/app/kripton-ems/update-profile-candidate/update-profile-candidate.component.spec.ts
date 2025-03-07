import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateProfileCandidateComponent } from './update-profile-candidate.component';

describe('UpdateProfileCandidateComponent', () => {
  let component: UpdateProfileCandidateComponent;
  let fixture: ComponentFixture<UpdateProfileCandidateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateProfileCandidateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateProfileCandidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
