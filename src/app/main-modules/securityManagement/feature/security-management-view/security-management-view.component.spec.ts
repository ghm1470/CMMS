import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityManagementViewComponent } from './security-management-view.component';

describe('SecurityManagementViewComponent', () => {
  let component: SecurityManagementViewComponent;
  let fixture: ComponentFixture<SecurityManagementViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecurityManagementViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityManagementViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
