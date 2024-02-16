import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {ActionMode, Toolkit2} from '@angular-boot/util';
import {UserDto} from '../../model/dto/user-dto';
import {ActivatedRoute} from '@angular/router';
import {UserService} from '../../endpoint/user.service';
import {takeUntilDestroyed} from '@angular-boot/core';
import {isNullOrUndefined} from 'util';
import {Moment} from "../../../../shared/shared/tools/date/moment";

declare var $: any;

@Component({
    selector: 'app-user-view',
    templateUrl: './user-view.component.html',
    styleUrls: ['./user-view.component.scss']
})
export class UserViewComponent implements OnInit, OnDestroy, AfterViewInit {
    mode: ActionMode = ActionMode.ADD;
    actionMode = ActionMode;
    user = new UserDto.Create();
    userCopy = new UserDto.CreateUserMainInformation();
    userInformation = new UserDto.GetOneUserMainInformation();
    userId: string;
    myMoment = Moment;

    organizationList: any[] = [];
    menuStatus = false;
    // showSecondaryInformation = false;
    showMessaging = false;
    showChildUsers = false;
    showCertification = false;
    showFileDocument = false;

    constructor(public location: Location,
                private activatedRoute: ActivatedRoute,
                private userService: UserService,
    ) {
        this.userId = this.activatedRoute.snapshot.queryParams.userId;
    }

    ngOnInit() {
        if (!isNullOrUndefined(this.userId)) {

            this.getOne();
            this.menuStatus = true;
        }
    }

    ngAfterViewInit(): void {
        // this.showSecondaryInformation = true;
        setTimeout(e => {
            $('#showSecondaryInformation').click();
        }, 1000);
    }


    getOne() {
        this.userService.getOneMainInformation({userId: this.userId})
            .pipe(takeUntilDestroyed(this)).subscribe((res: UserDto.GetOneUserMainInformation) => {
            if (res) {
                this.userInformation = res;
                this.userCopy.nationalCode = JSON.parse(JSON.stringify(res.nationalCode));
                if (!isNullOrUndefined(this.user.birthDay)) {
                    $('#birthDay').val(Toolkit2.Common.En2Fa(this.myMoment.convertIsoToJDate(this.user.birthDay)));
                }
                if (!isNullOrUndefined(this.user.startWork)) {
                    $('#startWork').val(Toolkit2.Common.En2Fa(this.myMoment.convertIsoToJDate(this.user.startWork)));

                }
            }
        });
    }


    cancel() {
        this.location.back();

    }

    ngOnDestroy(): void {
    }

}


