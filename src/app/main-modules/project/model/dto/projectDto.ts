import {WorkOrderDto} from '../../../workOrder/model/dto/workOrderDto';
import {CompanyDto} from '../../../company/model/dto/companyDto';
import {ScheduleMaintenanceDto} from '../../../scheduleMaintenance/model/dto/scheduleMaintenanceDto';
import {UserDto} from "../../../user/model/dto/user-dto";

export namespace ProjectDto {

    import DocumentFile = CompanyDto.DocumentFile;

    export class Create {
        id: string;
        name: string;
        code: string;
        startDate: any;
        endDate: any;
        actualEndDate: any;
        actualStartDate: any;
        requiredCompletionDate: any;
        description: string;
        users: Array<string> = [];
        // users: UserDto.Create[] = [];
        documents: Array<DocumentFile> = [];
        workOrders: Array<WorkOrderDto.Create> = [];
        scheduleMaintenances: Array<ScheduleMaintenanceDto.Create> = [];
    }

    export class ProjectGroupPersonnelDTO {
        userTypeId: string;
        userTypeName: string;
    }

}
