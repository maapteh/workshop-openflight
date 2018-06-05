# Map view

## HELPERS

To plot a marker you can use this extended version which can display the label nicer then Google does. The library is available in this application.

```
  const latLng = new this.google.maps.LatLng(coords.lat, coords.lon);

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
```
