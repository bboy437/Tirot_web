import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineSummaryStatusComponent } from './machine-summary-status.component';

describe('MachineSummaryStatusComponent', () => {
  let component: MachineSummaryStatusComponent;
  let fixture: ComponentFixture<MachineSummaryStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MachineSummaryStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineSummaryStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
