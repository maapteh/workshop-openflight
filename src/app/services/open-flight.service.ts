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

  private collection: OpenFlight[] = [];

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
          // Eventsource error
          return observer.error(error);
        }
      }));

      return () => eventSource.close();
    });

  }

  // Only for the demonstration
  getList(origin: string): Observable<OpenFlight[]> {

    const url = `${environment.api}/offers/${origin}`;

    this.collection = [];

    return Observable.create((observer) => {

      const eventSource = new window['EventSource'](url);

      eventSource.onmessage = ((event) => this.ngZone.run(() => {
        const json = JSON.parse(event.data);

        const id = json.destination.id;
        const foundIndex = this.collection.findIndex(x => x.destination.id === id);

        if (foundIndex === -1) {
          this.collection.push(json);
        } else {
          // only plane and fare can be updated from stream
          this.collection[foundIndex].fare = json.fare;
          this.collection[foundIndex].plane = json.plane;
        }

        return observer.next(this.collection);
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
}
