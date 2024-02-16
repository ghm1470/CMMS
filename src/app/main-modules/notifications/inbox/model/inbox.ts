import {UserType} from '../../../formBuilder/fb-model/enumeration/enum/UserType';


export namespace Inbox {
  export class Create {
    creationDate: Date;
    id: string;
    subject: string;
    message: string;
    recipientUserId: string;
    senderUserId: string;
    senderReceiver: SenderReceiver;
    formData: FormData;
  notificationUploadList: NotificationUpload [];
  }

  export class GetAll {
    creationDate: Date;
    id: string;
    subject: string;
    message: string;
    abstractMessage: string;
    recipientUserId: string;
    senderUserId: string;
    senderName: string;
    senderFamilyName: string;
    notificationUploadList: NotificationUpload [];

  }

  export class GetAllForSender {
    creationDate: Date;
    notificationId: string;
    subject: string;
    message: string;
    abstractMessage: string;
    recipientUserId: string;
    userId: string;
    userName: string;
    userFamily: string;
    id?: string;
    senderFamilyName: string;
    senderName: string;
    notificationUploadList: NotificationUpload [];

  }

  export class GetAllForRecipient {
    creationDate: Date;
    notificationId: string;
    subject: string;
    message: string;
    abstractMessage: string;
    recipientUserId: string;
    senderUserId: string;
    senderName: string;
    senderFamilyName: string;
    id?: string;
    notificationUploadList: NotificationUpload [];


  }

  export class GetTrash {
    creationDate: Date;
    notificationId: string;
    subject: string;
    abstractMessage: string;
    recipientUserName: string;
    recipientUserFamily: string;
    senderUserName: string;
    senderUserFamily: string;
    id?: string;
    notificationUploadList: NotificationUpload [];


  }

  export class GetOne {
    creationDate: Date;
    id: string;
    message: string;
    subject: string;
    userNameRecipient: string;
    userFamilyRecipient: string;
    userIdRecipient: string;
    userNameSender: string;
    userFamilySender: string;
    userIdSender: string;
    notificationUploadList: NotificationUpload [];

  }

  export class User {
    id: string;
    name: string;
    family: string;
    userTypeName: UserType;

  }

  export enum SenderReceiver {
    SENDER, RECEIVER
  }

  export class DocumentFile {
    id: string;
    fileByte: any;
    fileName: string;
    fileContentType: string;
    companyId: string;
    extraId: string;
  }
  export class NotificationUpload {
    id;
    name;
    fileType;
  }
}
