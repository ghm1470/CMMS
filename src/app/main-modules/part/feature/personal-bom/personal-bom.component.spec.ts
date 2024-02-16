import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalBomComponent } from './personal-bom.component';

describe('PersonalBomComponent', () => {
  let component: PersonalBomComponent;
  let fixture: ComponentFixture<PersonalBomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalBomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalBomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
