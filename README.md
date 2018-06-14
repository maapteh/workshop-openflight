![Heroku](http://heroku-badge.herokuapp.com/?app=afkl-workshop&style=flat&svg=1)
![SonarCoverage](https://sonarcloud.io/api/project_badges/measure?project=com.afklm.tecc-se.openflight.frontend&metric=coverage)
![SonarLines](https://sonarcloud.io/api/project_badges/measure?project=com.afklm.tecc-se.openflight.frontend&metric=ncloc)
![SonarGate](https://sonarcloud.io/api/project_badges/measure?project=com.afklm.tecc-se.openflight.frontend&metric=alert_status)

# Workshop "OpenFlight" by TECC-SE
> This complementary user interface belongs to the workshop material during the **Schiphol Developers Group** on June 14th 2018 @ KLM. However the workshop can be followed by anybody interested in playing with some features from [Spring's WebFlux module](https://github.com/afklm/sdd-webflux-workshop). With this user interface we are able to plot markers on a map or simply show a list. 

![overview](./internals/screens.gif "Possible endresult workshop")

*workshop is provided by TECC-SE innovation lab at [AFKLM](https://github.com/afklm)*

## A - Development server with mock backend (nodeJS)
1) `npm run dev:mock`. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files. If you want to run on another port `npm run dev:mock -- port=4444`
2) `npm start` (only departures: 'DPS', 'LAX' and 'SVO' are based on real data)

## B - Development server with real backend (Java)
1) Run your [backend server](https://github.com/afklm/sdd-webflux-workshop) and fill in your endpoint in './proxy-backend.conf.json'
2) `npm run dev:backend`. Navigate to `http://localhost:4200/`

# WORKSHOP
**When you finished your [backend](https://github.com/afklm/sdd-webflux-workshop) you can now start with the frontend (or if you don't want to make your own backend you can run the frontend mock one). You can choose between creating a 'map application' and a 'list application'.**

In the development branch we created an Angular/Rxjs scaffold where we put the service which you can use to start with.

## Service

```
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
```

### List view
Try to alter the service so it will give back the complete list as a result. When you have a listview try adding a sparkline for historical prices ([ChartJS](http://www.chartjs.org/samples/latest/charts/line/basic.html) is added by default). [example layout](./internals/docs/LIST.md)

### Map view
When you are more familiair with [Google Maps API](https://developers.google.com/maps/documentation/javascript/overlays) it will be possible to plot the markers on the Map and update them accordingly. For this you will need to know the limitations of their API (no destroy, no repaint on marker update). [help](./internals/docs/MAP.md)

*Please note that my personal key for Google Maps is used and this key is limmited on hits and in time (without any key it will not work at all). So after our workshop this key may not work anymore. Please use your own key in [environments](./src/environments/environment.ts)*

## Build
- Testing build: `npm run dev -- --port=4444 --configuration=production --prod`
- Running build `npm run build:prod`. The build artifacts will be stored in the `dist/` directory.

## Help
Simply ask the people walking or sitting near you :)

## EventSource interface background information
"The EventSource interface is web content's interface to server-sent events. An EventSource instance opens a persistent connection to an HTTP server, which sends events in text/event-stream format."
[EventSource](https://developer.mozilla.org/en-US/docs/Web/API/EventSource)
[can-i-use](https://caniuse.com/#feat=eventsource)

### Browsers
Supported by allmost al browsers but [IE](https://developer.microsoft.com/en-us/microsoft-edge/platform/status/serversenteventseventsource/), so we are using 'eventsource-polyfill' for most of them.

**Spoiler allert!!! a possible solution is in the other branch :) and online at [afkl-workshop.herokuapp.com](https://afkl-workshop.herokuapp.com)**
