// import {Injectable} from '@angular/core';
// import {HttpClient} from '@angular/common/http';
// import 'rxjs/add/operator/map';
//
//
// @Injectable({
//   providedIn: 'root'
// })
// export class FormOperationService {
//
//   constructor(private http: HttpClient) {
//   }
//
//   deleteForm(id: string) {
//     return this.http.delete(this._url + '/' + id + '?' + Token.getLocalStorageToken())
//       .map(response => response.json());
//   }
//
//   // excel data
//   getExcelData(formId: string) {
//     return this.http.get(this.url.url + '/personAnswer/allAnswers/' + formId + '?' + Token.getLocalStorageToken())
//       .map(response => response.json());
//   }
//
//   // total Analysis
//   getTotalFormData(formId: string) {
//     return this.http.get(this.url.url + '/formAnalysis/' + formId + '/analysis?' + Token.getLocalStorageToken())
//       .map(response => response.json());
//   }
//
//   getGenderFormAnalysis(formId: string) {
//     return this.http.get(this.url.url + '/formAnalysis/' + formId + '/gender?' + Token.getLocalStorageToken())
//       .map(response => response.json());
//   }
//
//   getDegreeFormAnalysis(formId: string) {
//     return this.http.get(this.url.url + '/formAnalysis/' + formId + '/degree?' + Token.getLocalStorageToken())
//       .map(response => response.json());
//   }
//
//   getProvinceFormAnalysis(formId: string) {
//     return this.http.get(this.url.url + '/formAnalysis/' + formId + '/province?' + Token.getLocalStorageToken())
//       .map(response => response.json());
//   }
//
//   // delete personAnswer
//   deletingAnswer(formId, personId) {
//     return this.http.delete(this.url.url + '/personAnswer/' + formId + '/' + personId + '?'
//     + Token.getLocalStorageToken())// ...using formCategory request
//       .map(res => res.json());
//   }
// }
