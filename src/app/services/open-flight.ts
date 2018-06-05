export class OpenFlight {
  destination: {
    id: string;
    name: string;
    city?: string;
    country?: string;
    iataId?: string;
    icaoId?: string;
    latitude: number;
    longitude: number;
    timezone?: number;
    dst?: string;
    tzTimezone?: string;
    type?: string;
    source?: string;
  };
  plane?: {
    name: string;
    iataId: string;
    icaoId: string;
  };
  airline?: {
    id: string;
    name: string;
    alias?: string;
    iataId: string;
    icaoId?: string;
    callSign: string;
    country: string;
    active: boolean;
  };
  codeshare: boolean;
  stops: number;
  fare: number;
}
