import {Component, OnInit} from '@angular/core';
import {FormAnalysis, FormAnswers} from '../../../fb-model/form/formAnalysis';
// import {FormOperationService} from '../../../service/formOperation.service';
import {LanguageService} from '../../../shared/language-data-service/language.service';
import {ActivatedRoute} from '@angular/router';
// import {Angular2Csv} from 'angular2-csv/Angular2-csv';

@Component({
  selector: 'app-form-analysis',
  templateUrl: './form-analysis.component.html',
  styleUrls: ['./form-analysis.component.css']
})
export class FormAnalysisComponent implements OnInit {

  // data: any = null;
  // filterType: Array<string> = [];
  // filterFlag: Array<boolean> = [true, false, false, false, false]; // نمایش نتایج بر اساس نوع انتخاب شده بر اساس flag
  // formId: string;
  // formAnalysis = new FormAnalysis();
  // list: Array<FormAnswers> = [];
  // formAnalysisGender = new FormAnalysis();
  // listGender: Array<FormAnswers> = [];
  // formAnalysisDegree = new FormAnalysis();
  // listDegree: Array<FormAnswers> = [];
  // formAnalysisProvince = new FormAnalysis();
  // listProvince: Array<FormAnswers> = [];
  // csvDataArray: Array<any> = [];
  //
  // constructor(private languageDataService: LanguageService,
  //             // private formOperationService: FormOperationService,
  //             private _route: ActivatedRoute) {
  // }
  //
  ngOnInit() {}
  //   this._route.params.subscribe(params => {
  //     this.formId = params['formId'];
  //   });
  //   this.languageDataService.getLanguageData().subscribe(res => {
  //     this.data = res;
  //     this.filterType = [this.data.formAnalysis.totalAnalysis, this.data.formAnalysis.gender, this.data.formAnalysis.degree, this.data.formAnalysis.province];
  //   });
  //   // this.formOperationService.getTotalFormData(this.formId).subscribe(res => {
  //   //   this.formAnalysis = res;
  //   //   this.list = [];
  //   //   this.list = this.formAnalysis.elements;
  //   // });
  // }
  //
  // analysisFilter(index) {
  //
  //   // if (index === 1 && this.listGender.length === 0) {
  //   //   this.formOperationService.getGenderFormAnalysis(this.formId).subscribe(resGender => {
  //   //     this.formAnalysisGender = resGender;
  //   //     this.listGender = resGender.elements;
  //   //   });
  //   // }
  //   // if (index === 2 && this.listDegree.length === 0) {
  //   //   this.formOperationService.getDegreeFormAnalysis(this.formId).subscribe(resGender => {
  //   //     this.formAnalysisDegree = resGender;
  //   //     this.listDegree = resGender.elements;
  //   //   });
  //   // }
  //   // if (index === 3 && this.listProvince.length === 0) {
  //   //   this.formOperationService.getProvinceFormAnalysis(this.formId).subscribe(resGender => {
  //   //     this.formAnalysisProvince = resGender;
  //   //     this.listProvince = resGender.elements;
  //   //   });
  //   // }
  //   // this.filterFlag[index] = !this.filterFlag[index];
  // }
  //
  // excelOutput() {
  //   // this.csvDataArray = [];
  //   // let answers: Array<any> = [];
  //   // const labels: Array<string> = [];
  //   // let questions: Array<string> = [];
  //   // let questionTypes: Array<string> = [];
  //   // this.formOperationService.getExcelData(this.formId).subscribe(res => {
  //   //   questions = res.questionLabels;
  //   //   labels[0] = 'پاسخ ها';
  //   //   for (const item of questions) {
  //   //     labels.push(item);
  //   //   }
  //   //   this.csvDataArray.push(labels);
  //   //   answers = res.answers;
  //   //   questionTypes = res.questionsTypes;
  //   //   for (let a = 0; a < answers.length; a++) {
  //   //     let perAnswer: Array<any> = [];
  //   //     const perRow: Array<any> = [];
  //   //     perAnswer = answers[a];
  //   //     perRow[0] = 'کاربر' + (a + 1);
  //   //     for (let p = 0; p < perAnswer.length; p++) {
  //   //       if (questionTypes[p] === 'CHECK_BOX') {
  //   //         let javab = '';
  //   //         if (perAnswer[p].length === 1) {
  //   //           javab = perAnswer[p];
  //   //           perRow.push(javab[0]);
  //   //         } else {
  //   //           for (const j of perAnswer[p]) {
  //   //             javab = javab + j + ',';
  //   //           }
  //   //           perRow.push(javab);
  //   //         }
  //   //       } else {
  //   //         const javab: any = perAnswer[p];
  //   //         perRow.push(javab[0]);
  //   //       }
  //   //     }
  //   //     this.csvDataArray.push(perRow);
  //   //   }
  //   //
  //   //
  //   //   const options = {
  //   //     fieldSeparator: ',',
  //   //     quoteStrings: '"',
  //   //     decimalseparator: '.',
  //   //     showLabels: true,
  //   //     showTitle: false,
  //   //   };
  //   //   new Angular2Csv(this.csvDataArray, 'myReport', options);
  //   // });
  // }

}
