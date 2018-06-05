import { Component, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy, HostBinding, ViewChild } from '@angular/core';

import { ListPriceSparklineComponent } from './list-price-sparkline/list-price-sparkline.component';

@Component({
  selector: 'app-list-price',
  templateUrl: './list-price.component.html',
  styleUrls: ['./list-price.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListPriceComponent implements OnChanges {

  @Input() fare: number;

  @HostBinding('class.is-up') isUp = false;
  @HostBinding('class.is-down') isDown = false;

  @ViewChild(ListPriceSparklineComponent) child: ListPriceSparklineComponent;

  constructor(
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    const fare = changes.fare;

    if (!fare) {
      return;
    }

    if (fare.firstChange === false) {
      const up = fare.currentValue >= fare.previousValue;

      // Is it higher or lower then the previous value
      this.isUp = up;
      this.isDown = !up;

      // You can also watch the fare from the component instead of calling from the parent)
      this.child.update(fare.currentValue);
    }


  }
}
