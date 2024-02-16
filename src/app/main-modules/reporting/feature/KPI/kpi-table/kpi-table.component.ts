import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {KpiTableDTO} from '../../../model/kpi-table-DTO';
import {Moment} from '../../../../../shared/shared/tools/date/moment';
import {DefaultNotify} from '@angular-boot/util';
import {KpiTableService} from '../../../endpoint/kpi-table.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import {NumberTools} from '../../../../../shared/tools/numberTools';
import {NotiConfig} from '../../../../../shared/tools/notifyConfig';

declare var $: any;

@Component({
    selector: 'app-kpi-table',
    templateUrl: './kpi-table.component.html',
    styleUrls: ['./kpi-table.component.scss']
})
export class KPITableComponent implements OnInit, AfterViewInit {

    constructor(private kpiTableService: KpiTableService) {
    }

    loading: boolean;
    entityList: KpiTableDTO.TableModel[] = [];
    @ViewChild('htmlData', {static: false}) htmlData: ElementRef;
    @ViewChild('table', {static: false}) table: ElementRef;

    dateFrom: any;
    dateUntil: any;
    moment = Moment;

    avgMtbf = null;
    avgMttr = null;
    avgMdt = null;

    loadingOpenPdf = false;

    sortType = 1;

    ngOnInit(): void {
    }

    public ngAfterViewInit(): void {
        this.setJqueryDate();
    }

    setJqueryDate() {
        const d = null;
        setTimeout(e1 => {

            $('#dateFrom').azPersianDateTimePicker({
                Placement: 'left', // default is 'bottom'
                Trigger: 'focus', // default is 'focus',
                enableTimePicker: false, // default is true,
                TargetSelector: '', // default is empty,
                GroupId: '', // default is empty,
                ToDate: false, // default is false,
                FromDate: false, // default is false,
                targetTextSelector: $('#dateFrom'),
                disableBeforeToday: false,
                disableAfterToday: true,
                textFormat: 'yyyy/MM/dd',
            }).on('change', (e) => {
                this.dateFrom = $(e.currentTarget).val();
            });
            $('#dateUntil').azPersianDateTimePicker({
                Placement: 'left', // default is 'bottom'
                Trigger: 'focus', // default is 'focus',
                enableTimePicker: false, // default is true,
                TargetSelector: '', // default is empty,
                GroupId: '', // default is empty,
                ToDate: false, // default is false,
                FromDate: false, // default is false,
                targetTextSelector: $('#dateUntil'),
                disableBeforeToday: false,
                disableAfterToday: true,
                textFormat: 'yyyy/MM/dd',
            }).on('change', (e) => {
                this.dateUntil = $(e.currentTarget).val();
            });
        }, 10);

    }

    dateChek() {
        if (!this.dateFrom || !this.dateUntil) {
            DefaultNotify.notifyDanger('بازه زمانی  انتخاب  شود.', '', NotiConfig.notifyConfig);
            return false;
        }
        if (this.dateFrom > this.dateUntil) {
            DefaultNotify.notifyDanger('بازه زمانی درست انتخاب نشده است.', '', NotiConfig.notifyConfig);
            return false;
        }
        return true;

    }

    public search() {
        if (this.dateChek()) {
            const kpiTableDTO = new KpiTableDTO.GetDto();
            kpiTableDTO.from = this.moment.convertJaliliToGregorian(this.dateFrom);
            kpiTableDTO.from = kpiTableDTO.from.replaceAll('/', '-') + 'T00:00:00.000Z';
            kpiTableDTO.until = this.moment.convertJaliliToGregorian(this.dateUntil);
            kpiTableDTO.until = kpiTableDTO.until.replaceAll('/', '-') + 'T23:59:59.000Z';
            this.mtbfTable(kpiTableDTO);
        }

    }

    mtbfTable(kpiTableDTO) {
        this.loading = true;
        this.kpiTableService.mtbfTable(kpiTableDTO).subscribe((res: any) => {
            this.loading = false;
            this.entityList = res as KpiTableDTO.TableModel[];
            this.scrollTop();
            this.mttrTable(kpiTableDTO);

        }, error => {
            this.loading = false;
        });
    }

    mttrTable(kpiTableDTO) {
        this.loading = true;
        this.kpiTableService.mttrTable(kpiTableDTO).subscribe((res: KpiTableDTO.MttrTableReturn[]) => {
            this.loading = false;
            if (res.length > 0) {
                for (const entity of this.entityList) {
                    const rF = res.find(r => r.assetId === entity.assetId);
                    if (rF) {
                        entity.mttr = rF.mttr;
                    }
                }
            }
            this.mdtTable(kpiTableDTO);

            // setTimeout(e => {
            //     this.setAverage();
            // }, 100);
        }, error => {
            this.loading = false;
        });
    }

    mdtTable(kpiTableDTO) {
        this.loading = true;
        this.kpiTableService.mdtTable(kpiTableDTO).subscribe((res: KpiTableDTO.MdtTableReturn[]) => {
            this.loading = false;
            if (res.length > 0) {
                for (const entity of this.entityList) {
                    const rF = res.find(r => r.assetId === entity.assetId);
                    if (rF) {
                        entity.mdt = rF.mdt;
                    }
                }
            }
            setTimeout(e => {
                this.setAverage();
            }, 100);
        }, error => {
            this.loading = false;
            setTimeout(e => {
                this.setAverage();
            }, 100);
        });
    }

    setAverage() {
        let countMtbf = 0;
        let sumMtbf = 0;
        let countMttr = 0;
        let sumMttr = 0;
        let countMdt = 0;
        let sumMdt = 0;
        for (const entity of this.entityList) {
            if (entity.mtbf) {
                countMtbf++;
                sumMtbf += entity.mtbf;
            }
            if (entity.mttr) {
                countMttr++;
                sumMttr += entity.mttr;
            }
            if (entity.mdt) {
                countMdt++;
                sumMdt += entity.mdt;
            }
        }
        if (countMtbf > 0) {
            this.avgMtbf = Math.floor(sumMtbf / countMtbf);
        }
        if (countMttr > 0) {
            this.avgMttr = Math.floor(sumMttr / countMttr);
        }
        if (countMdt > 0) {
            this.avgMdt = Math.floor(sumMdt / countMdt);
        }
    }

    openPDF() {

        this.loadingOpenPdf = true;
        $('#myTable').removeClass('myTable');
        const imgData = document.getElementById('htmlData');
        setTimeout(() => {
            $('#myTable').addClass('myTable');
        }, 0.000000001);

        html2canvas(imgData).then((canvas) => {

            const imgWidth = 210;
            const pageHeight = 290;
            const imgHeight = canvas.height * imgWidth / canvas.width;
            let heightLeft = imgHeight;


            const doc = new jsPDF('p', 'mm');
            let position = 0;
            const pageData = canvas.toDataURL('image/jpeg', 1.0);
            const imgData = encodeURIComponent(pageData);
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
            const name = NumberTools.En2Fa(Moment.convertIsoToJDateWithTime(new Date().toISOString())
                + ' - جدول شاخص قابلیت اطمینان  ' + '.pdf');
            doc.save(name);
            this.loadingOpenPdf = false;


        });


    }

// <!--        const DATA = document.getElementById('htmlData');-->
//
// <!--        html2canvas(DATA).then(canvas => {-->
//
// <!--            const fileWidth = 208;-->
// <!--            const fileHeight = canvas.height * fileWidth / canvas.width;-->
// <!--            const FILEURI = canvas.toDataURL('image/png');-->
// <!--            const PDF = new jsPDF('p', 'mm', 'a4');-->
// <!--            const position = 0;-->
// <!--            PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);-->
// <!--            const name = NumberTools.En2Fa(Moment.convertIsoToJDateWithTime(new Date().toISOString()) + ' - جدول شاخص قابلیت اطمینان  ' + '.pdf');-->
// <!--            PDF.save(name);-->
// <!--        });-->
//     // }


    fireEvent() {
        const prefix = name || 'جدول شاخص قابلیت اطمینان ';
        const targetTableElm = document.getElementById('htmlData');
        const wb = XLSX.utils.table_to_book(targetTableElm, {sheet: prefix} as XLSX.Table2SheetOpts);
        const name2 = NumberTools.En2Fa(Moment.convertIsoToJDateWithTime(new Date().toISOString())
            + ' - جدول شاخص قابلیت اطمینان  ' + '.xlsx');

        XLSX.writeFile(wb, name2);
    }

    sort(type) {
        if (this.sortType === 1) {
            this.sortType = 0;
            if (type === 'assetCode') {
                this.entityList = this.entityList.sort((a, b) => this.naturalCompare(a.assetCode, b.assetCode));
            }
            if (type === 'assetName') {
                this.entityList = this.entityList.sort((a, b) => this.naturalCompare(a.assetName, b.assetName));
            }
            if (type === 'MTBF') {
                this.entityList = this.entityList.sort((a, b) => (b.mtbf - a.mtbf));
            }
            if (type === 'MTTR') {
                this.entityList = this.entityList.sort((a, b) => (b.mttr - a.mttr));
            }
            if (type === 'MDT') {
                this.entityList = this.entityList.sort((a, b) => (b.mdt - a.mdt));
            }
            if (type === 'failureDuration') {
                this.entityList = this.entityList.sort((a, b) => (b.failureDuration - a.failureDuration));
            }

            if (type === 'repairDuration') {
                this.entityList = this.entityList.sort((a, b) => (b.repairDuration - a.repairDuration));
            }
            if (type === 'count') {
                this.entityList = this.entityList.sort((a, b) => (b.count - a.count));
            }

        } else {
            this.sortType = 1;
            if (type === 'assetCode') {
                this.entityList = this.entityList.sort((a, b) => this.naturalCompare(b.assetCode, a.assetCode));
            }
            if (type === 'assetName') {
                this.entityList = this.entityList.sort((a, b) => this.naturalCompare(b.assetName, a.assetName));
            }
            if (type === 'MTBF') {
                this.entityList = this.entityList.sort((a, b) => (a.mtbf - b.mtbf));
            }
            if (type === 'MTTR') {
                this.entityList = this.entityList.sort((a, b) => (a.mttr - b.mttr));
            }
            if (type === 'MDT') {
                this.entityList = this.entityList.sort((a, b) => (a.mdt - b.mdt));
            }
            if (type === 'failureDuration') {
                this.entityList = this.entityList.sort((a, b) => (a.failureDuration - b.failureDuration));
            }

            if (type === 'repairDuration') {
                this.entityList = this.entityList.sort((a, b) => (a.repairDuration - b.repairDuration));
            }
            if (type === 'count') {
                this.entityList = this.entityList.sort((a, b) => (a.count - b.count));
            }
        }
    }

    naturalCompare(a, b) {
        const ax = [], bx = [];

        a.replace(/(\d+)|(\D+)/g, function(_, $1, $2) {
            ax.push([$1 || Infinity, $2 || '']);
        });
        b.replace(/(\d+)|(\D+)/g, function(_, $1, $2) {
            bx.push([$1 || Infinity, $2 || '']);
        });

        while (ax.length && bx.length) {
            const an = ax.shift();
            const bn = bx.shift();
            const nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
            if (nn) { return nn; }
        }

        return ax.length - bx.length;
    }

    scrollTop() {
        $('#content').animate({
            scrollTop: $(window).height()
        }, 1200);
    }
}

