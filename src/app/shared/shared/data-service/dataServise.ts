import {BehaviorSubject} from 'rxjs';

export class DataService {

  //////////// chengeActivityList ////////////
  public static changeActivityList = new BehaviorSubject<any>('');
  public static getChangeActivityList = DataService.changeActivityList.asObservable();

  public static setChangeActivityList(value: any) {
    DataService.changeActivityList.next(value);
  }

  //////////// chengeActivityProsessList ////////////
  public static chengeActivityProsessList = new BehaviorSubject<any>('');
  public static getChengeActivityProsessList = DataService.chengeActivityProsessList.asObservable();

  public static setChengeActivityProsessList(value: any) {
    DataService.chengeActivityProsessList.next(value);
  }


  //////////// EditActivitySendForModal ////////////
  public static editActivity = new BehaviorSubject<any>('');
  public static getEditActivity = DataService.editActivity.asObservable();

  public static setEditActivity(value: any) {
    DataService.editActivity.next(value);
  }


  //////////// ActivityProsessForView  //  ActivityProsessViewComponent ////////////
  public static activityProsessOne = new BehaviorSubject<any>('');
  public static getActivityProsessOne = DataService.activityProsessOne.asObservable();

  public static setActivityProsessOne(value: any) {
    DataService.activityProsessOne.next(value);
  }

  //////////// chengeActivityList ////////////
  public static changeRootOrganizationManegmentList = new BehaviorSubject<any>('');
  public static getChangeRootOrganizationManegmentList = DataService.changeRootOrganizationManegmentList.asObservable();

  public static setChangeRootOrganizationManegmentList(value: any) {
    DataService.changeRootOrganizationManegmentList.next(value);
  }

////////////  changeUserAccountList  ////////////
  public static changeUserAccountList = new BehaviorSubject<any>('');
  public static getChangeUserAccountList = DataService.changeUserAccountList.asObservable();

  public static setChangeUserAccountList(value: any) {
    DataService.changeUserAccountList.next(value);
  }

  //////////// changeMeasurementUnitList ////////////
  public static changeMeasurementUnitList = new BehaviorSubject<any>('');
  public static getChangeMeasurementUnitList = DataService.changeMeasurementUnitList.asObservable();

  public static setChangeMeasurementUnitList(value: any) {
    DataService.changeMeasurementUnitList.next(value);
  }

  //////////// changeMeasurementUnitList ////////////
  public static changeMeasurementUnitTypeList = new BehaviorSubject<any>('');
  public static getchangeMeasurementUnitTypeList = DataService.changeMeasurementUnitTypeList.asObservable();

  public static setchangeMeasurementUnitTypeList(value: any) {
    DataService.changeMeasurementUnitTypeList.next(value);
  }

  ////////////  chengeActivityList  ////////////
  public static changeBrandList = new BehaviorSubject<any>('');
  public static getChangeBrandList = DataService.changeBrandList.asObservable();

  public static setChangeBrandList(value: any) {
    DataService.changeBrandList.next(value);
  }

  ////////////  chengeActivityList  ////////////
  public static changeCountryList = new BehaviorSubject<any>('');
  public static getChangeCountryList = DataService.changeCountryList.asObservable();

  public static setChangeCountryList(value: any) {
    DataService.changeCountryList.next(value);
  }

  ////////////  chengeActivityList  ////////////
  public static changeTownshipSelectList = new BehaviorSubject<any>('');
  public static getChangeTownshipSelectList = DataService.changeTownshipSelectList.asObservable();

  public static setChangeTownshipSelectList(value: any) {
    DataService.changeTownshipSelectList.next(value);
  }

  //////////// changePriceTypeList ////////////
  public static changePriceTypeList = new BehaviorSubject<any>('');
  public static getchangePriceTypeList = DataService.changePriceTypeList.asObservable();

  public static setchangePriceTypeList(value: any) {
    DataService.changePriceTypeList.next(value);
  }

  //////////// changeProvinceList ////////////
  public static changeProvinceList = new BehaviorSubject<any>('');
  public static getchangeProvinceList = DataService.changeProvinceList.asObservable();

  public static setchangeProvinceList(value: any) {
    DataService.changeProvinceList.next(value);
  }

  //////////// changeInternalActionList ////////////
  public static changeInternalActionList = new BehaviorSubject<any>('');
  public static getchangeInternalActionList = DataService.changeInternalActionList.asObservable();

  public static setchangeInternalActionList(value: any) {
    DataService.changeInternalActionList.next(value);
  }

  //////////// changeExternalActionList ////////////
  public static changeExternalActionList = new BehaviorSubject<any>('');
  public static getchangeExternalActionList = DataService.changeExternalActionList.asObservable();

  public static setchangeExternalActionList(value: any) {
    DataService.changeExternalActionList.next(value);
  }

  //////////// changeConditionList ////////////
  public static changeConditionList = new BehaviorSubject<any>('');
  public static getchangeConditionList = DataService.changeConditionList.asObservable();

  public static setchangeConditionList(value: any) {
    DataService.changeConditionList.next(value);
  }

  //////////// changeConditionVariableList ////////////
  public static changeConditionVariableList = new BehaviorSubject<any>('');
  public static getchangeConditionVariableList = DataService.changeConditionVariableList.asObservable();

  public static setchangeConditionVariableList(value: any) {
    DataService.changeConditionVariableList.next(value);
  }
}
