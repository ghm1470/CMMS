import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartTableTestComponent } from './smart-table-test.component';

describe('SmartTableTestComponent', () => {
  let component: SmartTableTestComponent;
  let fixture: ComponentFixture<SmartTableTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmartTableTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartTableTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
