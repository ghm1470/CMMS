import {Form, FormId} from '../../formBuilder/fb-model/form/form';

export class ActivityLevel {
    id: any;
    title: string;
    recipe: string;
    // userType: UserType = new UserType();
    // organization = new OrganizationDto.Create();
    orgId: string;
    // user: UserByOrganizationId = new UserByOrganizationId();
    // userId: string[];
    candidateUserIdList: string[] = [];
    assignedUserId: string;
    userTypeId: string[];
    // userTypeName: string;
    organizationId: string;
    prevActivityLevel: ActivityLevel;
    nextActivityLevel: ActivityLevel;
    firstStepIs: boolean;
    lastStepIs: boolean;
    showHistory: boolean;
    canOperate: boolean; // نوع اقدام مرحله را داشته باشد یا فقط ثبت میزند
    form = new Form();
    formIdCopy = new FormId();
    formId: any;
    cancel = false;
    startNewActivity = false;
    actionLevel?: string;
    staticFormsIdList: string[] = [];
    rightToChoose: boolean;
    existRecipientOrderUser = false;
    workRequestAcceptor = false;
    workOrderAccessId: string;
    candidateMode: CandidateMode;
    chosenCandidateUserIdList: string[] = [];
}

export enum CandidateMode {
    user_mode = <any>'user_mode',
    userType_mode = <any>'userType_mode',
}
