import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Form} from '../../fb-model/form/form';
import {ActionMode} from '@angular-boot/util';

@Injectable({
  providedIn: 'root'
})
export class SurveyDataService {
  constructor() {
  }

  private viewSurveyForm = new BehaviorSubject<Form>(null);
  gettingViewSurveyForm = this.viewSurveyForm.asObservable();

  setViewSurveyForm(viewSurveyForm: Form) {
    this.viewSurveyForm.next(viewSurveyForm);
  }


  private editSurveyForm = new BehaviorSubject<Form>(null);
  gettingEditSurveyForm = this.editSurveyForm.asObservable();

  setEditSurveyForm(editSurveyForm: Form) {
    this.editSurveyForm.next(editSurveyForm);
  }

  private addedSurveyForm = new BehaviorSubject<Form>(null);
  gettingAddedSurveyForm = this.addedSurveyForm.asObservable();

  setAddedSurveyForm(addedSurveyForm: Form) {
    this.addedSurveyForm.next(addedSurveyForm);
  }

  private actionMode = new BehaviorSubject<ActionMode>(null);
  gettingActionMode = this.actionMode.asObservable();

  setActionMode(actionMode: ActionMode) {
    this.actionMode.next(actionMode);
  }

  private viewDetail = new BehaviorSubject<boolean>(null);
  gettingViewDetail = this.viewDetail.asObservable();

  setViewDetail(value: boolean) {
    this.viewDetail.next(value);
  }
}
