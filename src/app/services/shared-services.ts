import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SharedServices {
    private emitChangeSource = new Subject<any>();
    isLoading$ = this.emitChangeSource.asObservable();
    message$ = this.emitChangeSource.asObservable();

    changeLoading(value: boolean) {
        this.emitChangeSource.next(value);
    }

    changeMessage(value: string) {
        this.emitChangeSource.next(value);
    }
}
