import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedWorkOrderViewComponent } from './assigned-work-order-view.component';

describe('AssignedWorkOrderViewComponent', () => {
  let component: AssignedWorkOrderViewComponent;
  let fixture: ComponentFixture<AssignedWorkOrderViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignedWorkOrderViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignedWorkOrderViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
