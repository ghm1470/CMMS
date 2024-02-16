import {WorkOrderDto} from '../../../workOrder/model/dto/workOrderDto';
import {CompanyDto} from '../../../company/model/dto/companyDto';

export namespace TaskGroupDto {
    import DocumentFile = CompanyDto.DocumentFile;

    export class Create {
        id: string;
        name: string;
        code: string;
        taskList: TaskS[] = [];
        tasks: TaskS[] = [];
        documents: DocumentFile[] = [];
    }

    export class TaskS {
        title: string;
        code: string;
        description: string;
    }

    export class Task {
        id: string;
        title: string;
        timeEstimate: number;
        description: string;
        code: string;
        taskType: TaskType;
        users: any[] = []; // list of ObjectId
        price: number;
        status: string;
        referenceId: string;
        taskGroupId: string;
        forSchedule: boolean;
    }

    export enum TaskType {
        GENERAL = <any>'عمومی',
        METERREADING = <any>'متراژ'
    }

}
