import {Component, OnDestroy, OnInit} from '@angular/core';
import {BaseCoreService} from '../services/base-core.service';
import {AuthService} from '../../auth/endpoint/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NotificationService} from "../../../notificationService/notification.service";

@Component({
    selector: 'app-header2',
    templateUrl: './header2.component.html',
    styleUrls: ['./header2.component.scss']
})
export class Header2Component implements OnInit, OnDestroy {

    isCollapsed = true;

    constructor(public baseCoreService: BaseCoreService,
                public authService: AuthService,
                public router: Router,
                public notificationService: NotificationService,
                public activatedRoute: ActivatedRoute) {
    }

    ngOnInit() {
    }

    toggleSidebarPin() {

    }

    toggleSidebar() {

    }

    logOut() {
        sessionStorage.clear();
        sessionStorage.clear();
        this.router.navigateByUrl('/');
        this.notificationService.disconnect();
    }

    ngOnDestroy(): void {
    }

}
