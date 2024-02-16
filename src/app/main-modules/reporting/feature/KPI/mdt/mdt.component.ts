import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AssetService} from '../../../../asset/endpoint/asset.service';
import {ChartDataSets, ChartLineOptions, ChartOptions} from 'chart.js';
import {Color, Label} from 'ng2-charts';
import {NumberTools} from '../../../../../shared/tools/numberTools';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import {Moment} from '../../../../../shared/shared/tools/date/moment';
import {AssetDto} from '../../../../asset/model/dto/assetDto';
import {takeUntilDestroyed} from '@angular-boot/core';
import {DefaultNotify} from '@angular-boot/util';
import {NotiConfig} from '../../../../../shared/tools/notifyConfig';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {MdtDTO} from '../../../model/mdtDTO';
import {MdtService} from '../../../endpoint/mdt.service';
import {CategoryDto} from "../../../../category/model/dto/categoryDto";
import CategoryType = CategoryDto.CategoryType;

declare var $: any;

@Component({
    selector: 'app-mdt',
    templateUrl: './mdt.component.html',
    styleUrls: ['./mdt.component.scss']
})
export class MdtComponent implements AfterViewInit, OnInit, OnDestroy {
    constructor(private entityService: MdtService,
                public assetService: AssetService,
    ) {
    }

    title = 'MDT';
    @ViewChild('htmlData', {static: false}) htmlData: ElementRef;

    width = 200;

    // Array of different segments in chart
    lineChartData: ChartDataSets[] = [
        {data: [], label: '', lineTension: 0},
        // {data: [28, 48, 40, 19, 86, 27, 90], label: 'Product B', steppedLine: true},

    ];
    // Labels shown on the x-axis
    lineChartLabels: Label[] = [];

    // Define chart options
    ChartLineOptions: ChartLineOptions = {
        fill: false,
        capBezierPoints: false,
    };
    lineChartOptions: ChartOptions = {
        // maintainAspectRatio: false,
        legend: {
            labels: {
                fontFamily: 'IRANSansWeb-farsi',
                // fontColor: 'white'
            },
        },
        responsive: true,
        scales: {
            yAxes: [
                {
                    ticks: {
                        beginAtZero: true,
                        max: 24
                    },
                },
            ],
        },
        title: {
            display: false,
            // text: this.totalTitle + this.total
        },
        tooltips: {
            callbacks: {
                label(tooltipItem, chart) {
                    // let datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
                    let result;
                    if (tooltipItem.yLabel.toString().split('.')[1]) {
                        const v = tooltipItem.yLabel.toString().split('.')[1];
                        if (v.length === 1) {
                            result = NumberTools.En2Fa((tooltipItem.yLabel.toString().split('.')[0]) +
                                ':' + (tooltipItem.yLabel.toString().split('.')[1]) + '0');
                        } else {

                            result = NumberTools.En2Fa((tooltipItem.yLabel.toString().split('.')[0]) +
                                ':' + (tooltipItem.yLabel.toString().split('.')[1]));
                        }
                    } else {
                        result = NumberTools.En2Fa((tooltipItem.yLabel.toString().split('.')[0]) + ' : 00');

                    }
                    return result;
                    // return datasetLabel + ': ' +
                    //     (tooltipItem.yLabel.toString().split('.')[0]) + ':' +
                    //     (tooltipItem.yLabel.toString().split('.')[1]);
                }
            }
        }

    };

    // Define colors of chart segments
    lineChartColors: Color[] = [

        {
            // backgroundColor: 'rgba(255,0,0,0.3)',
            // borderColor: 'red',
            // pointBackgroundColor: 'rgba(148,159,177,1)',
            // pointBorderColor: '#fff',
            // pointHoverBackgroundColor: '#fff',
            // pointHoverBorderColor: 'rgba(148,159,177,0.8)'
            // dark grey
            // backgroundColor: '#ffffff00',
            backgroundColor: '#ffffff00',
            pointRadius: 5,
            pointHoverRadius: 10,
            pointBackgroundColor: '#4986d1',
            // borderColor: 'rgba(77,83,96,1)',
            borderColor: '#5f94d4',
        },
        { // red
            // backgroundColor: 'rgba(255,0,0,0.3)',
            // borderColor: 'red',
        }
    ];

    // Set true to show legends
    lineChartLegend = true;

    // Define type of chart
    lineChartType = 'line';

    lineChartPlugins1 = [pluginDataLabels];
    lineChartPlugins = [
        {
            afterDraw(chart, options) {

                const controller = chart.controller;
                const axis = controller.scales['y-axis-0'];
                const ctx = chart.ctx;

                const labelToStyle = null;

                axis._labelItems.forEach(function (value, index) {

                    const labelToStyle = value;
                    const textWidth = ctx.measureText(labelToStyle.label).width;
                    const line_x_start = labelToStyle.x - textWidth;
                    const line_y = labelToStyle.y + (labelToStyle.font.size / 2) + 3;

                    ctx.lineWidth = 3;
                    // ctx.strokeStyle = 'orange';
                    ctx.beginPath();
                    ctx.moveTo(line_x_start, line_y);
                    ctx.lineTo(labelToStyle.x, line_y);
                    ctx.stroke();
                });

            }
        }
    ];

    dateFrom: any;
    dateUntil: any;
    moment = Moment;

    dateRangeList = [];
    selectedRange: string;
    selectedAssetId: string;

    assetList: AssetDto.CreateAsset[] = [];
    showChart = true;

    loading = false;

    diffDays: number;

    ngOnInit() {
        this.getAssetList();
    }

    getAssetList() {
        this.assetService.getAll().pipe(takeUntilDestroyed(this))
            .subscribe((res: AssetDto.CreateAsset[]) => {
                if (res && res.length) {
                    this.assetList = res;
                    this.assetList = this.assetList.filter(a => a.categoryType === CategoryType[CategoryType.FACILITY.toString()]);
                    const newAsset = new AssetDto.CreateAsset();
                    newAsset.id = 'null';
                    newAsset.name = 'همه دستگاهها';
                    this.assetList.unshift(newAsset);
                }


            });
    }

    changeAssetAndRange() {
        if (this.selectedAssetId && this.dateFrom && this.dateUntil && this.selectedRange) {
            this.mdtCalculation();
        }
    }

    mdtCalculation() {
        if (!this.selectedAssetId) {
            DefaultNotify.notifyDanger('   دستگاه انتخاب  شود.', '', NotiConfig.notifyConfig);
            return;
        }
        if (!this.dateFrom) {
            DefaultNotify.notifyDanger('   از تاریخ انتخاب  شود.', '', NotiConfig.notifyConfig);
            return;
        }
        if (!this.dateUntil) {
            DefaultNotify.notifyDanger('   تا تاریخ انتخاب  شود.', '', NotiConfig.notifyConfig);
            return;
        }
        if (!this.selectedRange) {
            DefaultNotify.notifyDanger('   دوره انتخاب  شود.', '', NotiConfig.notifyConfig);
            return;
        }
        if (!this.dateFrom || !this.dateUntil) {
            DefaultNotify.notifyDanger('بازه زمانی  انتخاب  شود.', '', NotiConfig.notifyConfig);
            return;
        }
        if (this.dateFrom > this.dateUntil) {
            DefaultNotify.notifyDanger('بازه زمانی درست انتخاب نشده است.', '', NotiConfig.notifyConfig);
            return;
        }
        const dto = new MdtDTO.MdtCalculationDto();
        dto.from = this.moment.convertJaliliToGregorian(this.dateFrom);
        dto.from = dto.from.replaceAll('/', '-') + 'T00:00:00.000Z';
        dto.until = this.moment.convertJaliliToGregorian(this.dateUntil);
        dto.until = dto.until.replaceAll('/', '-') + 'T23:59:59.000Z';
        dto.range = 'daily';
        if (this.selectedAssetId !== 'null') {
            dto.assetId = this.selectedAssetId;
        }
        this.loading = true;
        this.entityService.mdtCalculation(dto).subscribe((res: MdtDTO.MdtCalculationResDto[]) => {
            this.loading = false;
            if (res) {
                this.lineChartLabels = [];
                this.lineChartData[0].data = [];
                // this.lineChartData[0].label = this.assetList.find(e => e.id === this.selectedAssetId).name;
                this.lineChartData[0].label = 'mdt';
                if (res.length > 0) {
                    this.setChartData(res);

                } else {
                    DefaultNotify.notifyDanger('خرابی برای این دستگاه در این بازه زمانی ثبت نگردیده است.', '', NotiConfig.notifyConfig);
                }
            }
        }, error => {
            this.loading = false;
        });
    }

    setChartData(res: MdtDTO.MdtCalculationResDto[]) {

        // this.width = 200;
        // if (res.length > 12) {
        //     this.width = this.width * (lineChartLabels.length / 2);
        // }
        const lineChartLabels = [''];
        const lineChartData: any[] = [0];
        if (this.selectedRange === 'daily') {

            for (let i = 0; i < this.diffDays + 1; i++) {
                const d = new Date(this.moment.convertJaliliToIsoDate(this.dateFrom)).setHours(24 * i);
                const dJ = this.moment.getJaliliDateFromIso(d);
                if (NumberTools.En2Fa(dJ) > this.dateUntil) {
                    break;
                }
                if (dJ >= this.moment.getJaliliDateFromIso(res[0].failureDate)) {
                    lineChartLabels.push(dJ);
                    lineChartData.push(0);
                    for (const r of res) {
                        // const rD = this.moment.getJaliliDateFromIso(this.moment.convertGregorianToIsoDate(r.date.replace('-', '/')));
                        const rD = this.moment.getJaliliDateFromIso(r.failureDate);
                        if (rD === dJ) {
                            console.log('rD===dJ', rD + '-----' + dJ);
                            const n = Math.floor(r.mdt / 60);
                            const mode = r.mdt % 60;
                            let nn;
                            if (mode < 10) {
                                nn = n + '.0' + Math.floor(mode);
                            } else {
                                nn = n + '.' + Math.floor(mode);
                            }
                            const index = lineChartLabels.findIndex(l => l === rD);
                            if (index !== -1) {
                                lineChartData[index] = +nn;
                            }
                        }
                    }
                }
            }
            const sortLineChartData = JSON.parse(JSON.stringify(lineChartData));
            sortLineChartData.sort(function (a, b) {
                return a - b;
            });
            console.log('sortLineChartData', sortLineChartData);
            // this.lineChartOptions.scales.yAxes[0].ticks.max = sortLineChartData[sortLineChartData.length - 1] + 1;
            if (sortLineChartData[sortLineChartData.length - 1] < 6) {

                this.lineChartOptions.scales.yAxes[0].ticks.max = 6;
            } else if (sortLineChartData[sortLineChartData.length - 1] > 6 && sortLineChartData[sortLineChartData.length - 1] < 12) {
                this.lineChartOptions.scales.yAxes[0].ticks.max = 12;

            } else if (sortLineChartData[sortLineChartData.length - 1] > 12) {
                this.lineChartOptions.scales.yAxes[0].ticks.max = 24;

            }

        }
        if (this.selectedRange === 'monthly') {
            for (let i = 0; i < this.diffDays + 1; i++) {
                const d = new Date(this.moment.convertJaliliToIsoDate(this.dateFrom)).setHours(24 * i);
                let dJ = this.moment.getJaliliDateFromIso(d);
                if (NumberTools.En2Fa(dJ) > this.dateUntil) {
                    break;
                }
                if (dJ >= this.moment.getJaliliDateFromIso(res[0].failureDate)) {
                    dJ = dJ.split('/')[0] + '/' + dJ.split('/')[1];
                    if (!lineChartLabels.some(l => l === dJ)) {
                        lineChartLabels.push(dJ);
                        // lineChartData.push(24 * 30);
                        lineChartData.push(0);
                    }

                    let count = 0;
                    let failureDuration = 0;
                    for (const r of res) {
                        // const rD = this.moment.convertIsoToJDateYM(this.moment.convertGregorianToIsoDate(r.date.replace('-', '/')));
                        const rD = this.moment.convertIsoToJDateYM(r.failureDate).toString();
                        if (rD === dJ) {
                            count += r.count;
                            failureDuration += r.failureDuration;
                            const index = lineChartLabels.findIndex(l => l === rD);
                            if (index !== -1) {
                                lineChartData[index] = 0;
                            }
                        }
                    }
                    for (const r of res) {
                        const rD = this.moment.convertIsoToJDateYM(r.failureDate).toString();
                        console.log('rD===dJ', rD + '-----' + dJ);
                        if (rD === dJ) {
                            console.log('rD=....==dJ', rD + '-----' + dJ);
                            const index = lineChartLabels.findIndex(l => l === rD);
                            if (index !== -1) {

                                // const m = ((720 * 60) - (failureDuration)) / count;
                                const m = ((failureDuration)) / count;
                                const n = Math.floor(m / 60);
                                const mode = m % 60;
                                let nn;
                                if (mode < 10) {
                                    nn = n + '.0' + Math.floor(mode);
                                } else {
                                    nn = n + '.' + Math.floor(mode);
                                }
                                lineChartData[index] = +nn;

                                break;
                            }
                        }
                    }
                }
            }
            const sortLineChartData = JSON.parse(JSON.stringify(lineChartData));
            sortLineChartData.sort(function (a, b) {
                return a - b;
            });
            console.log('sortLineChartData', sortLineChartData);
            // this.lineChartOptions.scales.yAxes[0].ticks.max = sortLineChartData[sortLineChartData.length - 1] + 1;
            if (sortLineChartData[sortLineChartData.length - 1] < 6) {

                this.lineChartOptions.scales.yAxes[0].ticks.max = 6;
            } else if (sortLineChartData[sortLineChartData.length - 1] > 6 && sortLineChartData[sortLineChartData.length - 1] < 12) {
                this.lineChartOptions.scales.yAxes[0].ticks.max = 12;

            } else if (sortLineChartData[sortLineChartData.length - 1] > 12 && sortLineChartData[sortLineChartData.length - 1] < 24) {
                this.lineChartOptions.scales.yAxes[0].ticks.max = 24;

            } else if (sortLineChartData[sortLineChartData.length - 1] > 24 && sortLineChartData[sortLineChartData.length - 1] < 48) {
                this.lineChartOptions.scales.yAxes[0].ticks.max = 48;

            } else if (sortLineChartData[sortLineChartData.length - 1] > 48 && sortLineChartData[sortLineChartData.length - 1] < 200) {
                this.lineChartOptions.scales.yAxes[0].ticks.max = 200;

            } else if (sortLineChartData[sortLineChartData.length - 1] > 200 && sortLineChartData[sortLineChartData.length - 1] < 400) {
                this.lineChartOptions.scales.yAxes[0].ticks.max = 400;

            } else if (sortLineChartData[sortLineChartData.length - 1] > 400 && sortLineChartData[sortLineChartData.length - 1] < 600) {
                this.lineChartOptions.scales.yAxes[0].ticks.max = 600;

            } else if (sortLineChartData[sortLineChartData.length - 1] > 600) {
                this.lineChartOptions.scales.yAxes[0].ticks.max = 800;

            }


        }
        if (this.selectedRange === '3monthly') {
            for (let i = 0; i < this.diffDays + 1; i++) {
                const d = new Date(this.moment.convertJaliliToIsoDate(this.dateFrom)).setHours(24 * i);
                let dJ = this.moment.getJaliliDateFromIso(d);
                const dJYear = dJ.split('/')[0];
                const dJMonth = dJ.split('/')[1];
                if (NumberTools.En2Fa(dJ) > this.dateUntil) {
                    break;
                }
                if (dJ >= this.moment.getJaliliDateFromIso(res[0].failureDate)) {
                    dJ = dJ.split('/')[0] + '/' + dJ.split('/')[1];
                    ///// افزودن لیبل
                    if (lineChartLabels.length === 1) {
                        lineChartLabels.push(dJ);
                        lineChartData.push(24 * 30 * 3);
                    } else {
                        const dJYearBefore = lineChartLabels[lineChartLabels.length - 1].split('/')[0];
                        const dJMonthBefore = lineChartLabels[lineChartLabels.length - 1].split('/')[1];
                        if (!lineChartLabels.some(l => l === dJ)) {
                            if (+dJYearBefore === +dJYear) {
                                if (!(+dJMonthBefore + 3 > +dJMonth)) {
                                    lineChartLabels.push(dJ);
                                    lineChartData.push(24 * 30 * 3);
                                }
                            } else {
                                if (+dJMonthBefore === 11) {
                                    if (+dJMonth > 1) {
                                        lineChartLabels.push(dJ);
                                        lineChartData.push(24 * 30 * 3);
                                    }
                                }
                                if (+dJMonthBefore === 12) {
                                    if (+dJMonth > 2) {
                                        lineChartLabels.push(dJ);
                                        lineChartData.push(24 * 30 * 3);
                                    }
                                }
                            }
                        }
                    }


                }
            }
            const sortLineChartData = JSON.parse(JSON.stringify(lineChartData));
            sortLineChartData.sort(function (a, b) {
                return a - b;
            });
            console.log('sortLineChartData', sortLineChartData);
            // this.lineChartOptions.scales.yAxes[0].ticks.max = sortLineChartData[sortLineChartData.length - 1] + 1;
            if (sortLineChartData[sortLineChartData.length - 1] < 6) {

                this.lineChartOptions.scales.yAxes[0].ticks.max = 6;
            } else if (sortLineChartData[sortLineChartData.length - 1] > 6 && sortLineChartData[sortLineChartData.length - 1] < 12) {
                this.lineChartOptions.scales.yAxes[0].ticks.max = 12;

            } else if (sortLineChartData[sortLineChartData.length - 1] > 12 && sortLineChartData[sortLineChartData.length - 1] < 24) {
                this.lineChartOptions.scales.yAxes[0].ticks.max = 24;

            } else if (sortLineChartData[sortLineChartData.length - 1] > 24 && sortLineChartData[sortLineChartData.length - 1] < 48) {
                this.lineChartOptions.scales.yAxes[0].ticks.max = 48;

            } else if (sortLineChartData[sortLineChartData.length - 1] > 48 && sortLineChartData[sortLineChartData.length - 1] < 200) {
                this.lineChartOptions.scales.yAxes[0].ticks.max = 200;

            } else if (sortLineChartData[sortLineChartData.length - 1] > 200 && sortLineChartData[sortLineChartData.length - 1] < 400) {
                this.lineChartOptions.scales.yAxes[0].ticks.max = 400;

            } else if (sortLineChartData[sortLineChartData.length - 1] > 400 && sortLineChartData[sortLineChartData.length - 1] < 600) {
                this.lineChartOptions.scales.yAxes[0].ticks.max = 600;

            } else if (sortLineChartData[sortLineChartData.length - 1] > 600 && sortLineChartData[sortLineChartData.length - 1] < 1000) {
                this.lineChartOptions.scales.yAxes[0].ticks.max = 1000;

            } else if (sortLineChartData[sortLineChartData.length - 1] > 1000 && sortLineChartData[sortLineChartData.length - 1] < 1500) {
                this.lineChartOptions.scales.yAxes[0].ticks.max = 1500;

            } else if (sortLineChartData[sortLineChartData.length - 1] > 2200) {
                this.lineChartOptions.scales.yAxes[0].ticks.max = 2200;

            }

            for (let i = 0; i < lineChartLabels.length; i++) {
                const label = lineChartLabels[i];
                console.log('label', label);
                const labelDYear = +label.split('/')[0];
                const labelDMonth = +label.split('/')[1];
                let count = 0;
                let failureDuration = 0;
                for (const r of res) {
                    const rD = this.moment.convertIsoToJDateYM(r.failureDate).toString();
                    const rDYear = +rD.split('/')[0];
                    const rDMonth = +rD.split('/')[1];
                    if (labelDYear === rDYear) {
                        if (labelDMonth === rDMonth || ((rDMonth - labelDMonth) < 3 && (rDMonth - labelDMonth) > 0)) {
                            count += r.count;
                            failureDuration += r.failureDuration;
                        }
                    } else {
                        if (labelDYear === 11) {
                            if (rDMonth === 1) {
                                count += r.count;
                                failureDuration += r.failureDuration;
                            }
                        }
                        if (labelDYear === 12) {
                            if (rDMonth === 2 || rDMonth === 1) {
                                count += r.count;
                                failureDuration += r.failureDuration;
                            }
                        }
                    }
                    console.log('r---rD', rD);
                    console.log('r---count', count);
                    console.log('r---failureDuration', failureDuration);
                }
                if (i === 0) {
                    lineChartData[i] = 0;
                } else {
                    if (count !== 0) {

                        const m = ((failureDuration)) / count;
                        const n = Math.floor(m / 60);
                        const mode = m % 60;
                        let nn;
                        if (mode < 10) {
                            nn = n + '.0' + Math.floor(mode);
                        } else {
                            nn = n + '.' + Math.floor(mode);
                        }
                        lineChartData[i] = +nn;
                    } else {
                        lineChartData[i] = 0;
                    }
                }

            }

        }

        if (this.selectedRange === 'yearly') {
            for (let i = 0; i < this.diffDays + 1; i++) {
                const d = new Date(this.moment.convertJaliliToIsoDate(this.dateFrom)).setHours(24 * i);
                let dJ = this.moment.getJaliliDateFromIso(d).toString();
                if (NumberTools.En2Fa(dJ) > this.dateUntil) {
                    break;
                }
                if (dJ >= this.moment.getJaliliDateFromIso(res[0].failureDate)) {
                    dJ = dJ.split('/')[0];
                    if (!lineChartLabels.some(l => l === dJ)) {
                        lineChartLabels.push(dJ);
                        // lineChartData.push(24 * 30 * 12);
                        lineChartData.push(0);
                    }
                    let count = 0;
                    let failureDuration = 0;
                    for (const r of res) {

                        const rD = this.moment.convertIsoToJDateY(r.failureDate).toString();
                        console.log('rD===dJ', rD + '-----' + dJ);
                        if (rD === dJ) {
                            count += r.count;
                            failureDuration += r.failureDuration;
                            console.log('rD5555555555555555555dJ', rD + '-----' + dJ);
                            const index = lineChartLabels.findIndex(l => l === rD);
                            if (index !== -1) {
                                lineChartData[index] = 0;
                            }
                        }
                    }
                    for (const r of res) {
                        const rD = this.moment.convertIsoToJDateY(r.failureDate).toString();
                        console.log('rD===dJ', rD + '-----' + dJ);
                        console.log('failureDuration', failureDuration);
                        if (rD === dJ) {

                            const index = lineChartLabels.findIndex(l => l === rD);
                            if (index !== -1) {
                                // const m = ((720 * 60 * 12) - (failureDuration)) / count;
                                const m = ((failureDuration)) / count;
                                const n = Math.floor(m / 60);
                                const mode = m % 60;
                                let nn;
                                if (mode < 10) {
                                    nn = n + '.0' + Math.floor(mode);
                                } else {
                                    nn = n + '.' + Math.floor(mode);
                                }
                                lineChartData[index] = +nn;
                                break;
                            }
                            // const n = Math.floor(r.workTimeDuration / 60);
                            // const mode = r.workTimeDuration % 60;
                            // const nn = n + '.' + mode;
                            // if (index !== -1) {
                            //     lineChartData[index] += +nn;
                            // }
                        }
                    }
                }
            }
            const sortLineChartData = JSON.parse(JSON.stringify(lineChartData));
            sortLineChartData.sort(function (a, b) {
                return a - b;
            });
            if (sortLineChartData[sortLineChartData.length - 1] < 6) {

                this.lineChartOptions.scales.yAxes[0].ticks.max = 6;
            } else if (sortLineChartData[sortLineChartData.length - 1] > 6 && sortLineChartData[sortLineChartData.length - 1] < 12) {
                this.lineChartOptions.scales.yAxes[0].ticks.max = 12;

            } else if (sortLineChartData[sortLineChartData.length - 1] > 12 && sortLineChartData[sortLineChartData.length - 1] < 24) {
                this.lineChartOptions.scales.yAxes[0].ticks.max = 24;

            } else if (sortLineChartData[sortLineChartData.length - 1] > 24 && sortLineChartData[sortLineChartData.length - 1] < 48) {
                this.lineChartOptions.scales.yAxes[0].ticks.max = 48;

            } else if (sortLineChartData[sortLineChartData.length - 1] > 48 && sortLineChartData[sortLineChartData.length - 1] < 200) {
                this.lineChartOptions.scales.yAxes[0].ticks.max = 200;

            } else if (sortLineChartData[sortLineChartData.length - 1] > 200 && sortLineChartData[sortLineChartData.length - 1] < 400) {
                this.lineChartOptions.scales.yAxes[0].ticks.max = 400;

            } else if (sortLineChartData[sortLineChartData.length - 1] > 400 && sortLineChartData[sortLineChartData.length - 1] < 600) {
                this.lineChartOptions.scales.yAxes[0].ticks.max = 600;

            } else if (sortLineChartData[sortLineChartData.length - 1] > 600 && sortLineChartData[sortLineChartData.length - 1] < 1000) {
                this.lineChartOptions.scales.yAxes[0].ticks.max = 100;

            } else if (sortLineChartData[sortLineChartData.length - 1] > 1000 && sortLineChartData[sortLineChartData.length - 1] < 2000) {
                this.lineChartOptions.scales.yAxes[0].ticks.max = 2000;

            } else if (sortLineChartData[sortLineChartData.length - 1] > 2000 && sortLineChartData[sortLineChartData.length - 1] < 3000) {
                this.lineChartOptions.scales.yAxes[0].ticks.max = 3000;

            } else if (sortLineChartData[sortLineChartData.length - 1] > 3000 && sortLineChartData[sortLineChartData.length - 1] < 4000) {
                this.lineChartOptions.scales.yAxes[0].ticks.max = 4000;

            } else if (sortLineChartData[sortLineChartData.length - 1] > 4000 && sortLineChartData[sortLineChartData.length - 1] < 5000) {
                this.lineChartOptions.scales.yAxes[0].ticks.max = 5000;

            } else if (sortLineChartData[sortLineChartData.length - 1] > 5000 && sortLineChartData[sortLineChartData.length - 1] < 6000) {
                this.lineChartOptions.scales.yAxes[0].ticks.max = 6000;

            } else if (sortLineChartData[sortLineChartData.length - 1] > 6000 && sortLineChartData[sortLineChartData.length - 1] < 7000) {
                this.lineChartOptions.scales.yAxes[0].ticks.max = 7000;

            } else if (sortLineChartData[sortLineChartData.length - 1] > 7000 && sortLineChartData[sortLineChartData.length - 1] < 8000) {
                this.lineChartOptions.scales.yAxes[0].ticks.max = 8000;

            } else if (sortLineChartData[sortLineChartData.length - 1] > 8000) {
                this.lineChartOptions.scales.yAxes[0].ticks.max = 9000;

            }


        }


        this.width = 200;
        if (this.lineChartLabels.length > 24) {
            this.width = 1024;
            // this.width = this.width * (this.lineChartLabels.length / 2);
        }
        console.log('   this.width', this.width);
        for (const label of lineChartLabels) {
            this.lineChartLabels.push(NumberTools.En2Fa(label));
        }
        this.lineChartData[0].data = lineChartData;
        this.showChart = false;
        setTimeout((e) => {
            this.showChart = true;
            this.scrollTop();

        }, 11);
    }

    // events
    chartClicked({event, active}: { event: MouseEvent, active: {}[] }): void {
        console.log(event, active);
    }

    chartHovered({event, active}: { event: MouseEvent, active: {}[] }): void {
        console.log(event, active);
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
                this.dateChek();
                console.log();
                // this.getAllByFilterAndPagination.from =
                //     this.myMoment.convertJaliliToIsoDate($(e.currentTarget).val());
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
                this.dateChek();

            });
        }, 10);

    }

    dateChek() {
        if (!this.dateFrom || !this.dateUntil) {
            // DefaultNotify.notifyDanger('بازه زمانی  انتخاب  شود.');
            return false;
        }
        if (this.dateFrom > this.dateUntil) {
            // DefaultNotify.notifyDanger('بازه زمانی درست انتخاب نشده است.');
            return false;
        } else {
            console.log($('#dateUntil').azPersianDateTimePicker('getDateRange'));
            console.log(this.dateUntil - this.dateFrom);

            const StartDate = new Date(this.moment.convertJaliliToIsoDate(this.dateFrom));
            const EndDate = new Date(this.moment.convertJaliliToIsoDate(this.dateUntil));

            const timeDiff = Math.abs(EndDate.getTime() - StartDate.getTime());
            this.diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
            const dateTypeList = [];
            this.selectedRange = null;
            // if (this.diffDays > 0) {
            //     dateTypeList.push({title: 'روزانه', value: 'daily'});
            // }
            // if (this.diffDays > 7) {
            //     dateTypeList.push('هفتگی');
            // }
            if (this.diffDays < 30) {
                DefaultNotify.notifyDanger('بازه زمانی حداقل 30 روزه انتخاب شود.', '', NotiConfig.notifyConfig);
            }
            if (this.diffDays >= 30) {
                dateTypeList.push({title: 'ماهانه', value: 'monthly'});
            }
            if (this.diffDays >= 90) {
                dateTypeList.push({title: '3ماهانه', value: '3monthly'});
            }
            if (this.diffDays >= 365) {
                dateTypeList.push({title: 'سالانه', value: 'yearly'});
            }
            this.dateRangeList = dateTypeList;
            console.log('this.dateFrom', this.dateFrom);
            console.log('this.dateUntil', this.dateUntil);
            console.log('StartDate', StartDate);
            console.log('EndDate', EndDate);
            console.log('timeDiff', timeDiff);
            console.log('diffDays', this.diffDays);

            return true;
        }
    }


    ngOnDestroy(): void {
    }

    openPDF() {
        const DATA = document.getElementById('htmlData');

        html2canvas(DATA).then(canvas => {

            const fileWidth = 208;
            const fileHeight = canvas.height * fileWidth / canvas.width;

            const FILEURI = canvas.toDataURL('image/png');
            const PDF = new jsPDF('p', 'mm', 'a4');
            const position = 0;
            PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);

            PDF.save('angular-demo.pdf');
        });
    }

    setWidth(event) {

        if (event.wheelDelta > 0) {
            this.width += 100;

        } else {
            if (this.width < 100) {
                return;
            }
            this.width -= 100;
        }
        this.showChart = false;
        setTimeout((e) => {
            this.showChart = true;
            this.scrollTop();
        });
    }

    scrollTop() {
        $('#content').animate({
            scrollTop: $(window).height()
        }, 1200);
    }

}
