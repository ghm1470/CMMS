import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseActionComponent } from './purchase-action.component';

describe('PurchaseActionComponent', () => {
  let component: PurchaseActionComponent;
  let fixture: ComponentFixture<PurchaseActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
