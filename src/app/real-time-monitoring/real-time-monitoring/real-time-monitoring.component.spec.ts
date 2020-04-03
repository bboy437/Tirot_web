import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RealTimeMonitoringComponent } from './real-time-monitoring.component';

describe('RealTimeMonitoringComponent', () => {
  let component: RealTimeMonitoringComponent;
  let fixture: ComponentFixture<RealTimeMonitoringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RealTimeMonitoringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RealTimeMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
