import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Observable, Subscription, empty as observableEmpty, fromEvent as observableFromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { OpenFlightService } from '@dest-app/services/open-flight.service';
import { OpenFlight } from '@dest-app/services/open-flight';
import { Destination } from '@dest-app/services/destination';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements AfterViewInit, OnDestroy {

  @ViewChild('clean') stopElement: ElementRef;

  public items: OpenFlight[] = [];
  public isLoading = false;
  public iataCode: string;

  private list$: Observable<OpenFlight[]>;
  private cancel$;
  private subscription: Subscription;

  constructor(
    private openFlightService: OpenFlightService,
  ) {

  }

  ngAfterViewInit() {
    // element is visible, so usable for us
    this.cancel$ = observableFromEvent(this.stopElement.nativeElement, 'click');
  }

  ngOnDestroy() {
    // make sure to clean up our subscription
    this.destroy();
  }

  public doSearch(iataCode: string) {

    this.iataCode = iataCode;
    this.isLoading = true;

    this.destroy();

    this.list$ = this.openFlightService
      .getList(iataCode)
        .pipe(
          takeUntil(this.cancel$),
        );

    this.subscription = this.list$.subscribe({
      next: ((data) => {
        this.items = data;
        this.isLoading = false;
      }),
      error: ((err) => {
        // TODO: SHOW WE .UP
        this.isLoading = false;
      }),
      complete: () => {
        // DONE
        this.isLoading = false;
      }
    });

  }

  private destroy() {
    this.items = [];
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
