import {EnumObject} from '../enumuration/enum-object';

export class LanguageTools {

  // public static new(enumClass: any): SelectFillLanguage {
  //   let selectFillLanguage: SelectFillLanguage = new SelectFillLanguage();
  //   let nonSelect: EnumObject[] = EnumHandle.getEnumObjectList(enumClass);
  //   selectFillLanguage.nonSelect = nonSelect;
  //   return selectFillLanguage;
  // }

  public static addLanguage(languageList: EnumObject[], languageEnumSet: EnumObject, newLanguageList: any[]) {
    const enumlang: EnumObject[] = [];
    for (let i = 0; i < newLanguageList.length; i++) {
      if (languageEnumSet.value === newLanguageList[i]) {
        enumlang.push(languageEnumSet);
      }
      for (let j = 0; j < languageList.length; j++) {
        if (languageList[j].value === newLanguageList[i]) {
          enumlang.push(languageList[j]);
        }
      }
    }
    return enumlang;
  }

  public static addLanguageOrgChart(languageList: EnumObject[], newLanguageList: any[]) {
    const enumlang: EnumObject[] = [];
    for (let i = 0; i < newLanguageList.length; i++) {
      // if (languageEnumSet.value == newLanguageList[i]) {
      //   enumlang.push(languageEnumSet);
      // }
      for (let j = 0; j < languageList.length; j++) {
        if (languageList[j].value === newLanguageList[i]) {
          enumlang.push(languageList[j]);
        }
      }
    }
    return enumlang;
  }

  public static addLanguageInserOrg(languageList: EnumObject[], languageEnumSet: EnumObject, newLanguageList: any[]) {
    const enumlang: EnumObject[] = [];
    if (newLanguageList.length === 0) {
      enumlang.push(languageEnumSet);
    } else {
      for (let i = 0; i < newLanguageList.length; i++) {
        for (let j = 0; j < languageList.length; j++) {
          if (languageList[j].value === newLanguageList[i]) {
            enumlang.push(languageList[j]);
          }
        }
      }
    }

    return enumlang;
  }

  public static addLanguageUpdate(languageList: EnumObject[], languageEnumSet: EnumObject[], newLanguageList: any[]) {
    const enumlang: EnumObject[] = [];
    for (let i = 0; i < newLanguageList.length; i++) {
      for (let j = 0; j < languageEnumSet.length; j++) {
        if (languageEnumSet[j].value === newLanguageList[i]) {
          enumlang.push(languageEnumSet[j]);
        }
      }
      // if (languageEnumSet.value == newLanguageList[i]) {
      //   enumlang.push(languageEnumSet);
      // }
      for (let k = 0; k < languageList.length; k++) {
        if (languageList[k].value === newLanguageList[i]) {
          enumlang.push(languageList[k]);
        }
      }
    }
    return enumlang;
  }

}

