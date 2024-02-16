import {Component, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {ModalSize} from '@angular-boot/util';
import {Reading} from '../../model/reading';
import {MeteringService} from '../../../part/endpoint/metering.service';
import {takeUntilDestroyed} from '@angular-boot/core';
import {ModalUtil} from '@angular-boot/widgets';
import {isNullOrUndefined} from 'util';

@Component({
    selector: 'app-reading-view',
    templateUrl: './reading-view.component.html',
    styleUrls: ['./reading-view.component.scss']
})
export class ReadingViewComponent implements OnInit, OnDestroy, OnChanges {
    @Input() meteringId: string;
    MyModalSize = ModalSize;
    reading = new Reading.GetOne();

    constructor(private meteringService: MeteringService) {
    }

    ngOnInit() {
    }


    getReading() {
        this.meteringService.getOneReading(
            {meteringId: this.meteringId}
        ).pipe(takeUntilDestroyed(this)).subscribe((res: Reading.GetOne) => {
            this.reading = res;
            console.log('rrr', this.reading);
        });
    }

    ngOnChanges(): void {
        if (!isNullOrUndefined(this.meteringId)) {
            this.getReading();
        }
    }

    ngOnDestroy(): void {
    }

    cancelModal() {
        // this.reading = new Reading.GetOne();
        ModalUtil.hideModal('readingForViewModal');
    }
}
