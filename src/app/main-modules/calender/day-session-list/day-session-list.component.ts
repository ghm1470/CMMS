import {Component, OnInit} from '@angular/core';
import {isNullOrUndefined, ModalSize} from '@angular-boot/util';
import {ModalUtil} from '@angular-boot/widgets';
import {MeetingDto} from "../model/meeting-dto";
import {Moment} from "../../../shared/tools/date/moment";

@Component({
    selector: 'app-day-session-list',
    templateUrl: './day-session-list.component.html',
    styleUrls: ['./day-session-list.component.scss']
})
export class DaySessionListComponent implements OnInit {
    selectedDay = new MeetingDto.SessionDay();
    MyModalSize = ModalSize;
    MyMoment = Moment;
    selectedSession: MeetingDto.SessionGetOn;

    constructor() {

    }

    ngOnInit(): void {
        const selectedDay = sessionStorage.getItem('selectedDay');
        if (isNullOrUndefined(selectedDay)) {
            this.selectedDay = JSON.parse(selectedDay);
            console.log(this.selectedDay);
        }

    }

    back(): void {
        window.history.back();
    }

    showSessionDetail(session): void {

        // this.managementMeetingService.getOne({id: session.id}).subscribe((res: any) => {
        //   if (res) {
        //     if (res.data) {
        //       this.selectedSession = res.data;
        //       setTimeout(e => {
        //         ModalUtil.showModal('showSessionDetailModal');
        //       }, 10);
        //     }
        //   }
        // });


    }
}
