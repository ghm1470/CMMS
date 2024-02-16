import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ModalUtil} from '@angular-boot/widgets';
import {CacheService, CacheType, takeUntilDestroyed} from '@angular-boot/core';
import {Auth} from '../../../shared/constants/cacheKeys';
import {TokenRoleList} from '../../../shared/shared/constants/tokenRoleList';
import {ActivityService} from '../../../main-modules/activity/service/activity.service';
import {DataService} from '../../../shared/service/data.service';
import {isNullOrUndefined, Toolkit2} from '@angular-boot/util';

declare var $: any;

@Component({
    selector: 'app-vertical-menu',
    templateUrl: './vertical-menu.component.html',
    styleUrls: ['./vertical-menu.component.scss', 'vertical-menu.component.rtl.scss']
})
export class VerticalMenuComponent implements OnInit, OnDestroy, AfterViewInit {
    roleList = new TokenRoleList();

    showCurrentVertical = false;
    count: number;
    toolkit = Toolkit2;
    // menuitem1: string;
    // menuitem2: string;
    // menuitem3: string;

    constructor(public router: Router, public activatedRoute: ActivatedRoute,
                private cacheService: CacheService,
                private activityService: ActivityService) {
    }

    ngOnInit() {
        DataService.getTotal.pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
            if (!isNullOrUndefined(res)) {
                this.count = res;
            }
        });
        this.getRoleListKey();
        this.countPendingActivityOfTheUser();
    }

    ngOnDestroy(): void {
    }

    openModal() {
        this.showCurrentVertical = true;
        ModalUtil.showModal('adjustmentInventory');
    }

/// خواندن تعداد فرایند در انتظار تایید تصادفی
    countPendingActivityOfTheUser() {
        const user = JSON.parse(sessionStorage.getItem('user'));
        this.activityService.countPendingActivityOfTheUser({userId: user.id}).pipe(takeUntilDestroyed(this))
            .subscribe((res: any) => {
                if (!isNullOrUndefined(res)) {
                    this.count = res;
                    DataService.setTotal(res);
                }
            });
    }

    // buildForm() {
    //   FormState.reset();
    //   this.router.navigate(['/panel/form']);
    // }

    getRoleListKey() {
        this.cacheService.getItem(Auth.RoleListKey, CacheType.LOCAL_STORAGE).pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
            if (res) {
                this.roleList = res;
            }
        });
    }

    setNumberOfPage(key) {
        this.cacheService.setItem('numberPageUser', 0, CacheType.LOCAL_STORAGE);
        this.cacheService.set('budgetPage', 0, CacheType.LOCAL_STORAGE);
    }

    ngAfterViewInit(): void {
        const menuitem1 = sessionStorage.getItem('menuitem1');
        if (menuitem1) {
            // this.menuitem1 = menuitem1;
            setTimeout(e => {
                $('#' + menuitem1).click();
            }, 500);
            const menuitem2 = sessionStorage.getItem('menuitem2');
            if (menuitem2) {
                // this.menuitem2 = menuitem2;
                setTimeout(e => {
                    $('#' + menuitem2).click();
                }, 100);
                const menuitem3 = sessionStorage.getItem('menuitem3');
                if (menuitem3) {
                    // this.menuitem3 = menuitem3;
                    setTimeout(e => {
                        $('#' + menuitem3).click();
                    }, 100);
                }
            }
        }

    }

    setMenuItem(route?: boolean, menuitem1?, menuitem2?, menuitem3?) {
        sessionStorage.setItem('menuitem1', menuitem1);
        sessionStorage.setItem('menuitem2', menuitem2);
        sessionStorage.setItem('menuitem3', menuitem3);
        if (route) {
            this.CloseNav();
        }

        // if (item === 'menuitem1') {
        //     // if (this.menuitem1 === value) {
        //     //     sessionStorage.removeItem('menuitem1');
        //     //     sessionStorage.removeItem('menuitem2');
        //     //     sessionStorage.removeItem('menuitem3');
        //     // } else {
        //     this.menuitem1 = value;
        //     sessionStorage.removeItem('menuitem2');
        //     sessionStorage.removeItem('menuitem3');
        //     // }
        // }
        // if (item === 'menuitem2') {
        //     // if (this.menuitem2 === value) {
        //     //     sessionStorage.removeItem('menuitem2');
        //     //     sessionStorage.removeItem('menuitem3');
        //     // } else {
        //     this.menuitem2 = value;
        //     sessionStorage.setItem('menuitem2', this.menuitem2);
        //     sessionStorage.removeItem('menuitem3');
        //     // }
        // }
        // if (item === 'menuitem3') {
        //     // if (this.menuitem3 === value) {
        //     //     sessionStorage.removeItem('menuitem3');
        //     // } else {
        //     this.menuitem3 = value;
        //     sessionStorage.setItem('menuitem3', this.menuitem3);
        //     // }
        // }

    }

    CloseNav() {
        if ($(window).width() < 769) {
            $('#sidebar').addClass('active');
        }
    }
}
