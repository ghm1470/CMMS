import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProTableComponent } from './pro-table.component';

describe('ProTableComponent', () => {
  let component: ProTableComponent;
  let fixture: ComponentFixture<ProTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
