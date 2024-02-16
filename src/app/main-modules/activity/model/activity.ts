import {ActivityLevel} from './activityLevel';

export class Activity {
    id: string;
    title: string;
    description: string;
    // organizationId: string;
    activityLevelList: Array<ActivityLevel> = [];
    fromSchedule: boolean;
    // workOrderAccessId: string;
}

export class ActivityInfo {
    id: string;
    title: string;
}


