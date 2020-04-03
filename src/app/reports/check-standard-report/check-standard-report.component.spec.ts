import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckStandardReportComponent } from './check-standard-report.component';

describe('CheckStandardReportComponent', () => {
  let component: CheckStandardReportComponent;
  let fixture: ComponentFixture<CheckStandardReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckStandardReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckStandardReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
