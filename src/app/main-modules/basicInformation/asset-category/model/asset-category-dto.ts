export namespace AssetCategoryDto {
    export class GetList {
        id: string;
        title: string;
        description: string;
    }

    export class GetOne {
        id: string;
        title: string;
        description: string;
    }

    export class Create {
        title: string;
        description: string;
    }
    export class Update {
        id: string;
        title: string;
        description: string;
    }

    export class NewCategoryForGetAllByPagination {
        title: string
    }
}
