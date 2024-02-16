import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingFullComponent } from './loading-full.component';

describe('LoadingFullComponent', () => {
  let component: LoadingFullComponent;
  let fixture: ComponentFixture<LoadingFullComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadingFullComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingFullComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
