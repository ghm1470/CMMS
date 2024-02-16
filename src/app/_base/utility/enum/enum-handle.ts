import {EnumObject} from './enum-object';

export class EnumHandle<T> {
    static listEnums = <T>(enumClass: any): T[] => {
        const values: T[] = [];

        for (const key in enumClass) {
            values.push(enumClass[key]);
        }
        // values.length = values.length / 2;
        return values;
    };

    static getEnumObjectList(myEnum) {
        const enumObjectList = [] as EnumObject[];
        for (let i = 0; i < myEnum.length - 1; i += 2) {
            enumObjectList.push(
                JSON.parse('{"_title":"' + myEnum[i] + '","_value":"' + myEnum[i + 1] + '"}'));
        }
        return enumObjectList;
    }

    static ConvertByModel(myObjectModel) {
        const arr = Object.entries(myObjectModel)
        const enumObjectList = [] as EnumObject[];
        for (const a of arr) {
            enumObjectList.push(
                JSON.parse('{"_title":"' + a[1] + '","_value":"' + a[0] + '"}'));
        }
        return enumObjectList;
    }
}
