import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineCurrentMachineAvailableComponent } from './timeline-current-machine-available.component';

describe('TimelineCurrentMachineAvailableComponent', () => {
  let component: TimelineCurrentMachineAvailableComponent;
  let fixture: ComponentFixture<TimelineCurrentMachineAvailableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimelineCurrentMachineAvailableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelineCurrentMachineAvailableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
