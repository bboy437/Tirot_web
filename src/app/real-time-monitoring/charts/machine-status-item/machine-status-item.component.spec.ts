import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineStatusItemComponent } from './machine-status-item.component';

describe('MachineStatusItemComponent', () => {
  let component: MachineStatusItemComponent;
  let fixture: ComponentFixture<MachineStatusItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MachineStatusItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineStatusItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
