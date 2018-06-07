import { Component, OnInit, OnDestroy, AfterViewInit, Input, ElementRef, NgZone, ChangeDetectionStrategy, Renderer2 } from '@angular/core';
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
    private renderer: Renderer2,
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
      this.canvas = this.renderer.createElement('canvas');

      this.renderer.setProperty(this.canvas, 'width', '100%');
      this.renderer.setProperty(this.canvas, 'height', '32');
      this.renderer.setProperty(this.canvas, 'display', 'inline-block');

      this.renderer.appendChild(this.el.nativeElement, this.canvas);

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
