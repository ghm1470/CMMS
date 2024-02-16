import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Notify2Component } from './notify2.component';

describe('Notify2Component', () => {
  let component: Notify2Component;
  let fixture: ComponentFixture<Notify2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Notify2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Notify2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
