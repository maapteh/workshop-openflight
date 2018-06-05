import { Component, OnInit, OnDestroy, ElementRef, ViewChild, Output, EventEmitter, HostBinding } from '@angular/core';
import { fromEvent as observableFromEvent } from 'rxjs';
import { map, filter, debounceTime, distinctUntilChanged } from 'rxjs/operators';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  @ViewChild('departure') departureElement: ElementRef;

  @Output() iata: EventEmitter<string> = new EventEmitter<string>();

  @HostBinding('class.is-open') isOpen = false;

  constructor() { }

  public ngOnInit() {
    observableFromEvent(this.departureElement.nativeElement, 'keyup')
    .pipe(
      map((event: any) => event.target.value),
      filter((res) => res.length >= 2),
      debounceTime(600),
      distinctUntilChanged(),
    )
    .subscribe((text: string) => this.doSearch(text));
  }

  public toggleOpen() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.departureElement.nativeElement.focus();
    }
  }

  private doSearch(text: string) {
    this.iata.emit(text);
  }

}
