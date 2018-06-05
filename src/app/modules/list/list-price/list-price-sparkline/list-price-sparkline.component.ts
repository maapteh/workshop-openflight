import { Component, OnInit, OnDestroy, AfterViewInit, Input, ElementRef, NgZone, ChangeDetectionStrategy } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-list-price-sparkline',
  templateUrl: './list-price-sparkline.component.html',
  styleUrls: ['./list-price-sparkline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListPriceSparklineComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() fare;

  private chart;
  private canvas;

  constructor(
    private el: ElementRef,
    private ngZone: NgZone,
  ) { }

  ngOnInit() {
    this.createChart();
  }

  ngOnDestroy() {
    this.ngZone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.destroy();
      }
    });
  }

  ngAfterViewInit() {
    //
  }

  public update(value: number) {
    this.ngZone.runOutsideAngular(() => {
      if (!this.chart) {
        return;
      }

      this.chart.data.datasets[0].data.push(value);
      this.chart.data.labels.push(this.chart.data.datasets[0].data.length);

      this.chart.update();
    });
  }

  private createChart() {
    this.ngZone.runOutsideAngular(() => {

      if (this.canvas) {
        this.el.nativeElement.removeChild(this.canvas);
      }

      // set the canvas (chartJS needs a canvas)
      this.canvas = document.createElement('canvas');
      this.canvas.style.width = '100';
      this.canvas.style.height = '24';
      this.canvas.style.display = 'inline-block';

      this.el.nativeElement.appendChild(this.canvas);

      // mock two points to start with the base fare (a single item will not plot anything)
      const data = {
        labels: [1, 2],
        datasets: [
          {
            data: [this.fare, this.fare]
          }
        ]
      };

      // create a line chart (sparkline)
      this.chart = new Chart(this.canvas, {
        type: 'line',
        data: data,
        options: {
          responsive: true,
          legend: {
            display: false
          },
          elements: {
            line: {
              borderColor: '#000000',
              borderWidth: 1
            },
            point: {
              radius: 0
            }
          },
          tooltips: {
            enabled: false
          },
          scales: {
            yAxes: [
              {
                display: false
              }
            ],
            xAxes: [
              {
                display: false
              }
            ]
          }
        }
      });

    });

  }

}
