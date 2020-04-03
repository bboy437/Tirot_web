import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChecktempandwidthsReportComponent } from './checktempandwidths-report.component';

describe('ChecktempandwidthsReportComponent', () => {
  let component: ChecktempandwidthsReportComponent;
  let fixture: ComponentFixture<ChecktempandwidthsReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChecktempandwidthsReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChecktempandwidthsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
