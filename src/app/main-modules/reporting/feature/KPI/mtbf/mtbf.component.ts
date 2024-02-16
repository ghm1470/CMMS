import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ChartDataSets, ChartLineOptions, ChartOptions} from 'chart.js';
import {Color, Label} from 'ng2-charts';
import {DefaultNotify} from '@angular-boot/util';
import {Moment} from '../../../../../shared/shared/tools/date/moment';
import {MtbfService} from '../../../endpoint/mtbf.service';
import {MtbfDTO} from '../../../model/mtbfDTO';
import {AssetDto} from '../../../../asset/model/dto/assetDto';
import {takeUntilDestroyed} from '@angular-boot/core';
import {AssetService} from '../../../../asset/endpoint/asset.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import {NumberTools} from "../../../../../shared/tools/numberTools";
import {NotiConfig} from "../../../../../shared/tools/notifyConfig";
import {CategoryDto} from "../../../../category/model/dto/categoryDto";
import CategoryType = CategoryDto.CategoryType;

declare var $: any;

@Component({
    selector: 'app-mtbf',
    templateUrl: './mtbf.component.html',
    styleUrls: ['./mtbf.component.scss']
})
export class MtbfComponent implements AfterViewInit, OnInit, OnDestroy {
    constructor(private entityService: MtbfService,
                public assetService: AssetService,
    ) {
    }

    title = 'MTBF';

    @ViewChild('htmlData', {static: false}) htmlData: ElementRef;

    width = 100;

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
                label: function (tooltipItem, chart) {
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
                        result = NumberTools.En2Fa((tooltipItem.yLabel.toString().split('.')[0]) + ':00');

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
            this.mtbfCalculation();
        }
    }

    mtbfCalculation() {
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
        const dto = new MtbfDTO.MtbfCalculationDto();
        dto.from = this.moment.convertJaliliToGregorian(this.dateFrom);
        dto.from = dto.from.replaceAll('/', '-') + 'T00:00:00.000Z';
        dto.until = this.moment.convertJaliliToGregorian(this.dateUntil);
        dto.until = dto.until.replaceAll('/', '-') + 'T23:59:59.000Z';
        dto.range = 'daily';
        if (this.selectedAssetId !== 'null') {
            dto.assetId = this.selectedAssetId;
        }
        this.loading = true;

        this.entityService.mtbfCalculation(dto).subscribe((res: MtbfDTO.MtbfCalculationResDto[]) => {
            this.loading = false;
            if (res) {
                this.lineChartLabels = [];
                this.lineChartData[0].data = [];
                // this.lineChartData[0].label = this.assetList.find(e => e.id === this.selectedAssetId).name;
                this.lineChartData[0].label = 'mtbf';
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

    setChartData(res: MtbfDTO.MtbfCalculationResDto[]) {

        this.width = 200;

        const lineChartLabels = [''];
        const lineChartData: any[] = [0];
        // if (this.selectedRange === 'daily') {
        //     this.lineChartOptions.scales.yAxes[0].ticks.max = 24;
        //
        //     for (let i = 0; i < this.diffDays + 1; i++) {
        //
        //         const d = new Date(this.moment.convertJaliliToIsoDate(this.dateFrom)).setHours(24 * i);
        //         const dJ = this.moment.getJaliliDateFromIso(d);
        //         if (NumberTools.En2Fa(dJ) > this.dateUntil) {
        //             break;
        //         }
        //         if (dJ >= this.moment.getJaliliDateFromIso(res[0].startDate)) {
        //             console.log('dJ>======', dJ)
        //
        //             lineChartLabels.push(dJ);
        //             lineChartData.push(24);
        //             for (const r of res) {
        //                 // const rD = this.moment.getJaliliDateFromIso(this.moment.convertGregorianToIsoDate(r.date.replace('-', '/')));
        //                 const rD = this.moment.getJaliliDateFromIso(r.startDate);
        //                 console.log('rD===dJ', rD + '-----' + dJ);
        //
        //                 if (rD === dJ) {
        //                     console.log('rD===dJ', rD + '-----' + dJ);
        //                     const n = Math.floor(r.workTimeDuration / 60);
        //                     const mode: any = r.workTimeDuration % 60;
        //                     let nn;
        //                     if (mode < 10) {
        //                         nn = n + '.0' + Math.floor(mode);
        //                     } else {
        //                         nn = n + '.' + Math.floor(mode);
        //                     }
        //                     console.log('nn', nn)
        //                     console.log('lineChartLabels', lineChartLabels)
        //                     const index = lineChartLabels.findIndex(l => l === rD);
        //                     console.log('index', index)
        //                     if (index !== -1) {
        //                         lineChartData[index] = +nn;
        //                         lineChartData[index] = lineChartData[index].toFixed(2);
        //                         console.log(' lineChartData[index]', lineChartData[index])
        //
        //                     }
        //                 }
        //             }
        //         }
        //     }
        // }

        if (this.selectedRange === 'monthly') {
            this.lineChartOptions.scales.yAxes[0].ticks.max = 800;
            let dayOfMonth = 30;
            for (let i = 0; i < this.diffDays + 1; i++) {
                const d = new Date(this.moment.convertJaliliToIsoDate(this.dateFrom)).setHours(24 * i);
                let dJ = this.moment.getJaliliDateFromIso(d);

                const y = +dJ.split('/')[0];
                const m = +dJ.split('/')[1];
                let kabiseh = false;
                y % 4 === 3 ? kabiseh = true : false;
                if (kabiseh) {
                    if (m < 7) {
                        dayOfMonth = 31;
                    } else {
                        dayOfMonth = 30;
                    }

                } else {
                    if (m < 7) {
                        dayOfMonth = 31;
                    } else if (m === 12) {
                        dayOfMonth = 29;
                    } else {
                        dayOfMonth = 30;
                    }
                }

                if (NumberTools.En2Fa(dJ) > this.dateUntil) {
                    break;
                }
                if (dJ >= this.moment.getJaliliDateFromIso(res[0].startDate)) {
                    dJ = dJ.split('/')[0] + '/' + dJ.split('/')[1];
                    if (!lineChartLabels.some(l => l === dJ)) {
                        lineChartLabels.push(dJ);
                        lineChartData.push(24 * dayOfMonth);
                    }

                    let count = 0;
                    let failureDuration = 0;
                    for (const r of res) {
                        // const rD = this.moment.convertIsoToJDateYM(this.moment.convertGregorianToIsoDate(r.date.replace('-', '/')));
                        const rD = this.moment.convertIsoToJDateYM(r.startDate).toString();
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
                        const rD = this.moment.convertIsoToJDateYM(r.startDate).toString();
                        console.log('rD===dJ', rD + '-----' + dJ);
                        if (rD === dJ) {
                            console.log('rD=....==dJ', rD + '-----' + dJ);
                            const index = lineChartLabels.findIndex(l => l === rD);
                            if (index !== -1) {

                                const m = (((dayOfMonth * 24) * 60) - (failureDuration)) / count;
                                console.log('mmmmmmmmmmm', m);
                                console.log('dayOfMonth', dayOfMonth);
                                console.log('failureDuration', failureDuration);
                                console.log('count', count);

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

        }
        if (this.selectedRange === '3monthly') {
            this.lineChartOptions.scales.yAxes[0].ticks.max = 2300;
            ///// افزودن لیبل
            let dayOfMonth = 90;
            for (let i = 0; i < this.diffDays + 1; i++) {
                const d = new Date(this.moment.convertJaliliToIsoDate(this.dateFrom)).setHours(24 * i);
                let dJ = this.moment.getJaliliDateFromIso(d);
                const dJYear = +dJ.split('/')[0];
                const dJMonth = +dJ.split('/')[1];

                let kabiseh = false;
                dJYear % 4 === 3 ? kabiseh = true : false;


                if (NumberTools.En2Fa(dJ) > this.dateUntil) {
                    break;
                }
                if (dJ >= this.moment.getJaliliDateFromIso(res[0].startDate)) {
                    dJ = dJ.split('/')[0] + '/' + dJ.split('/')[1];

                    if (lineChartLabels.length === 1) {
                        lineChartLabels.push(dJ);
                        if (dJMonth < 5) {
                            dayOfMonth = 93;
                            lineChartData.push(24 * 93);
                        } else if (dJMonth === 5) {
                            dayOfMonth = 92;
                            lineChartData.push(24 * 92);
                        } else if (dJMonth === 6) {
                            dayOfMonth = 91;
                            lineChartData.push(24 * 91);
                        } else if (dJMonth > 6 && dJMonth < 10) {
                            dayOfMonth = 90;
                            lineChartData.push(24 * 90);
                        } else if (dJMonth === 10) {
                            if (kabiseh) {
                                dayOfMonth = 90;
                                lineChartData.push(24 * 90);
                            } else {
                                dayOfMonth = 89;
                                lineChartData.push(24 * 89);
                            }
                        } else if (dJMonth === 11) {
                            if (kabiseh) {
                                dayOfMonth = 91;
                                lineChartData.push(24 * 91);
                            } else {
                                dayOfMonth = 90;
                                lineChartData.push(24 * 90);
                            }
                        } else if (dJMonth === 12) {
                            if (kabiseh) {
                                dayOfMonth = 92;
                                lineChartData.push(24 * 92);
                            } else {
                                dayOfMonth = 91;
                                lineChartData.push(24 * 91);
                            }
                        }
                    } else {
                        const dJYearBefore = lineChartLabels[lineChartLabels.length - 1].split('/')[0];
                        const dJMonthBefore = lineChartLabels[lineChartLabels.length - 1].split('/')[1];
                        if (!lineChartLabels.some(l => l === dJ)) {
                            if (+dJYearBefore === +dJYear) {
                                if (!(+dJMonthBefore + 3 > dJMonth)) {
                                    lineChartLabels.push(dJ);
                                    // lineChartData.push(24 * (dayOfMonth * 3));
                                    if (dJMonth < 5) {
                                        dayOfMonth = 93;
                                        lineChartData.push(24 * 93);
                                    } else if (dJMonth === 5) {
                                        dayOfMonth = 92;
                                        lineChartData.push(24 * 92);
                                    } else if (dJMonth === 6) {
                                        dayOfMonth = 91;
                                        lineChartData.push(24 * 91);
                                    } else if (dJMonth > 6 && dJMonth < 10) {
                                        dayOfMonth = 90;
                                        lineChartData.push(24 * 90);
                                    } else if (dJMonth === 10) {
                                        if (kabiseh) {
                                            dayOfMonth = 90;
                                            lineChartData.push(24 * 90);
                                        } else {
                                            dayOfMonth = 89;
                                            lineChartData.push(24 * 89);
                                        }
                                    } else if (dJMonth === 11) {
                                        if (kabiseh) {
                                            dayOfMonth = 91;
                                            lineChartData.push(24 * 91);
                                        } else {
                                            dayOfMonth = 90;
                                            lineChartData.push(24 * 90);
                                        }
                                    } else if (dJMonth === 12) {
                                        if (kabiseh) {
                                            dayOfMonth = 92;
                                            lineChartData.push(24 * 92);
                                        } else {
                                            dayOfMonth = 91;
                                            lineChartData.push(24 * 91);
                                        }
                                    }
                                }
                            } else {
                                if (+dJMonthBefore === 11) {
                                    if (+dJMonth > 1) {
                                        lineChartLabels.push(dJ);
                                        // lineChartData.push(24 * (dayOfMonth * 3));
                                        if (dJMonth < 5) {
                                            dayOfMonth = 93;
                                            lineChartData.push(24 * 93);
                                        } else if (dJMonth === 5) {
                                            dayOfMonth = 92;
                                            lineChartData.push(24 * 92);
                                        } else if (dJMonth === 6) {
                                            dayOfMonth = 91;
                                            lineChartData.push(24 * 91);
                                        } else if (dJMonth > 6 && dJMonth < 10) {
                                            dayOfMonth = 90;
                                            lineChartData.push(24 * 90);
                                        } else if (dJMonth === 10) {
                                            if (kabiseh) {
                                                dayOfMonth = 90;
                                                lineChartData.push(24 * 90);
                                            } else {
                                                dayOfMonth = 89;
                                                lineChartData.push(24 * 89);
                                            }
                                        } else if (dJMonth === 11) {
                                            if (kabiseh) {
                                                dayOfMonth = 91;
                                                lineChartData.push(24 * 91);
                                            } else {
                                                dayOfMonth = 90;
                                                lineChartData.push(24 * 90);
                                            }
                                        } else if (dJMonth === 12) {
                                            if (kabiseh) {
                                                dayOfMonth = 92;
                                                lineChartData.push(24 * 92);
                                            } else {
                                                dayOfMonth = 91;
                                                lineChartData.push(24 * 91);
                                            }
                                        }
                                    }
                                }
                                if (+dJMonthBefore === 12) {
                                    if (dJMonth > 2) {
                                        lineChartLabels.push(dJ);
                                        // lineChartData.push(24 * (dayOfMonth * 3));
                                        if (dJMonth < 5) {
                                            dayOfMonth = 93;
                                            lineChartData.push(24 * 93);
                                        } else if (dJMonth === 5) {
                                            dayOfMonth = 92;
                                            lineChartData.push(24 * 92);
                                        } else if (dJMonth === 6) {
                                            dayOfMonth = 91;
                                            lineChartData.push(24 * 91);
                                        } else if (dJMonth > 6 && dJMonth < 10) {
                                            dayOfMonth = 90;
                                            lineChartData.push(24 * 90);
                                        } else if (dJMonth === 10) {
                                            if (kabiseh) {
                                                dayOfMonth = 90;
                                                lineChartData.push(24 * 90);
                                            } else {
                                                dayOfMonth = 89;
                                                lineChartData.push(24 * 89);
                                            }
                                        } else if (dJMonth === 11) {
                                            if (kabiseh) {
                                                dayOfMonth = 91;
                                                lineChartData.push(24 * 91);
                                            } else {
                                                dayOfMonth = 90;
                                                lineChartData.push(24 * 90);
                                            }
                                        } else if (dJMonth === 12) {
                                            if (kabiseh) {
                                                dayOfMonth = 92;
                                                lineChartData.push(24 * 92);
                                            } else {
                                                dayOfMonth = 91;
                                                lineChartData.push(24 * 91);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            ///// افزودن مقدار
            for (let i = 0; i < lineChartLabels.length; i++) {
                const label = lineChartLabels[i];
                console.log('label', label);
                const labelDYear = +label.split('/')[0];
                const labelDMonth = +label.split('/')[1];
                let count = 0;
                let failureDuration = 0;
                for (const r of res) {
                    const rD = this.moment.convertIsoToJDateYM(r.startDate).toString();
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
                    console.log('r---dayOfMonth', dayOfMonth);


                }
                if (i === 0) {
                    lineChartData[i] = 0;
                } else {
                    if (count !== 0) {
                        if (label) {
                            const dJYear = +label.split('/')[0];
                            const dJMonth = +label.split('/')[1];
                            let kabiseh = false;
                            dJYear % 4 === 3 ? kabiseh = true : false;
                            if (dJMonth < 5) {
                                dayOfMonth = 93;
                                lineChartData.push(24 * 93);
                            } else if (dJMonth === 5) {
                                dayOfMonth = 92;
                                lineChartData.push(24 * 92);
                            } else if (dJMonth === 6) {
                                dayOfMonth = 91;
                                lineChartData.push(24 * 91);
                            } else if (dJMonth > 6 && dJMonth < 10) {
                                dayOfMonth = 90;
                                lineChartData.push(24 * 90);
                            } else if (dJMonth === 10) {
                                if (kabiseh) {
                                    dayOfMonth = 90;
                                    lineChartData.push(24 * 90);
                                } else {
                                    dayOfMonth = 89;
                                    lineChartData.push(24 * 89);
                                }
                            } else if (dJMonth === 11) {
                                if (kabiseh) {
                                    dayOfMonth = 91;
                                    lineChartData.push(24 * 91);
                                } else {
                                    dayOfMonth = 90;
                                    lineChartData.push(24 * 90);
                                }
                            } else if (dJMonth === 12) {
                                if (kabiseh) {
                                    dayOfMonth = 92;
                                    lineChartData.push(24 * 92);
                                } else {
                                    dayOfMonth = 91;
                                    lineChartData.push(24 * 91);
                                }
                            }
                        }
                        const m = (((dayOfMonth * 24) * 60) - (failureDuration)) / count;
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
                        lineChartData[i] = 24 * dayOfMonth;
                    }
                }

            }

        }
        if (this.selectedRange === 'yearly') {
            this.lineChartOptions.scales.yAxes[0].ticks.max = 8640;
            let dayOfYear = 365;
            for (let i = 0; i < this.diffDays + 1; i++) {
                const d = new Date(this.moment.convertJaliliToIsoDate(this.dateFrom)).setHours(24 * i);
                let dJ = this.moment.getJaliliDateFromIso(d).toString();
                const dJYear = +dJ.split('/')[0];

                let kabiseh = false;
                dJYear % 4 === 3 ? kabiseh = true : false;

                if (kabiseh) {
                    dayOfYear = 366;
                } else {
                    dayOfYear = 365;
                }


                if (NumberTools.En2Fa(dJ) > this.dateUntil) {
                    break;
                }
                if (dJ >= this.moment.getJaliliDateFromIso(res[0].startDate)) {
                    dJ = dJ.split('/')[0];
                    if (!lineChartLabels.some(l => l === dJ)) {
                        lineChartLabels.push(dJ);
                        lineChartData.push(24 * (dayOfYear));
                    }
                    let count = 0;
                    let failureDuration = 0;
                    for (const r of res) {

                        const rD = this.moment.convertIsoToJDateY(r.startDate).toString();
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
                        const rD = this.moment.convertIsoToJDateY(r.startDate).toString();
                        console.log('rD===dJ', rD + '-----' + dJ);
                        console.log('failureDuration', failureDuration);
                        if (rD === dJ) {

                            const index = lineChartLabels.findIndex(l => l === rD);
                            if (index !== -1) {
                                const m = ((dayOfYear * 24 * 60) - (failureDuration)) / count;
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

        }

        for (const label of lineChartLabels) {
            this.lineChartLabels.push(NumberTools.En2Fa(label));
        }
        this.lineChartData[0].data = lineChartData;
        if (this.lineChartLabels.length > 24) {
            this.width = 1024;
        }
        console.log(' this.lineChartLabels', this.lineChartLabels);
        console.log(' this.lineChartData[0].data', this.lineChartData[0].data);
        this.showChart = false;
        setTimeout((e) => {
            this.showChart = true;
            this.scrollTop();
            // const hash=100;


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
                dateTypeList.push({title: '3 ماهانه', value: '3monthly'});
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

    setWidth(type) {

        if (type === 'plus') {
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
