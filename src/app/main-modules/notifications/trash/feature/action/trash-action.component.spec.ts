import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrashActionComponent } from './trash-action.component';

describe('TrashActionComponent', () => {
  let component: TrashActionComponent;
  let fixture: ComponentFixture<TrashActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrashActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrashActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
