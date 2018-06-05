import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
// import { } from '@types/googlemaps';
import { Observable, Subscription } from 'rxjs';

import { GmapService } from '@dest-app/services/gmap.service';
import { OpenFlightService } from '@dest-app/services/open-flight.service';
import { OpenFlight } from '@dest-app/services/open-flight';
import { Destination } from '@dest-app/services/destination';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {

  @ViewChild('gmap') gmapElement: ElementRef;

  // reactive stream
  private subscription: Subscription;

  private google;
  private map: any; // window.google.maps.Map
  private markers: any[] = [];
  private ICON;
  private infoWindow;

  constructor(
    private gmapService: GmapService,
    private openFlightService: OpenFlightService,
  ) {

  }

  // We will create a blank map for you
  ngOnInit() {
    this.gmapService.load()
      .then((res) => {
        this.set();
        this.setMap();
      });
  }

  ngOnDestroy() {
    // Google doesn't destroy. Do not use in production code! (plot it outside component and move it)
    this.cleanMarkers();
    this.google.maps.event.clearInstanceListeners(this.map);
  }

  public doStop() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public showInfo(id: string) {
    const marker = this.markers.find((m) => m.infoWindowIndex === id);
    console.log(`show popover ${marker}`);
  }

  public doSearch(iataCode: string) {
    console.log(`searching for: ${iataCode}`);
    this.cleanMarkers();
    this.retrieveData(iataCode);
  }


  private showMarker(destination: Destination): void {
    console.log(`show marker for ${destination}`);
  }

  // we now have the google maps script and global variable available
  private set() {
    this.google = window['google'];
    this.ICON = {
      url: '/assets/img/marker.svg',
      scaledSize: new this.google.maps.Size(40, 40),
      origin: new this.google.maps.Point(0, 0),
      anchor: new this.google.maps.Point(16, 32)
    };
    this.infoWindow = new this.google.maps.InfoWindow();
  }

  private setMap() {

    const mapProp = {
      center: new this.google.maps.LatLng(52.10461, 4.27557),
      zoom: 15,
      mapTypeControl: false,
      mapTypeId: this.google.maps.MapTypeId.ROADMAP,
      streetViewControl: false
    };

    this.map = new this.google.maps.Map(this.gmapElement.nativeElement, mapProp);

  }

  private retrieveData(origin: string) {

    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.subscription = this.openFlightService.
      get(origin)
        .subscribe({
          next: ((event) => {

            // Now create something which pushes the icon to the map
            console.log('event received');
            console.log(event);

          }),
          error: ((err) => {
            // TODO: ???
            console.log(`Oops... ${err}`);
          }),
          complete: () => {
            // Done
            console.log('completed');
          },
        });
  }

  private cleanMarkers() {
    let m = this.markers.length;
    while (m--) {
      this.markers[m].setMap(null);
    }
    this.markers = [];
  }

}
