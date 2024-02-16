import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SentActionComponent } from './sent-action.component';

describe('SentActionComponent', () => {
  let component: SentActionComponent;
  let fixture: ComponentFixture<SentActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SentActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SentActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
