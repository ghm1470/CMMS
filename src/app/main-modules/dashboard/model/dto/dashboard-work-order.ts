export namespace DashboardWorkOrder {
 export class PendingAndCurrent {
   id;
   title;
   code;
   requiredCompletionDate;
   relatedId;
   late;
 }

 export class Late {
   id;
   title;
   code;
   requiredCompletionDate;
   relatedId;
   late;
 }

 export class Unscheduled {
   workOrderId;
   workOrderTitle;
   workOrderCode;
 }

}
