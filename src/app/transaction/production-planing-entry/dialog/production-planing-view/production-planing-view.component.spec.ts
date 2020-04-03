import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionPlaningViewComponent } from './production-planing-view.component';

describe('ProductionPlaningViewComponent', () => {
  let component: ProductionPlaningViewComponent;
  let fixture: ComponentFixture<ProductionPlaningViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductionPlaningViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionPlaningViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
