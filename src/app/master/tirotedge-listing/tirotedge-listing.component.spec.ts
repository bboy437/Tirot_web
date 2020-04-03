import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TirotedgeListingComponent } from './tirotedge-listing.component';

describe('TirotedgeListingComponent', () => {
  let component: TirotedgeListingComponent;
  let fixture: ComponentFixture<TirotedgeListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TirotedgeListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TirotedgeListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
