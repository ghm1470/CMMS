import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedWorkOrderComponent } from './assigned-work-order.component';

describe('AssignedWorkOrderComponent', () => {
  let component: AssignedWorkOrderComponent;
  let fixture: ComponentFixture<AssignedWorkOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignedWorkOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignedWorkOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
