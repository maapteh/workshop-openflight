import { TestBed, inject } from '@angular/core/testing';

import { OpenFlightService } from './open-flight.service';

describe('OpenFlightService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OpenFlightService]
    });
  });

  it('should be created', inject([OpenFlightService], (service: OpenFlightService) => {
    expect(service).toBeTruthy();
  }));
});
