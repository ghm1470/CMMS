import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifyWorkTViewComponent } from './notify-work-tview.component';

describe('NotifyWorkTViewComponent', () => {
  let component: NotifyWorkTViewComponent;
  let fixture: ComponentFixture<NotifyWorkTViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotifyWorkTViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotifyWorkTViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
