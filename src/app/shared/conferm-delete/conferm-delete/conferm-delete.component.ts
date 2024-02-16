import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ModalSize} from "@angular-boot/util";

declare var $: any;

@Component({
    selector: 'app-conferm-delete',
    templateUrl: './conferm-delete.component.html',
    styleUrls: ['./conferm-delete.component.scss']
})
export class ConfermDeleteComponent implements OnInit {

    MyModalSize = ModalSize;
    @Input('title') title: string;
    @Input('modalId') modalId: string;
    @Input('loading') loading: boolean;
    @Output('value') private value = new EventEmitter<boolean>();
    @Output('onClose') private onClose = new EventEmitter<boolean>();

    constructor() {
    }

    ngOnInit() {
    }

    conferm(val: boolean) {
        this.value.emit(val);
    }

    onCloseEmit() {
        this.onClose.emit(true);

    }
}
