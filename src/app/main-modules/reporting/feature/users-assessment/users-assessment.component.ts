import {Component, OnInit} from '@angular/core';
import {TechnicianAssessmentService} from "../../../submitWorkRequest/endpoint/technician-assessment.service";
import {UserAssessment} from "../../model/user-assessmentDto";
import {UserDto} from "../../../user/model/dto/user-dto";
import {UserService} from "../../../user/endpoint/user.service";
import {ModalUtil} from "@angular-boot/widgets";
import {DefaultNotify, ModalSize} from "@angular-boot/util";
import {NotiConfig} from "../../../../shared/tools/notifyConfig";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {NumberTools} from "../../../../shared/tools/numberTools";
import {Moment} from "../../../../shared/shared/tools/date/moment";
import * as XLSX from "xlsx";

@Component({
    selector: 'app-users-assessment',
    templateUrl: './users-assessment.component.html',
    styleUrls: ['./users-assessment.component.scss']
})
export class UsersAssessmentComponent implements OnInit {
    entityList: UserAssessment.TechnicianAveragePointDTO[] = [];
    userList: UserDto.GetUserWithUserType[] = [];

    constructor(private entityService: TechnicianAssessmentService,
                private userService: UserService,
    ) {
    }

    ngOnInit(): void {
        this.getUserWithUserType();
        this.averagePointOfPersonnel();
    }

    loadingGetUsers = false;
    selectedUserId = 'ALL';

    getUserWithUserType() {
        this.loadingGetUsers = true;
        this.userService.getUserWithUserType().subscribe((res: UserDto.GetUserWithUserType[]) => {
            this.loadingGetUsers = false;

            if (res) {
                this.userList = res;
                for (const user of this.userList) {
                    user.name = user.name + ' ' + user.family + ' - ' + user.userTypeName;
                }
                const u = new UserDto.GetUserWithUserType();
                u.name = ' همه ی کاربران';
                u.id = 'ALL';
                this.userList.unshift(u);
            }
        }, error => {
            this.loadingGetUsers = false;
        });
    }

    loading = false;

    averagePointOfPersonnel(id?) {
        let userId = null;
        if (id !== 'ALL') {
            userId = id;
        }
        this.loading = true;
        this.entityList = [];
        this.entityService.averagePointOfPersonnel({userId}).subscribe((res: UserAssessment.TechnicianAveragePointDTO[]) => {
            this.loading = false;
            if (res.length > 0) {
                this.entityList = res;
            } else {
                DefaultNotify.notifyDanger('نتیجه ای یافت نشد.', '', NotiConfig.notifyConfig);
            }
        }, error => {
            this.loading = false;

        });
    }

    showModalBody = false;
    modalId = ModalUtil.generateModalId();
    MyModalSize = ModalSize;

    showDetail(item: UserAssessment.TechnicianAveragePointDTO) {

    }


    loadingOpenPdf = false;

    openPDF() {

        this.loadingOpenPdf = true;
        var imgData = document.getElementById('htmlData');


        html2canvas(imgData).then((canvas) => {

            var imgWidth = 210;
            var pageHeight = 290;
            var imgHeight = canvas.height * imgWidth / canvas.width;
            var heightLeft = imgHeight;


            var doc = new jsPDF('p', 'mm');
            var position = 0;
            var pageData = canvas.toDataURL('image/jpeg', 1.0);
            var imgData = encodeURIComponent(pageData);
            doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            doc.setLineWidth(5);
            doc.setDrawColor(255, 255, 255);
            doc.rect(0, 0, 210, 295);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                doc.addPage();
                doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                doc.setLineWidth(5);
                doc.setDrawColor(255, 255, 255);
                doc.rect(0, 0, 210, 295);
                heightLeft -= pageHeight;
            }
            const name = NumberTools.En2Fa(Moment.convertIsoToJDateWithTime(new Date().toISOString()) + ' - جدول ارزیابی پرسنل  ' + '.pdf');
            doc.save(name);
            this.loadingOpenPdf = false;


        });


    }

    fireEvent() {
        let prefix = name || "جدول ارزیابی پرسنل ";
        let targetTableElm = document.getElementById('htmlData');
        let wb = XLSX.utils.table_to_book(targetTableElm, <XLSX.Table2SheetOpts>{sheet: prefix});
        const name2 = NumberTools.En2Fa(Moment.convertIsoToJDateWithTime(new Date().toISOString()) + ' - جدول ارزیابی پرسنل  ' + '.xlsx');

        XLSX.writeFile(wb, name2);
    }

    sortType = 1;

    sort(type) {
        if (this.sortType === 1) {
            this.sortType = 0;
            if (type === 'name') {
                this.entityList = this.entityList.sort((a, b) =>
                    this.naturalCompare(a.userName && a.userFamily, b.userName && b.userFamily));
            }
            if (type === 'average') {
                this.entityList = this.entityList.sort((a, b) => (b.average - a.average));
            }
        } else {
            this.sortType = 1;
            if (type === 'name') {
                this.entityList = this.entityList.sort((a, b) =>
                    this.naturalCompare(b.userName && b.userFamily, a.userName && a.userFamily));
            }
            if (type === 'average') {
                this.entityList = this.entityList.sort((a, b) => (a.average - b.average));
            }
        }
    }

    naturalCompare(a, b) {
        var ax = [], bx = [];

        a.replace(/(\d+)|(\D+)/g, function (_, $1, $2) {
            ax.push([$1 || Infinity, $2 || ""])
        });
        b.replace(/(\d+)|(\D+)/g, function (_, $1, $2) {
            bx.push([$1 || Infinity, $2 || ""])
        });

        while (ax.length && bx.length) {
            var an = ax.shift();
            var bn = bx.shift();
            var nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
            if (nn) return nn;
        }

        return ax.length - bx.length;
    }
}
