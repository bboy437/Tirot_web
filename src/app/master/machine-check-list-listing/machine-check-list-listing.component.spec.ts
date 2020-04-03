import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineCheckListListingComponent } from './machine-check-list-listing.component';

describe('MachineCheckListListingComponent', () => {
  let component: MachineCheckListListingComponent;
  let fixture: ComponentFixture<MachineCheckListListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MachineCheckListListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineCheckListListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
