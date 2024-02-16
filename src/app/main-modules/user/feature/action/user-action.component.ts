import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {isNullOrUndefined} from 'util';
import {ActionMode, DefaultNotify, Toolkit2} from '@angular-boot/util';
import {UserDto} from '../../model/dto/user-dto';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../endpoint/user.service';
import {takeUntilDestroyed} from '@angular-boot/core';
import {MyPattern} from '../../../../shared/shared/tools/myPattern';
import {FileModel} from '../../../../shared/model/fileModel';
import {UploadService} from '../../../../shared/service/upload.service';
import {CompanyDto} from '../../../company/model/dto/companyDto';
import {UserTypeService} from '../../../securityManagement/endpoint/user-type.service';
import {Subject} from 'rxjs';
import {TokenRoleList} from '../../../../shared/shared/constants/tokenRoleList';
import {Location} from '@angular/common';
import DocumentFile = UserDto.DocumentFile;
import {CheckNationalCode} from '../../../../shared/tools/chekeNashnalCode/checkNationalCode';
import {OrganizationService} from '../../../basicInformation/organization/endpoint/organization.service';
import {Tools} from '../../../../shared/tools/Tools';
import {Moment} from '../../../../shared/shared/tools/date/moment';
import {NotiConfig} from "../../../../shared/tools/notifyConfig";
import {Dimensions, ImageCroppedEvent, ImageTransform} from "ngx-image-cropper";

declare var $: any;

@Component({
    selector: 'app-user-action',
    templateUrl: './user-action.component.html',
    styleUrls: ['./user-action.component.scss']
})
export class UserActionComponent implements OnInit, OnDestroy, AfterViewInit {
    @Input() mode: ActionMode = ActionMode.ADD;
    @Input() userId: string;
    @Output() back = new EventEmitter<any>();
    @Output() edit = new EventEmitter<any>();
    actionMode = ActionMode;
    user = new UserDto.Create();
    userCopy = new UserDto.GetOneUserMainInformation();
    roleList = new TokenRoleList();
    userTypeList: UserDto.UserSelectList[] = [];
    userTypeListCopy: UserDto.UserSelectList[] = [];
    checkNationalCodeLoading = false;
    //
    hideOld: boolean;
    hideConfirm: boolean;
    //
    myPattern = MyPattern;
    myMoment = Moment;
    showValid = false;
    tools = Tools;

    files: Array<File> = [];
    fileModel: Array<any> = [];
    loading = false;
    checkNationalCode = true;
    checkIfUsername = false;
    userInformation = new UserDto.GetOneUserMainInformation();
    userInformationCopy = new UserDto.GetOneUserMainInformation();
    SecondaryInformation = false;
    userInformationForPostOrPut = new UserDto.CreateUserMainInformation();
    childUsers = false;
    message = false;
    certification = false;
    documentFile = false;
    RepeatCorrectly = false;
    nationalCode;
    receiveGetAllUserTypeRes = false;
    organizationGroup = new OrganizationGroup();
    organizationList: GetOrg[] = [];
    organizationInput = new Subject<string>();
    organizationLoading = false;
    ext: string[] = ['jpg', 'jpeg', 'png', 'psd', 'tiff',
        'JPG', 'JPEG', 'PNG', 'PSD', 'TIFF'
    ];
    fileLoader = false;

    constructor(
        public location: Location,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private userTypeService: UserTypeService,
        private organizationService: OrganizationService,
        private userService: UserService,
        public uploadService: UploadService,
    ) {
        this.mode = this.activatedRoute.snapshot.queryParams.mode;
        this.userId = this.activatedRoute.snapshot.queryParams.entityId;
        console.log('10', this.userInformation);

    }

    ngOnInit() {
        if (this.mode === ActionMode.EDIT) {
            if (!isNullOrUndefined(this.userId)) {
                this.loading = true;
                this.getOne();
            }
        }
        // this.getOrganization();
        this.getAllUserType();


    }


    // /////////// Get Org List /////////////
    getOrganization() {
        this.organizationService.getAllOrganizationName().pipe(takeUntilDestroyed(this))
            .subscribe(res => {
                if (res) {
                    this.organizationList = res;
                    console.log('this.organizationList', this.organizationList);
                }
            });

    }

    //////// GetOne Main Information ////////////////
    requiredActive = true;

    getOne() {
        this.userService.getOneMainInformation({userId: this.userId})
            .pipe(takeUntilDestroyed(this)).subscribe((res) => {
            this.loading = false;
            console.log('getOne', res);
            if (res) {
                this.userInformation.name = res.name;
                this.userInformation.active = res.active;
                this.userInformation.family = res.family;
                this.userInformation.messageId = res.messageId;
                this.userInformation.username = res.username;
                this.userInformation.password = res.password;
                this.userInformation.resetPasswordCode = res.resetPasswordCode;
                this.userInformation.image = res.image;
                this.userInformation.userTypeId = res.userTypeId;
                this.userInformation.userTypeName = res.userTypeName;
                this.userInformation.nationalCode = res.nationalCode;
                if (this.userInformation.active === true) {
                    this.requiredActive = false;
                }

                this.userInformationCopy = JSON.parse(JSON.stringify(this.userInformation));
                if (res.nationalCode) {
                    this.nationalCode = JSON.parse(JSON.stringify(res.nationalCode));
                    this.userCopy.nationalCode = JSON.parse(JSON.stringify(res.nationalCode));
                }
                if (!isNullOrUndefined(this.user.birthDay)) {
                    $('#birthDay').val(Toolkit2.Common.En2Fa(this.myMoment.convertIsoToJDate(this.user.birthDay)));
                }
                if (!isNullOrUndefined(this.user.startWork)) {
                    $('#startWork').val(Toolkit2.Common.En2Fa(this.myMoment.convertIsoToJDate(this.user.startWork)));

                }
            }
        }, error => {
            this.loading = false;

        });
        console.log('2', this.userInformation);
    }

    //////////////// Save Main Information /////////////
    loadingAction = false;
    doSave = false;

    action(form) {
        this.doSave = true;
        if (this.loadingAction) {
            return;
        }
        // this.LeftListCopy = [];
        // this.LeftListCopy = JSON.parse(JSON.stringify(this.LeftList));

        if (JSON.stringify(this.userInformation) === JSON.stringify(this.userInformationCopy)) {
            DefaultNotify.notifyDanger('تغییری اعمال نشده است .', '', NotiConfig.notifyConfig);
            return;
        }
        if (form.invalid) {
            DefaultNotify.notifyDanger('ورودی‌ها را بررسی کنید.', '', NotiConfig.notifyConfig);
            return;
        }

        if (this.mode === ActionMode.EDIT) {
            if (this.nationalCode === this.userInformation.nationalCode) {
                this.checkNationalCode = true;
            }
        }

        // if (this.checkNationalCode === false || isNullOrUndefined(this.userInformation.nationalCode)) {
        if (this.checkNationalCode === false) {

            DefaultNotify.notifyDanger('ورودی کد ملی را بررسی کنید.', '', NotiConfig.notifyConfig);
            return;
        } else if (this.checkNationalCode === true) {
            // if (this.userInformation.orgAndUserTypeList.length < 1) {
            //     DefaultNotify.notifyDanger('پست و سازمان  انتخاب نکرده اید.');
            //     return;
            // }


            this.userInformation.name = this.userInformation.name.trim();
            this.userInformation.family = this.userInformation.family.trim();
            this.userInformationForPostOrPut = new UserDto.CreateUserMainInformation();
            if (this.userInformation.active) {
                this.userInformationForPostOrPut.username = this.userInformation.username;
                this.userInformationForPostOrPut.password = this.userInformation.password;
                this.userInformationForPostOrPut.resetPasswordCode = this.userInformation.resetPasswordCode;
            } else {
                this.userInformationForPostOrPut.username = null;
                this.userInformationForPostOrPut.password = null;
                this.userInformationForPostOrPut.resetPasswordCode = null;
            }
            this.userInformationForPostOrPut.active = this.userInformation.active;
            this.userInformationForPostOrPut.nationalCode = this.userInformation.nationalCode;
            this.userInformationForPostOrPut.name = this.userInformation.name;
            this.userInformationForPostOrPut.family = this.userInformation.family;
            this.userInformationForPostOrPut.userTypeId = this.userInformation.userTypeId;
            // this.userInformationForPostOrPut.userTypeName = this.userInformation.userTypeName;
            this.userInformationForPostOrPut.messageId = this.userInformation.messageId;
            this.userInformationForPostOrPut.image = this.userInformation.image;
            this.userInformationForPostOrPut.id = this.userInformation.id;
            // for (const item of this.userInformation.orgAndUserTypeList) {
            //     const orgAndUserType = new UserDto.OrgAndUserTypeListId();
            //     orgAndUserType.organizationId = item.organizationId;
            //     for (const item2 of item.userTypeList) {
            //         orgAndUserType.userTypeList.push(item2.userTypeId);
            //     }
            //     this.userInformationForPostOrPut.orgAndUserTypeList.push(orgAndUserType);
            // }
            // if (this.userInformationForPostOrPut.active === true) {
            //     if (this.userInformationForPostOrPut.password) {
            //         if (this.userInformationForPostOrPut.password !== this.userInformationForPostOrPut.resetPasswordCode) {
            //             DefaultNotify.notifyDanger('گذرواژه و تکرار ان مطابقت ندارند.', '', NotiConfig.notifyConfig);
            //             return;
            //         }
            //     }
            //
            // }
            if (this.showValid === true) {
                DefaultNotify.notifyDanger('ورودی گذرواژه ها را بررسی کنید.', '', NotiConfig.notifyConfig);
                return;
            }
            if (this.mode === ActionMode.ADD) {
                if (!this.userInformation.active) {
                    this.checkIfUsername = true;
                }
                if (this.checkIfUsername === false) {
                    DefaultNotify.notifyDanger('نام کاربری تکراری است.', '', NotiConfig.notifyConfig);
                    this.userInformation.username = '';
                    return;
                }



                setTimeout(() => {
                    if (this.checkIfUsername === true) {
                        this.loadingAction = true;

                        this.userService.createMainInformation(this.userInformationForPostOrPut)
                            .pipe(takeUntilDestroyed(this)).subscribe(res => {
                            this.loadingAction = false;
                            if (res) {
                                this.edit.emit(true);
                                this.userInformationForPostOrPut = new UserDto.CreateUserMainInformation();
                                DefaultNotify.notifySuccess('با موفقیت افزوده شد.', '', NotiConfig.notifyConfig);
                                this.userInformation.id = res;
                                this.userInformationCopy = JSON.parse(JSON.stringify(this.userInformation));
                                this.userId = res;
                                this.mode = ActionMode.EDIT;
                                this.router.navigate([], {
                                    queryParams: {mode: 'EDIT', id: res.id},
                                    relativeTo: this.activatedRoute
                                });
                            } else if (res && res.messageId) {
                                DefaultNotify.notifyDanger(res.messageId, '', NotiConfig.notifyConfig);
                            }
                        }, error => {
                            this.loadingAction = false;
                        });
                    }
                }, 500);
            } else if (this.mode === ActionMode.EDIT) {
                if (!this.userId) {
                    this.userId = this.userInformation.id;
                }
                this.loadingAction = true;
                this.userService.updateMainInformation(this.userInformationForPostOrPut, {userId: this.userId})
                    .pipe(takeUntilDestroyed(this)).subscribe(res => {
                    this.loadingAction = false;
                    console.log('update', res);
                    if (res) {
                        this.edit.emit(true);
                        this.userInformationForPostOrPut = new UserDto.CreateUserMainInformation();
                        this.userInformationCopy = JSON.parse(JSON.stringify(this.userInformation));
                        DefaultNotify.notifySuccess('ویرایش با موفقیت انجام شد.', '', NotiConfig.notifyConfig);

                    }
                }, error => {
                    this.loadingAction = false;
                });
            }
        }
    }

    cancel() {
        // this.location.back();
        this.back.emit(true);

    }

    ngOnDestroy(): void {
    }


    /////////////////////////// چک کردن کد ملی ////////////////////////


    checkNationalCoded(form) {
        if (!this.userInformation.nationalCode) {
            this.action(form);
            return;
        }
        const checkNationalCode = CheckNationalCode.check(this.userInformation.nationalCode);
        console.log('checkNationalCode', checkNationalCode);
        this.userInformation.nationalCode = Toolkit2.Common.Fa2En(this.userInformation.nationalCode);
        if (this.userInformation.nationalCode.length < 10) {
            return;
        }
        if (!checkNationalCode) {
            DefaultNotify.notifyDanger('کد ملی وارد شده صحیح نمی باشد.', '', NotiConfig.notifyConfig);
            $('#nationalCode').addClass('is-invalid');

            this.checkNationalCode = false;
            this.userInformation.nationalCode = '';
            return;
        }
        console.log('dsd', this.userInformation.nationalCode);

        // مربوط به معتبر بودن کد ملی
        // if (Tools.checkCodeMeli(this.userInformation.nationalCode.toString())) {
        if (this.mode === this.actionMode.ADD) {
            this.checkNationalCodeLoading = true;
            this.checkNationalCode = false;
            this.loadingAction = true;
            this.userService.checkNationalCode({nationalCode: this.userInformation.nationalCode}).subscribe(res => {

                this.checkNationalCodeLoading = false;
                this.loadingAction = false;

                if (res.exist === true) {
                    DefaultNotify.notifyDanger('کد ملی وارد شده موجود است.', '', NotiConfig.notifyConfig);
                    // $('#nationalCode').removeClass('is-valid');
                    $('#nationalCode').addClass('is-invalid');

                    this.checkNationalCode = false;
                    this.userInformation.nationalCode = '';
                    return;
                    // if (isNullOrUndefined(this.user.id)) {
                    //   this.user.nationalCode = '';
                    // } else {
                    //   this.user.nationalCode = this.userCopy.nationalCode;
                    // }
                    // this.userInformation.nationalCode = '';
                    // return;

                } else if (res.exist === false) {
                    // $('#nationalCode').removeClass('is-invalid');

                    $('#nationalCode').addClass('is-valid');
                    this.checkNationalCode = true;
                    this.action(form);

                }

            }, error => {
                this.loadingAction = false;
            });
        } else if (this.mode === this.actionMode.EDIT) {
            this.checkNationalCodeLoading = true;
            this.loadingAction = true;

            this.userService.checkNationalCodeForUpdate({
                code: this.userInformation.nationalCode,
                userId: this.userId
            }).subscribe(res => {
                console.log('check national code');

                this.checkNationalCodeLoading = false;
                this.checkNationalCode = false;
                this.loadingAction = false;

                if (res) {
                    DefaultNotify.notifyDanger('کد ملی وارد شده موجود است.', '', NotiConfig.notifyConfig);
                    $('#nationalCode').addClass('is-invalid');

                    this.checkNationalCode = false;
                    this.userInformation.nationalCode = '';
                    return;
                } else {
                    $('#nationalCode').addClass('is-valid');
                    this.checkNationalCode = true;
                    this.action(form);


                }
            }, error => {
                this.loadingAction = false;
            });
        }

        // }


    }

    //////////////////////////////// چک کردن نام کاربری /////////////////////////////////////////
    checkIfUsernameIsRepetitive(userName) {
        // if (this.isOneTime === false) {
        if (userName) {

            this.userService.checkIfUsernameIsRepetitive({username: userName})
                .subscribe(res => {
                    // this.checkIfUsername = true;


                    if (res === 'true') {
                        DefaultNotify.notifyDanger('نام کاربری تکراری است.', '', NotiConfig.notifyConfig);
                        this.userInformation.username = '';
                        this.checkIfUsername = false;

                        return;
                    } else if (res === 'false') {
                        this.checkIfUsername = true;
                        // DefaultNotify.notifySuccess('نام کاربری صحیح است.');

                    }
                });
            // }
            // this.isOneTime = false;
        }
    }

    // checkNationalCode


    changePassword() {
        this.showValid = false;

        console.log('61', this.userInformation);
        // console.log('61', this.userInformation);
        if (!isNullOrUndefined(this.userInformation.password) && this.userInformation.password !== '' &&
            !isNullOrUndefined(this.userInformation.resetPasswordCode) && this.userInformation.resetPasswordCode !== '') {
            if (this.userInformation.password !== this.userInformation.resetPasswordCode) {
                // DefaultNotify.notifyDanger('گذرواژه و تکرار ان مطابقت ندارند.', '', NotiConfig.notifyConfig);
                this.showValid = true;
            } else {
                this.showValid = false;
                $('#passAdd').removeClass('is-invalid');
                $('#confirmPassword').removeClass('is-invalid');
                this.RepeatCorrectly = true;
            }
        }
    }


    /////////////////////////////// Upload Image ////////////////////////////
    onChangeUploader(input) {
        this.fileLoader = true;
        if (input.files.length > 0) {
            this.files = [];
            for (const i of input.files) {
                const fe = i.name.split('.').pop();
                if (this.ext.includes(fe) === false) {
                    this.fileLoader = false;
                    DefaultNotify.notifyWarning('عکس انتخاب کنید', '', NotiConfig.notifyConfig);
                    return;
                }
                console.log(i.size);
                if (i.size < 10485760) {
                    const file: FileModel = new FileModel();
                    const f = i.type.split('/');
                    file.name = i.name;
                    file.type = f[0];
                    file.lastModified = i.lastModified;
                    this.fileModel.push(file);
                    this.onUploadFile(i);
                } else {
                    this.fileLoader = false;
                    DefaultNotify.notifyWarning('حجم فایل ' + i.name + 'نباید بیشتر از ۱۰ مگابایت باشد.', '', NotiConfig.notifyConfig);
                }
            }
            if (this.files.length > 0) {
            }
        }
        console.log('7', this.userInformation);
    }

    onUploadFile(file) {
        const formData = new FormData();

        formData.append('file', file);
        this.uploadService.uploadImage(formData).pipe(takeUntilDestroyed(this))
            .subscribe((data: any) => {
                this.fileLoader = false;
                if (data.id) {
                    this.userInformation.image = data;
                } else {
                    DefaultNotify.notifyDanger('فرمت انتخاب شده قابل قبول نمی باشد.', '', NotiConfig.notifyConfig);
                    return;
                }
            });
    }

    onUploadFile2() {

        if (this.croppedImage) {
            fetch(this.croppedImage)
                .then(res => res.blob())
                .then((blobFile: any) => {
                    if (blobFile.size < 1000000) {

                        const formData = new FormData();
                        formData.append('file', blobFile, 'imageName.jpg');

                        // formData.append('file', blobFile);
                        this.uploadService.uploadImage(formData).pipe(takeUntilDestroyed(this))
                            .subscribe((data: any) => {
                                this.fileLoader = false;
                                if (data.id) {
                                    this.userInformation.image = data;
                                } else {
                                    DefaultNotify.notifyDanger('فرمت انتخاب شده قابل قبول نمی باشد.', '', NotiConfig.notifyConfig);
                                    return;
                                }
                            });
                    } else {
                        DefaultNotify.notifyDanger('حجم  فابل انتخاب شده زیاد است.');
                        // this.loader = false;
                    }
                });
        } else {
            DefaultNotify.notifyDanger('فایلی  انتخاب نشده است.');
            // this.loader = false;
        }


    }


    deleteImage() {
        // ModalUtil.showModal('deleteModal');
        this.userInformation.image = new DocumentFile();
        this.files = [];
    }

    //////////////////////////////////////////////////////////////

    changeDocumentList(event: CompanyDto.DocumentFile[]) {
        // this.assetService.updateAssetDocumentList(event, {assetId: this.assetId}).pipe(takeUntilDestroyed(this))
        //   .subscribe( (res: any) => {
        //     if (res) {
        //       DefaultNotify.notifySuccess('عملیات با موفقیت انجام شد.');
        //     } else {
        //       DefaultNotify.notifyDanger('عملیات انجام نشد دوباره تلاش کنید.');
        //     }
        //   });
    }

//  ///////////////////////////////// userTypeList      ///////////////////////////////////////////


    getUserTypeListByOrganizationId() {
        if (!isNullOrUndefined(this.organizationGroup.org)) {
            if (!isNullOrUndefined(this.organizationGroup.org.id)) {
                this.userTypeService.getUserTypeListByOrganizationId({orgId: this.organizationGroup.org.id})
                    .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {

                    if (!isNullOrUndefined(res)) {
                        this.userTypeListCopy = JSON.parse(JSON.stringify(res));
                        this.userTypeList = res;
                        // for (const item of this.userInformation.orgAndUserTypeList) {
                        //     if (item.organizationId === this.organizationGroup.org.id) {
                        //         for (const L of item.userTypeList) {
                        //             this.userTypeList = this.userTypeList.filter(e => e.userTypeId !== L.userTypeId);
                        //         }
                        //     }
                        // }
                        this.receiveGetAllUserTypeRes = true;
                    }
                });
            }
        }
    }

    userTypeLoading = false;

    getAllUserType() {
        this.userTypeLoading = true;
        this.userTypeService.getAllRole()
            .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
            this.userTypeLoading = false;


            if (!isNullOrUndefined(res)) {
                this.userTypeListCopy = JSON.parse(JSON.stringify(res));
                this.userTypeList = res;
                // for (const item of this.userInformation.orgAndUserTypeList) {
                //     if (item.organizationId === this.organizationGroup.org.id) {
                //         for (const L of item.userTypeList) {
                //             this.userTypeList = this.userTypeList.filter(e => e.userTypeId !== L.userTypeId);
                //         }
                //     }
                // }
                this.receiveGetAllUserTypeRes = true;
            }
        });
    }


    stringLength(value, id) {
        if (!isNullOrUndefined(value)) {
            value = value.trim();
            if (value.length === 0) {
                $('#' + id).addClass('is-invalid').removeClass('is-valid');
                $('#form').addClass('ng-invalid').removeClass('ng-valid');
                return false;
            } else {
                $('#' + id).addClass('is-valid').removeClass('is-invalid');
                $('#form').addClass('ng-valid').removeClass('ng-invalid');
                return true;

            }
        } else {
            return true;
        }
    }

    next() {
        $('#userCreate').carousel('next');
        this.SecondaryInformation = true;
    }

    prev() {
        $('#userCreate').carousel('prev');
    }


    putUserTypeInSelectedOrg(item: UserDto.UserSelectList) {
        // const index = this.userInformation.orgAndUserTypeList.findIndex(e => e.organizationId === this.organizationGroup.org.id);
        // if (index !== -1) {
        //     this.userInformation.orgAndUserTypeList[index].userTypeList.push(item);
        // } else if (index === -1) {
        //     const OrgAndUserTypeObject = new UserDto.OrgAndUserTypeList();
        //     OrgAndUserTypeObject.userTypeList.push(item);
        //     OrgAndUserTypeObject.organizationId = this.organizationGroup.org.id;
        //     OrgAndUserTypeObject.organizationName = this.organizationGroup.org.name;
        //     this.userInformation.orgAndUserTypeList.push(OrgAndUserTypeObject);
        // }
        this.userTypeList = this.userTypeList.filter(e => e.userTypeId !== item.userTypeId);
    }

    putUserTypeInUserTypeList(L: UserDto.UserSelectList, item: UserDto.OrgAndUserTypeList) {
        if (item.organizationId !== this.organizationGroup.org.id) {
            this.receiveGetAllUserTypeRes = false;
            this.userTypeList = [];
            this.organizationGroup = new OrganizationGroup();
            this.organizationGroup.org.id = item.organizationId;
            this.organizationGroup.org.name = item.organizationName;
            this.getUserTypeListByOrganizationId();
        } else if (item.organizationId === this.organizationGroup.org.id) {
            this.receiveGetAllUserTypeRes = true;
        }
        this.afterGetAllUserTypePutUserTypeInUserTypeList(L, item);
    }

    afterGetAllUserTypePutUserTypeInUserTypeList(L: UserDto.UserSelectList, item: UserDto.OrgAndUserTypeList) {
        if (this.receiveGetAllUserTypeRes) {
            this.userTypeList.push(this.userTypeListCopy.find(e => e.userTypeId === L.userTypeId));
            // const index = this.userInformation.orgAndUserTypeList.findIndex(e => item.organizationId === e.organizationId);
            // if (index !== -1) {
            //     this.userInformation.orgAndUserTypeList[index].userTypeList =
            //         this.userInformation.orgAndUserTypeList[index].userTypeList.filter(e => e.userTypeId !== L.userTypeId);
            //     if (this.userInformation.orgAndUserTypeList[index].userTypeList.length === 0) {
            //         this.userInformation.orgAndUserTypeList.splice(index, 1);
            //     }
            //     if (!isNullOrUndefined(this.userInformation.orgAndUserTypeList[index])) {
            //         if (isNullOrUndefined(this.userInformation.orgAndUserTypeList[index].userTypeList)) {
            //             this.userInformation.orgAndUserTypeList =
            //                 this.userInformation.orgAndUserTypeList.filter
            //                 (e => e.organizationId !== this.userInformation.orgAndUserTypeList[index].organizationId);
            //         }
            //     }
            // } else if (index === -1) {
            // }
        } else {
            setTimeout(() => {
                this.afterGetAllUserTypePutUserTypeInUserTypeList(L, item);
            }, 30);
        }
    }


    // آپلود عکس
    imageChangedEvent: any = '';
    croppedImage: any = '';
    canvasRotation = 0;
    transform: ImageTransform = {};
    containWithinAspectRatio = false;
    showCropper = false;

    fileChangeEvent(event: any): void {
        // this.imageChangedEvent = event;
        if (event.target.files[0].type.split('/')[0] !== 'image') {
            DefaultNotify.notifyDanger('فایل پشتیبانی نمی شود.');
            return;
        }

        // this.imageName = event.target.files[0].name.split('.')[0] + '.png';
        // this.imageName = event.target.files[0].name.split('.')[0] + '.webp';
        this.imageChangedEvent = event;
    }

    imageCropped(event: ImageCroppedEvent) {
        this.croppedImage = event.base64;
    }

    imageLoaded() {
        this.showCropper = true;
        // show cropper
    }

    cropperReady(sourceImageDimensions: Dimensions) {
        // cropper ready
    }

    loadImageFailed() {
        // show message
    }

    //// بزرگ نمایی عکس
    zoom = 1;
    heightPdf = 800;

    zoomPdf(type) {
        if (type === 'up') {
            this.zoom += 0.1;
            this.heightPdf += 100;
        } else if (type === 'down') {
            if (this.heightPdf <= 100) {
                return;
            }
            if (this.zoom > 0) {
                this.zoom -= 0.1;
                this.heightPdf -= 100;
            }

        }
    }

    zoomJquery() {
        const that = this;
        $('#dragscroll2').on('wheel', function (e) {
            if (e.originalEvent.deltaY >= 0) {
                that.zoomPdf('down');
            } else {
                that.zoomPdf('up');

            }

        });
        const _window = window;
        const _document = document;
        const mousemove = 'mousemove';
        const mouseup = 'mouseup';
        const mousedown = 'mousedown';
        const EventListener = 'EventListener';
        const addEventListener = 'add' + EventListener;
        const removeEventListener = 'remove' + EventListener;
        let newScrollX, newScrollY;

        let dragged = [];
        const reset = function (i, el) {
            for (i = 0; i < dragged.length;) {
                el = dragged[i++];
                el = el.container || el;
                el[removeEventListener](mousedown, el.md, 0);
                _window[removeEventListener](mouseup, el.mu, 0);
                _window[removeEventListener](mousemove, el.mm, 0);
            }

            // cloning into array since HTMLCollection is updated dynamically
            dragged = [].slice.call(_document.getElementsByClassName('dragscroll2'));
            for (i = 0; i < dragged.length;) {
                (function (el, lastClientX, lastClientY, pushed, scroller, cont) {
                    (cont = el.container || el)[addEventListener](
                        mousedown,
                        cont.md = function (e) {
                            if (!el.hasAttribute('nochilddrag') ||
                                _document.elementFromPoint(
                                    e.pageX, e.pageY
                                ) === cont
                            ) {
                                pushed = 1;
                                lastClientX = e.clientX;
                                lastClientY = e.clientY;

                                e.preventDefault();
                            }
                        }, 0
                    );

                    _window[addEventListener](
                        mouseup, cont.mu = function () {
                            pushed = 0;
                        }, 0
                    );

                    _window[addEventListener](
                        mousemove,
                        cont.mm = function (e) {
                            if (pushed) {
                                (scroller = el.scroller || el).scrollLeft -=
                                    newScrollX = (-lastClientX + (lastClientX = e.clientX));
                                scroller.scrollTop -=
                                    newScrollY = (-lastClientY + (lastClientY = e.clientY));
                                if (el === _document.body) {
                                    (scroller = _document.documentElement).scrollLeft -= newScrollX;
                                    scroller.scrollTop -= newScrollY;
                                }
                            }
                        }, 0
                    );
                })(dragged[i++]);
            }
        };


        if (_document.readyState === 'complete') {
            reset(null, null);
        } else {
            _window[addEventListener]('load', reset, 0);
        }

    }

    ngAfterViewInit(): void {
      ///  this.zoomJquery();
    }

}

export class OrganizationGroup {
    org = new GetOrg();
    userTypeList: string[] = [];
}

export class GetOrg {
    name: string;
    code: string;
    id: string;
}


