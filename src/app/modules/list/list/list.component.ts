import { Component } from '@angular/core';
import { Observable, empty as observableEmpty } from 'rxjs';

import { OpenFlightService } from '@dest-app/services/open-flight.service';
import { OpenFlight } from '@dest-app/services/open-flight';
import { Destination } from '@dest-app/services/destination';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent {

  public list$: Observable<OpenFlight[]>;
  public iataCode: string;

  constructor(
    private openFlightService: OpenFlightService,
  ) {

  }

  public doSearch(iataCode: string) {
    this.iataCode = iataCode;
    console.log(`TODO: CALL STREAM AND SUBSCRIBE FOR: ${iataCode.toUpperCase()}`);
  }

}
