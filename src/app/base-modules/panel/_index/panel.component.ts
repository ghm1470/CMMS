import {AfterViewInit, Component, OnInit} from '@angular/core';
import {UserDto} from '../../../main-modules/user/model/dto/user-dto';
import {isNullOrUndefined} from 'util';
import {Router} from '@angular/router';
import {UserType} from '../../../main-modules/securityManagement/model/userType';
import {DefaultNotify} from "@angular-boot/util";
import {NotiConfig} from "../../../shared/tools/notifyConfig";
import {NotificationService, NotifRes, NotifType} from "../../../notificationService/notification.service";
import {PushNotificationService} from "ngx-push-notifications";
import {DataService} from "../../../shared/service/data.service";

declare var $: any;

@Component({
    selector: 'app-panel',
    templateUrl: './panel.component.html',
    styleUrls: ['./panel.component.scss']
})
export class PanelComponent implements OnInit, AfterViewInit {

    user: UserDto.Create = new UserDto.Create();
    userType: UserType = new UserType();

    constructor(protected router: Router,
                private notificationService: NotificationService,
                private pushNotificationService: PushNotificationService) {
        // alert(sessionStorage.getItem('user'));
        this.user = JSON.parse(sessionStorage.getItem('user'));
        this.userType = JSON.parse(sessionStorage.getItem('userType'));
        if (isNullOrUndefined(this.user)) {
            router.navigateByUrl('/');
        }
    }

    ngOnInit() {
        this.connect();

    }

    ngAfterViewInit(): void {
        $(document).ready(function () {
            $('#sidebarCollapse').on('click', function () {
                $('#sidebar').toggleClass('active');
                $(this).toggleClass('active');
            });
            $('.toggle-sidebar').on('click', function () {
                if (window.matchMedia('(max-width: 768px)').matches) {
                    $('#sidebar').toggleClass('active');
                }
            });
        });
    }

    connect() {
        this.pushNotificationService.requestPermission();
        this.notificationService.connect();
        this.onMessage();
    }

    onMessage() {
        const user = JSON.parse(sessionStorage.getItem('user'));
        this.notificationService.onMessageById(user.id).subscribe((res: NotifRes) => {
            if (res.notifType === NotifType.plus) {
                this.playNotificationSound();
                DefaultNotify.notifySuccess('  درخواست کار جدید برای شما ثبت شد.', '', NotiConfig.notifyConfig);
                this.notificationService.onlineNotificationMessage('  درخواست کار جدید برای   شما ثبت شد.');
            }
            this.setTotal(res.notifType);

        });
        this.notificationService.onMessageById(user.userTypeId).subscribe((res: NotifRes) => {
            if (res.notifType === NotifType.plus) {
                this.playNotificationSound();
                DefaultNotify.notifySuccess('  درخواست کار جدید برای  پست شما ثبت شد.', '', NotiConfig.notifyConfig);
                this.notificationService.onlineNotificationMessage('  درخواست کار جدید برای  پست شما ثبت شد.');
            }
            this.setTotal(res.notifType);

        });
        // alert('onMessage----------------00')


    }

    setTotal(type: NotifType) {
        let t = +localStorage.getItem('Total');
        if (type === NotifType.plus) {
            t += 1;
        } else if (type === NotifType.minus) {
            t -= 1;
            if (t < 0) {
                t = 0;
            }
        }
        DataService.setTotal(t);

    }

    playNotificationSound() {
        const x = document.getElementById('notificationSound');
        (<any>x).play();
        setTimeout(() => {
            const x2 = document.getElementById('notificationSound2');
            (<any>x2).play();
        }, 600);
    }
}
