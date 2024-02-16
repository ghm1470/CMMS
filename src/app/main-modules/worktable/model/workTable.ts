import {WorkOrderAccess} from '../../activity/model/work-order-access';
import {
    ActivityLevelSequenceHistory
} from '../../submitWorkRequest/feature/acceptation-process/acceptation-process.component';
import {WorkOrderDto} from '../../workOrder/model/dto/workOrderDto';
import {Form} from '../../form-builder2/model/form';
import {FormData} from '../../form-builder2/model/form-data';
import {TaskGroupDto} from '../../taskGroup/model/dto/taskGroupDto';
import {PartWithUsageCount} from '../../workOrder/feature/part-with-usage-count/model/PartWithUsageCount';
import {Notify} from '../../workOrder/feature/notify/model/notify';
import {CompanyDto} from '../../company/model/dto/companyDto';

export namespace WorkTableDto {

  import WorkOrderBasicInformation = WorkOrderDto.WorkOrderBasicInformation;
  import Task = TaskGroupDto.Task;
  import MiscCost = WorkOrderDto.MiscCost;
  import DocumentFile = CompanyDto.DocumentFile;

  export class GetAllActivityLevel {
    actionLevel: ActionLevel;
    cancel: boolean;
    firstStepIs: boolean;
    id: string;
    nextActivityLevel: NextActivityLevel;
    recipe: string;
    title: string;
    form: any;
    formDataId: string;
    organizationId: string;
    prevActivityLevel: NextActivityLevel;
    userFamilyName: string;
    assignedUserName: string;
    assignedUserFamily: string;
    username: string;
    userId: string;
    userTypeId: string;
    userTypeTitle: string;
    pendingDate: any;
    staticFormsIdList: string[] = [];
    rightToChoose: boolean;
    existRecipientOrderUser: boolean;
    workOrderAccessId: string;
    workOrderAndFormRepositoryId: string;
  }

  export class NextActivityLevel {
    id: string;
    cancel: string;
    actionLevel: ActionLevel;
  }

  export class ActivitySampleWithWorkOrderAccessDTO {
    activitySample = new ActivitySample();
    workOrderAccess: WorkOrderAccess;
  }
  export class ActivitySample {
    active: boolean;
    activityInstanceId: string;
    activityLevelList: GetAllActivityLevel[] = [];
    activityLevelSequenceHistory: ActivityLevelSequenceHistory[] = [];
    description: string;
    id: string;
    relatedActivityId: string;
    requesterId: string;
    title: string;
    workOrderId: string;
    workRequestTitle: string;
    fromSchedule = false;
  }
  export class ActivitySampleWorkOrderAndFormRepository {
    id: string;
    activityLevelId: string;
    activityInstanceId: string;
    workOrderCreateDTO = new WorkOrderDto.Create();
    taskGroupList: string [] = [];
    taskList: Task[] = [];
    notifyList: Notify[] = [];
    partWithUsageCountList: PartWithUsageCount[] = [];
    miscCostList: MiscCost[] = [];
    completionDetail = new WorkOrderDto.CompletionDetail();
    workOrderBasicInformation = new WorkOrderBasicInformation();
    formData = new FormData();
    form = new Form();
    numberOfParticipation: number;
    documentList: DocumentFile[] = [];
  }

  export class Sequence {
    levelId: string;
    status: string;
    ActivityLevel: GetAllActivityLevel;
    dateViewMode: any;
    levelEndDate: any;
    workOrderId: string;
  }

  export enum ActionLevel {
    pending = 'در حال بررسی' as any,
    accepted = 'تایید شده' as any,
    rejected = 'رد شده' as any ,
    waiting = 'وضعیت نا معلوم' as any ,
  }


}
