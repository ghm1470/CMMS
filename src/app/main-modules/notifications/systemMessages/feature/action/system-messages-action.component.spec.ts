import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemMessagesActionComponent } from './system-messages-action.component';

describe('SystemMessagesActionComponent', () => {
  let component: SystemMessagesActionComponent;
  let fixture: ComponentFixture<SystemMessagesActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemMessagesActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemMessagesActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
