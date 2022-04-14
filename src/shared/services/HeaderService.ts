import { Subject } from 'rxjs';

let _isheader = new Subject();

export const HeaderService = {

    updateHeader(state: boolean) {
       _isheader.next(state)
        console.log('inService', state)
    },
    getHeader: () => _isheader.asObservable(),
}
