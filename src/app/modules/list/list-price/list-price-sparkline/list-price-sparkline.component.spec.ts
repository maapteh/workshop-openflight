import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPriceSparklineComponent } from './list-price-sparkline.component';

describe('ListPriceSparklineComponent', () => {
  let component: ListPriceSparklineComponent;
  let fixture: ComponentFixture<ListPriceSparklineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPriceSparklineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPriceSparklineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
