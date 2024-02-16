import {Injectable} from '@angular/core';
import * as socketIo from 'socket.io-client';
// import * as io from 'socket.io-client';

import {Observable} from 'rxjs';
import {PushNotificationService} from 'ngx-push-notifications';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private socket;

    constructor(private pushNotificationService: PushNotificationService
    ) {
    }

    public connect() {
        const token = sessionStorage.getItem('token');
        const url = window.location.host;
        // if (url === '192.168.1.2:3030' || url === 'localhost:4200' || '192.168.1.8:4200') {
        //     this.socket = socketIo('http://192.168.1.3:3000', {
        //         query: 'Authorization=' + token
        //     });
        // } else {
        this.socket = socketIo(`http://${url.split(':')[0]}:3000`, {
            query: 'Authorization=' + token
        });
        // }

    }

    onMessageById(id): Observable<any> {
        return new Observable<any>(observer => {
            this.socket.on(id, (data: any) => {
                observer.next(data);
            });
        });
    }

    disconnect() {
        this.socket.disconnect();
    }

    emit(event: string, data: any) {
        this.socket.emit(event, data);
    }


    onlineNotificationMessage(notification) {
        return;
        if (notification) {
            // this.cacheService.setItem('unSeenNC', 1, CacheType.LOCAL_STORAGE);
            // this.url = LoginUser.Url_Drive;
            // const title = 'پیام جدید' + '(' + notification.message.text + ')';
            // const title = 'پیام جدید' + '(' + notification.message.text + ')';
            // const options = {dir: {} as NotificationDirection} as PushNotificationOptions;
            // options.body = notification.description;
            // options.dir = 'rtl';
            // if (notification.picture) {
            //   options.icon = this.url + notification.picture.imageModel.smallLink;
            // } else {
            //   options.icon = 'assets/images/44_140.jpg';
            // }
            this.pushNotificationService.create(notification).subscribe((notif) => {
                    if (notif.event.type === 'show') {
                        setTimeout(() => {
                            notif.notification.close();
                        }, 5000);
                    }
                    if (notif.event.type === 'click') {
                        notif.notification.close();
                    }
                    if (notif.event.type === 'close') {
                    }
                },
                (err) => {
                });
        }

    }

}

export enum NotifType {
    minus = 'minus' as any,
    plus = 'plus' as any,
}

export class NotifRes {
    userId: string;
    notifType: NotifType;
}
