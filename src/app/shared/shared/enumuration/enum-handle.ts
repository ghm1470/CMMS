import {EnumObject} from './enum-object';

export class EnumHandle<T> {
  static listEnums = <T>(enumClass: any): T[] => {
    const values: T[] = [];
    for (const key in enumClass) {
      values.push(enumClass[key]);
    }
    return values;
  };

  static getEnumObjectList(myEnum) {
    const enumObjectList = [] as EnumObject[];
    for (let i = 0; i < myEnum.length - 1; i += 2) {
      enumObjectList.push(
        JSON.parse('{"title":"' + myEnum[i] + '","value":"' + myEnum[i + 1] + '"}'));
    }
    return enumObjectList;
  }
}
