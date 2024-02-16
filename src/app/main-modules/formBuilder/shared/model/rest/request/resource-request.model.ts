import {LanguageService} from "@angular/language-service";
import {Sort} from "./sort.model";
import {KeyValueObject} from "./key-value-object.model";
import {ResourcePage} from "../responce/resource-page.model";

export class ResourceRequest {

  multilanguageFlag?: boolean = false;
  languageList?: string[] = [];
  languageFieldList?: string[] = [];
  incloudFieldFlag?: boolean = false;
  incloudFieldList?: string[] = [];
  sortFieldFlag?: boolean = false;
  sortList?: Sort[]= [];
  updateFieldFlag?: boolean = false;
  updateList?: KeyValueObject[] = [];
  queryFieldFlag?: boolean = false;
  queryList?: KeyValueObject[] = [];
  pageFlag?:  boolean = false;
  page?: ResourcePage = new ResourcePage();

  addUpdate(key: string, value: any) {
    this.updateFieldFlag = true;
    if (!this.updateList) {
      this.updateList = [];
    }
    const keyValueObject: KeyValueObject = new KeyValueObject();
    keyValueObject.key = key;
    keyValueObject.value = value;
    this.updateList.push(keyValueObject);
  }

  addQuery(key: string, value: any) {
    this.queryFieldFlag = true;
    if (!this.queryList) {
      this.queryList = [];
    }
    const keyValueObject: KeyValueObject = new KeyValueObject();
    keyValueObject.key = key;
    keyValueObject.value = value;
    this.queryList.push(keyValueObject);
  }

  addIncloud(key: string) {
    this.incloudFieldFlag = true;
    if (!this.incloudFieldList) {
      this.incloudFieldList = [];
    }
    this.incloudFieldList.push(key);
    return this ;
  }

  addPage(page: number, size: number) {
    this.pageFlag = true;
    this.page = new ResourcePage();
    this.page.page = page;
    this.page.size = size;
  }

  adMultilanguage(language: string, field: string) {
    this.multilanguageFlag = true;
    if (!this.languageList) {
      this.languageList = [];
    }
    if (!this.languageFieldList) {
      this.languageFieldList = [];
    }
    this.languageList.push(language);
    this.languageFieldList.push(field);
  }

  removeUpdate(key: string) {
    for (let keyV = 0; keyV < this.updateList.length; keyV++) {
      if (this.updateList[keyV].key === key) {
        this.updateList.splice(keyV, 1);
        return;
      }
    }
  }
  addAndRemoveUpdate(key: string, value: any) {
    this.removeUpdate(key);
    this.addUpdate(key, value);
  }
}
