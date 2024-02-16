import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetConsumingReferenceComponent } from './asset-consuming-reference.component';

describe('AssetConsumingReferenceComponent', () => {
  let component: AssetConsumingReferenceComponent;
  let fixture: ComponentFixture<AssetConsumingReferenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetConsumingReferenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetConsumingReferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
