import {Injectable} from '@angular/core';
import {ServiceBase2, ServiceConfig} from '@angular-boot/core';
import {HttpClient} from '@angular/common/http';
import {Paging} from '@angular-boot/util';
import {SenderDTO} from "../sent/feature/list/sent-list.component";
import {SenderInfoDTO} from "../inbox/feature/list/inbox-list.component";
import {SystemMessagesDateDTO} from "../systemMessages/feature/list/system-messages-list.component";
import {DeletedNotificationDTO} from "../trash/feature/list/trash-list.component";

@Injectable({
  providedIn: 'root'
})
export class NotificationService extends ServiceBase2 {

  constructor(public _HttpClient: HttpClient, public _ServiceConfig: ServiceConfig
  ) {
    super();
    this._objectName = 'notification';
    this.prefixMatches = this.getMatches(this._prefix);
  }


  // createNotification() {
  //   const suffixPath = 'make-id-and-creation-date';
  //   return super.postService( null, {
  //     needToken: true,
  //     objectPrefix: this.getPrefix({}),
  //     objectSuffix: this.replaceParams(suffixPath, {}),
  //     // responseContentType: ResponseContentType.Json,
  //   });
  // }
  createNotification(item) {
    const suffixPath = 'save';
    return super.postService(item, {
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      // responseContentType: ResponseContentType.Json,
    });
  }

  getCreationDate() {
    const suffixPath = 'get-creation-date';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
    });
  }

  getAllInbox(query: { userId: string }) {
    const suffixPath = 'get-all-private-messages-of-the-user';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }

  getAllSent(query: { userId: string }) {
    const suffixPath = 'get-all-sender-user-information';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }

  getAllystemMesege(query: { userId: string }) {
    const suffixPath = 'get-all-system-messages-of-the-user';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }

  getAllTrash(query: { userId: string }) {
    const suffixPath = 'get-all-deleted-notification';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }

  delete(query: { notificationId: string }) {
    const suffixPath = 'delete';
    return super.deleteService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }

  deleteTrash(query: { notificationId: string }) {
    const suffixPath = 'remove-deleted-notification';
    return super.deleteService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }

  deleteNotification(query: { notificationId: string, senderOrReceiver: string }) {
    const suffixPath = 'delete';
    return super.deleteService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }

  update(item) {
    const suffixPath = 'update';
    return super.putService(item, {
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
    });
  }

  getPage(query: { paging: Paging, totalElements: any, term?: string }) {
    const suffixPath =
      'get-page';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }

  getList(query: { term, limit }) {
    const suffixPath =
      'get-list';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }


  getOne(query: { notificationId: string }) {
    const suffixPath =
      'get-one-sender-and-receiver-information';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }

  getOneSystemMessage(query: { notificationId: string }) {
    const suffixPath =
      'get-one-system-and-receiver-information';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }


  getAllSenderUserInformation(item: SenderDTO, query: {
    paging: Paging, totalElements: any, term?: string, userId: string, sort: boolean
  }) {
    const suffixPath =
      'get-all-sender-user-information';
    return super.postService(item, {
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }

  getAllPrivateMessagesOfTheUser(item: SenderInfoDTO, query: {
    paging: Paging, totalElements: any, term?: string, userId: string, sort: boolean
  }) {
    const suffixPath =
      'get-all-private-messages-of-the-user';
    return super.postService(item, {
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }

  getAllSystemMessagesOfTheUser(item: SystemMessagesDateDTO, query: {
    paging: Paging, totalElements: any, term?: string, userId: string, sort: boolean
  }) {
    const suffixPath =
      'get-all-system-messages-of-the-user';
    return super.postService(item, {
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }

  getAllDeletedNotification(item: DeletedNotificationDTO , query: {
    paging: Paging, totalElements: any, term?: string, userId: string, sort: boolean
  }) {
    const suffixPath =
      'get-all-deleted-notification';
    return super.postService(item, {
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }
}

