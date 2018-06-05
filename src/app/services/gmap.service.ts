import { Injectable } from '@angular/core';
import { environment } from '@dest-env/environment';

@Injectable({
  providedIn: 'root'
})
export class GmapService {

  private static promise;

  constructor() {
  }

  public load(): Promise<any> {

    if (!GmapService.promise) {

      const globalCallback = '__onGoogleLoaded';
      const url = `http://maps.googleapis.com/maps/api/js?callback=${globalCallback}&key=${environment.gmapKey}`;
      const markers = '/assets/marker.js';

      GmapService.promise = new Promise((resolve) => {

        window[globalCallback] = (event: any) => {
          resolve('loaded');
        };

        this.addScript(url);
        this.addScript(markers);

      });
    }

    // can be called multiple times, be sure to execute it once
    return GmapService.promise;

  }

  private addScript(url: string) {
    const node = document.createElement('script');
    node.src = url;
    node.type = 'text/javascript';
    node.async = false;
    document.getElementsByTagName('head')[0].appendChild(node);
  }
}
