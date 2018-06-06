import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
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

  public search: string;
  public isLoading = false;

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

  ngOnInit() {
    this.gmapService.load()
      .then((res) => {

        this.set();
        this.setMap();

      });

  }

  ngOnDestroy() {
    // Google doesn't support this.map.destroy() so actually its better
    // to instantiate the map outside the app and move it when needed
    // but for this demo i'm fine it leaks a little. Do not use in production code!
    this.cleanMarkers();
    this.google.maps.event.clearInstanceListeners(this.map);
  }

  public doStop() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.isLoading = false;
    }
  }

  public showInfo(id: string) {
    const marker = this.markers.find((m) => m.infoWindowIndex === id);
    const string = `<strong>${marker.title}</strong><br />€ ${marker.labelContent}<br />${marker.plane}`;
    this.infoWindow.setContent(string);
    this.infoWindow.open(this.map, marker);
  }

  public repositon(): void {
    // when map is created it will allready sent resize event
    if (this.markers.length === 0) {
      return;
    }

    const bounds = new this.google.maps.LatLngBounds();

    this.markers.forEach(function (marker) {
      bounds.extend(marker.getPosition());
    });

    // SET CANVAS OF MAP SO IT FITS ALL OUR POINTS
    this.map.setCenter(bounds.getCenter());
    this.map.fitBounds(bounds);

  }

  public doSearch(iataCode: string) {
    console.log(`searching for: ${iataCode}`);
    // TODO: this.setOrigin
    this.search = iataCode;

    this.cleanMarkers();
    this.retrieveData(iataCode);
  }

  private updateMarker(destination: Destination): void {

    const marker = this.markers.find((m) => m.infoWindowIndex === destination.id);

    // Google slowly paints the markers
    if (!marker || !marker.getVisible()) {
      this.showMarker(destination);
      return;
    }

    // marker.labelContent = '999';
    // THE ABOVE DIDNT WORK, LABEL IS UPDATED BUT NOT REDRAWN ... GOOGLE REMOVED ITTTTTT

    // PATCH FOR ABOVE:
    // 1 remove from our collection
    this.markers = this.markers.filter((m) => m.infoWindowIndex !== destination.id);
    // 2 remove click event
    marker.setMap(null);
    // 3 show marker with updated price again
    this.showMarker(destination);

  }

  private showMarker(destination: Destination): void {

    const coords = destination.coordinates;
    const latLng = new this.google.maps.LatLng(coords.lat, coords.lon);

    /*
    const Marker = new this.google.maps.Marker({
      position: latLng,
      map: this.map,
      title: destination.title,
      plane: destination.plane,
      label: '' + destination.price,
      infoWindowIndex: destination.id,
      icon: this.ICON,
      animation: this.google.maps.Animation.DROP
    });
    */

    const Marker = new window['MarkerWithLabel']({
      position: latLng,
      map: this.map,
      title: destination.title,
      plane: destination.plane,
      infoWindowIndex: destination.id,
      animation: this.google.maps.Animation.DROP,
      icon: this.ICON,
      labelContent: destination.price,
      labelAnchor: new this.google.maps.Point(22, 22),
      labelClass: 'c-map__marker__label',
      labelInBackground: false
    });

    // MARKER EVENT LISTENER
    this.google.maps.event.addListener(Marker, 'click', (() => this.showInfo(destination.id)));

    this.markers.push(Marker);

  }


  private setOrigin() {
    // TODO
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

    this.google.maps.event.addDomListener(window, 'resize', this.repositon());
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

  private retrieveData(origin: string) {

    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.isLoading = true;

    this.subscription = this.openFlightService.
      get(origin)
        .subscribe({
          next: ((event) => {

            const marker = this.markers.find((m) => m.infoWindowIndex === event.destination.id);

            const destination = {
              id: event.destination.id,
              title: event.destination.city + ' (' + event.destination.iataId + ')',
              price: event.fare,
              plane: event.plane.name,
              coordinates: {
                lat: event.destination.latitude,
                lon: event.destination.longitude
              }
            };

            if (!marker) {
              this.showMarker(destination);
              // TODO: reposition after specific time after first call
              if (this.markers.length <= 10) {
                this.repositon();
              }
            } else {
              this.updateMarker(destination);
            }

          }),
          error: ((err) => {
            // TODO: ???
            console.log(`Oops... ${err}`);
          }),
          complete: () => {
            // Done
            console.log('completed');
            this.isLoading = false;
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
