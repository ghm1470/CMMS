import {Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewEncapsulation} from '@angular/core';
import * as XLSX from 'xlsx';
import {NumberTools} from '../../tools/numberTools';
import {Moment} from '../../shared/tools/date/moment';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

declare var $: any;

@Component({
    selector: 'app-export-file',
    templateUrl: './export-file.component.html',
    styleUrls: ['./export-file.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ExportFileComponent implements OnInit, OnChanges {

    @Input() fileDataTableList: FileDataTable[];
    @Input() entityListForReport: any[];
    @Input() titleForFile: string;
    @Input() PdfReport = true;
    @Input() ExcelReport = true;
    @Output() emitTypeForReport = new EventEmitter<any>();
    loadingForReport: boolean;

    typeForReport: string;
    loadingOpenPdf = false;

    constructor() {
    }

    ngOnInit(): void {

    }

    ngOnChanges(): void {
        setTimeout(() => {
            if (this.typeForReport === 'excel') {
                this.fireEventExcel();
            } else if (this.typeForReport === 'pdf') {
                this.openPDF();
            }
        }, 10);
        this.loadingForReport = false;
    }

    fireEventExcel() {
        const prefix = name || this.titleForFile;
        const targetTableElm = document.getElementById('htmlData');
        const wb = XLSX.utils.table_to_book(targetTableElm, {sheet: prefix} as XLSX.Table2SheetOpts);
        const name2 = NumberTools.En2Fa(Moment.convertIsoToJDateWithTime(new Date().toISOString())
            + ' -   ' + this.titleForFile + '.xlsx');

        XLSX.writeFile(wb, name2);
    }

    openPDF() {

        this.loadingOpenPdf = true;
        $('#myTable1').removeClass('myTable1');
        const imgData = document.getElementById('htmlData');
        const element = document.getElementById('reportFileDiv');
        element.appendChild(imgData);
        setTimeout(() => {
            $('#myTable1').addClass('myTable1');
        }, 0.000000001);
        html2canvas(element).then((canvas) => {

            const imgWidth = 210;
            const pageHeight = 290;
            const imgHeight = canvas.height * imgWidth / canvas.width;
            let heightLeft = imgHeight;


            const doc = new jsPDF('p', 'mm');
            let position = 0;
            const pageData = canvas.toDataURL('image/jpeg', 1.0);
            const element2 = encodeURIComponent(pageData);
            doc.addImage(element2, 'PNG', 0, position, imgWidth, imgHeight);
            doc.setLineWidth(1);
            doc.setDrawColor(255, 255, 255);
            doc.rect(0, 0, 295, 295);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                doc.addPage();
                doc.addImage(element2, 'PNG', 0, position, imgWidth, imgHeight);
                doc.setLineWidth(1);
                doc.setDrawColor(255, 255, 255);
                doc.rect(0, 0, 295, 295);
                heightLeft -= pageHeight;
            }
            const name = NumberTools.En2Fa(Moment.convertIsoToJDateWithTime(new Date().toISOString())
                + this.titleForFile + '.pdf');
            doc.save(name);
            this.loadingOpenPdf = false;
            setTimeout(() => {
                element.removeChild(imgData);
            });

        });


    }

    public EmActivityGetPageForExcel(type: string) {
        if (this.loadingForReport) {
            return;
        }
        this.loadingForReport = true;
        this.typeForReport = type;
        this.emitTypeForReport.emit(type);
    }
}

export class FileDataTable {
    thTitle: string;
    tdTitle: string;
}
