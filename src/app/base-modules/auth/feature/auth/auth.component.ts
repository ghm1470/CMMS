import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../endpoint/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {SignIn} from '../../model/dto/sign-in';
import {untilDestroyed} from '../../../../shared/service/take-until-destroy';
import {DefaultNotify, ModalSize, Toolkit2} from '@angular-boot/util';
import {ModalUtil} from '@angular-boot/widgets';
import {Tools} from '../../../../shared/tools/Tools';
import {isNullOrUndefined} from 'util';
import {CacheService, CacheType} from '@angular-boot/core';
import {Auth} from '../../../../shared/constants/cacheKeys';
import {TokenRoleList} from '../../../../shared/shared/constants/tokenRoleList';
import {CaptchaService} from '../../endpoint/captcha.service';
import {Image} from '../../../../main-modules/formBuilder/shared/model/Image';
import {NotiConfig} from "../../../../shared/tools/notifyConfig";


@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {

    mode = 'signIn';
    signIn = new SignIn();
    forgetPass = new ForgetPass();
    action = true;
    loader = false;
    tools = Tools;
    MyModalSize = ModalSize;
    orgAndUserTypeList: OrgNameAndUserTypeName[] = [];
    orgAndUserType = new OrgNameAndUserTypeName();
    userPass = new UserPass();
    captcha = new Captcha();
    constructor(private authService: AuthService,
                private router: Router,
                private captchaService: CaptchaService,
                private cacheService: CacheService) {
        if (sessionStorage.getItem('token')) {
            // this.router.navigateByUrl('/panel');
            this.router.navigateByUrl('/panel/calender');
        }
    }

    ngOnInit() {
    }

    ngOnDestroy(): void {
    }

    signInFunction(form) {
        if (form.valid) {
            if (this.action) {
                this.action = false;
                this.authService.signin(this.signIn)
                    .pipe(untilDestroyed(this))
                    .subscribe((res) => {
                        this.action = true;
                        if (res === 'کاربری با این مشخصات وجود ندارد') {
                            DefaultNotify.notifyDanger(res, '', NotiConfig.notifyConfig);
                        } else if (!isNullOrUndefined(res) && !isNullOrUndefined(res.token)) {
                            this.loader = true;
                            setTimeout(() => {

                                // sessionStorage.setItem('token', res.token);
                                // sessionStorage.setItem('user', res.user);
                                // this.router.navigateByUrl('/panel');


                                //
                                sessionStorage.setItem('token', res.token);
                                sessionStorage.setItem('user', JSON.stringify(res.userAndUserTypDTO.user));
                                sessionStorage.setItem('userType', JSON.stringify(res.userAndUserTypDTO.userType));
                                const roleList = TokenRoleList.CreateRoleList(res.userAndUserTypDTO.userType.privilege);
                                this.cacheService.setItem(Auth.RoleListKey, roleList, CacheType.LOCAL_STORAGE);
                                // this.router.navigateByUrl('/panel');
                                this.router.navigateByUrl('/panel/calender');
                                //
                            }, 100);
                        } else {
                            DefaultNotify.notifyDanger('ورود انجام نشد دوباره تلاش کنید.', '', NotiConfig.notifyConfig);
                        }
                    }, error => {
                        this.action = true;
                    });
            }
        } else {
            DefaultNotify.notifyDanger('اطلاعات فرم کامل نیست.', '', NotiConfig.notifyConfig);
        }
    }

    signInFunction1(form) {
        this.orgAndUserTypeList = [];
        if (form.valid) {
            if (this.action) {
                this.action = false;
                this.signIn.password = Toolkit2.Common.Fa2En(this.signIn.password);
                this.authService.firstSignIn(this.signIn)
                    .pipe(untilDestroyed(this))
                    .subscribe((res: OrgAndUserTypeName[]) => {
                        if (res) {
                            this.loader = false;
                            this.action = true;
                            for (const item of res) {
                                for (const item2 of item.userTypeList) {
                                    this.orgAndUserType = new OrgNameAndUserTypeName();
                                    this.orgAndUserType.userTypeName = item2.userTypeName;
                                    this.orgAndUserType.userTypeId = item2.userTypeId;
                                    this.orgAndUserType.organizationName = item.organizationName;
                                    this.orgAndUserType.organizationId = item.organizationId;
                                    this.orgAndUserTypeList.push(this.orgAndUserType);
                                }
                            }
                            ModalUtil.showModal('showUserTypeAndOrgForLogin');
                        }
                    }, error => {
                        this.loader = false;
                        this.action = true;
                        DefaultNotify.notifyDanger(error.error.message, '', NotiConfig.notifyConfig);
                    });
            }

        }
    }


    chooseUserType(item: OrgNameAndUserTypeName) {
        this.userPass.username = this.signIn.username;
        this.userPass.userTypeId = item.userTypeId;
        this.authService.secondLogin(this.userPass)
            .pipe(untilDestroyed(this))
            .subscribe((res) => {
                if (!isNullOrUndefined(res.token)) {

                    sessionStorage.setItem('token', res.token);
                    sessionStorage.setItem('user', JSON.stringify(res.userAndUserTypDTO.user));
                    const roleList = TokenRoleList.CreateRoleList(res.userAndUserTypDTO.userType.privilege);
                    // this.cacheService.setItem(Auth.RoleListKey, roleList, CacheType.LOCAL_STORAGE);
                    this.router.navigateByUrl('/panel');
                    this.router.navigateByUrl('/panel/calender');
                }
            });
    }

    forgetFunction(loginForm) {

    }

    refreshCaptcha() {
        alert(10)
        this.captchaService.createCaptcha()
            .pipe(untilDestroyed(this))
            .subscribe((res) => {
                if (res) {
                    this.captcha.image = res.image();
                }
            });
    }
}


export class OrgAndUserTypeName {
    organizationId: string;
    organizationName: string;
    userTypeList: UserTypeNameAndIdDTO[];
}

export class UserTypeNameAndIdDTO {
    userTypeId: string;
    userTypeName: string;
}

export class OrgNameAndUserTypeName {
    organizationId: string;
    organizationName: string;
    userTypeId: string;
    userTypeName: string;
}

export class UserPass {
    username: string;
    userTypeId: string;
}

export class ForgetPass {
    phoneOrEmail: string;
    captcha: string;

}


export class Captcha {
    image: any;
    code: string;
    expireDate: Date;
}
