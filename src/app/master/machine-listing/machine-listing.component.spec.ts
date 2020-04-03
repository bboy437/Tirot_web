import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineListingComponent } from './machine-listing.component';

describe('MachineListingComponent', () => {
  let component: MachineListingComponent;
  let fixture: ComponentFixture<MachineListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MachineListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
