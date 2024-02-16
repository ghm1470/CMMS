import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileActionComponent } from './profile-action.component';

describe('ProfileActionComponent', () => {
  let component: ProfileActionComponent;
  let fixture: ComponentFixture<ProfileActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
