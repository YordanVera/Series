import { Injectable }   from '@angular/core';
import * as Rx          from 'rxjs/Rx';
import { Event }        from './event';

@Injectable()
export class EmitterService{

    private eventSource = new Rx.Subject<Event>();
    eventListen$ = this.eventSource.asObservable();

    emit(event: Event){
        this.eventSource.next(event);
    }
}