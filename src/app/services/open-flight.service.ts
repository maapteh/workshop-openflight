import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '@dest-env/environment';
import { Destination } from './destination';
import { OpenFlight } from './open-flight';

@Injectable({
  providedIn: 'root',
})
export class OpenFlightService {

  constructor(
    private ngZone: NgZone,
  ) {}

  get(origin: string): Observable<OpenFlight> {

    const url = `${environment.api}/offers/${origin}`;

    return Observable.create((observer) => {

      const eventSource = new window['EventSource'](url);

      eventSource.onmessage = ((event) => this.ngZone.run(() => {
        const json = JSON.parse(event.data);
        return observer.next(json);
      }));

      eventSource.onerror = ((error) => this.ngZone.run(() => {
        if (eventSource.readyState === 0) {
          eventSource.close();
          return observer.complete();
        } else {
          return observer.error('EventSource error: ' + error);
        }
      }));

      return () => eventSource.close();
    });

  }

  // TODO: FOR LIST VIEW CREATE AN Observable<OpenFlight[]> method

}
