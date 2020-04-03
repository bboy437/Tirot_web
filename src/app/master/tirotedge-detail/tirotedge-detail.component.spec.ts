import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TirotedgeDetailComponent } from './tirotedge-detail.component';

describe('TirotedgeDetailComponent', () => {
  let component: TirotedgeDetailComponent;
  let fixture: ComponentFixture<TirotedgeDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TirotedgeDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TirotedgeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
