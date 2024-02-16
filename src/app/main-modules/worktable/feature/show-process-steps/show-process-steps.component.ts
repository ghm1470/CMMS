import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ModalSize} from '@angular-boot/util';
import {ModalUtil} from '@angular-boot/widgets';

@Component({
    selector: 'app-show-process-steps',
    templateUrl: './show-process-steps.component.html',
    styleUrls: ['./show-process-steps.component.scss']
})
export class ShowProcessStepsComponent implements OnInit {
    @Input() activityInstanceId: string;
    @Input() submitWorkRequestTitle: string;
    MyModalSize = ModalSize;
    @Output() closeModal = new EventEmitter<boolean>();


    constructor() {
    }

    ngOnInit() {
    }

    onCloseModal() {
        this.closeModal.emit(true);
    }

    backToList() {
        ModalUtil.hideModal('showProcessStepsModal');
        // this.hideWorkRequestModal.emit(true);
    }

}
