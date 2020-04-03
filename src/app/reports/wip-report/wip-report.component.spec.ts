import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WipReportComponent } from './wip-report.component';

describe('WipReportComponent', () => {
  let component: WipReportComponent;
  let fixture: ComponentFixture<WipReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WipReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WipReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
