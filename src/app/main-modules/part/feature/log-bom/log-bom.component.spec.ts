import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogBomComponent } from './log-bom.component';

describe('LogBomComponent', () => {
  let component: LogBomComponent;
  let fixture: ComponentFixture<LogBomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogBomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogBomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
