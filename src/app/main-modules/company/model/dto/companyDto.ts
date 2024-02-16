export namespace CompanyDto {
    export class Create {
        id: string;
        name: string;
        code: string;
        phoneNumber: string;
        email: string;
        webSite: string;
        fax: string;
        description: string;
        address: Address = new Address();
        // currency: Currency = new Currency();
        currencyId: string;
        currencyName: string;
        documents: Array<Document> = [];
        assets: Array<any> = [];
        users: Array<any> = [];
        type: string;
    }

    export class GetPage {
        address: Address = new Address();
        code: string;
        currencyId: string;
        currencyName: string;
        description: string;
        documents: [];
        email: string;
        fax: string;
        id: string;
        name: string;
        phoneNumber: string;
        type: string;
        webSite: string;
    }

    export class Document {
        fileContentType: string;
        id: string;
        showName: string;
        fileName: string;
    }

    export class Address {
        id: string;
        // city: City = new City();
        cityId: string;
        cityName: string;
        // province: Province = new Province();
        provinceId: string;
        provinceName: string;
        location: Location = new Location();
        column: string;
        row: string;
        bin: string;
        description: string;
        postalCode: string;
    }

    export class Location {
        lat: number;
        lng: number;
    }

    // export class Document {
    //   id: string;
    //   title: string;
    //   extension: string;
    //   path: string;
    //   size: number;
    //   caption: string;
    //   contentType: string;
    //   documentFiles: Array<DocumentFile>;
    //   serial: string;
    //   description: string;
    //   dateOfRegistration: string;
    // }

    export class DocumentFile {
        // id: string;
        // name: string;
        // url: string;
        // fileType: FileType;
        id: string;
        fileByte: any;
        fileName: string;
        fileContentType: string;
        companyId: string;
        extraId: string;
        showName: string;
        forSchedule: boolean;
    }

    export enum FileType {

    }

}
