import {AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {UserDto} from '../../model/dto/user-dto';
import {MyPattern} from '../../../../shared/shared/tools/myPattern';
import {ActionMode, DefaultNotify, isNullOrUndefined, ModalSize, Toolkit2} from '@angular-boot/util';
import {takeUntilDestroyed} from '@angular-boot/core';
import {UserService} from '../../endpoint/user.service';
import {CertificationService} from '../../endpoint/certification.service';
import {FileModel} from '../../../../shared/model/fileModel';
import {UploadService} from '../../../../shared/service/upload.service';
import DocumentFile = UserDto.DocumentFile;
import {Toolkit} from '../../../formBuilder/shared/utility/toolkit';
import {ActivatedRoute} from '@angular/router';
import {ModalUtil} from '@angular-boot/widgets';
import {WorkOrderDto} from '../../../workOrder/model/dto/workOrderDto';
import {DateViewMode} from '../../../../shared/tools/date-view-mode.enum';
import * as FileSaver from "file-saver";
import {DownloadService} from "../../../../shared/service/download.service";
import {NgForm} from '@angular/forms';
import {Moment} from "../../../../shared/shared/tools/date/moment";
import {NotiConfig} from "../../../../shared/tools/notifyConfig";

declare var $: any;

@Component({
    selector: 'app-certification',
    templateUrl: './certification.component.html',
    styleUrls: ['./certification.component.scss']
})
export class CertificationComponent implements OnInit, OnDestroy, AfterViewInit {
    certification = new UserDto.Certification();
    myPattern = MyPattern;
    myMoment = Moment;
    MyToolkit = Toolkit;
    MyToolkit2 = Toolkit2;
    MyModalSize = ModalSize;
    disabledButton = false;
    loadingUpload = false;

    files: Array<File> = [];
    fileModel: Array<any> = [];
    doSave = false;


    timeValidFor: any;
    timeValidFrom: any;
    waiting = false;
    dateViewMode = DateViewMode;

    notValidDate = false;

    userSecondaryInformation = new UserDto.UserSecondaryInformation();
    userCopy = new UserDto.UserSecondaryInformation();
    @Input() userId = '';
    @Input() mod = '';
    @ViewChild('FormCertification', {static: false}) FormCertification: NgForm;

    certificationGetAllList: UserDto.Certification[] = [];
    showModalAction = false;
    modalIdActionCertification = ModalUtil.generateModalId();

    actionMode = ActionMode;
    mode: ActionMode = ActionMode.ADD;
    toolkit = Toolkit2;

    loading = false;

    ext: string[] = ['jpg', 'jpeg', 'png', 'psd', 'tiff'
        , 'doc', 'docx', 'pdf',
        'JPG', 'JPEG', 'PNG', 'PSD', 'TIFF'
        , 'DOC', 'DOCX', 'PDF'];

    constructor(private userService: UserService,
                private certificationService: CertificationService,
                public uploadService: UploadService,
                protected downloadService: DownloadService) {
    }


    ngOnInit() {
        console.log('Inputmode', this.mod);
        console.log('userId', this.userId);


        this.getAllCertification();

    }

    ngOnDestroy(): void {
    }


    action(form) {
        this.waiting = true;
        if (form.invalid) {
            DefaultNotify.notifyDanger('عنوان را بررسی کنید.', '', NotiConfig.notifyConfig);
            this.waiting = false;
            return;
        }
        if (this.notValidDate === true) {
            DefaultNotify.notifyDanger('تاریخ شروع اعتبار و پایان اعتبار به درستی وارد نشده ابتدا تاریخ های انتخابی را اصلاح کرده و مجدد ثبت نماید.', '', NotiConfig.notifyConfig);
            this.waiting = false;

            return;
        }
        // if (this.certification.certificateDocument.){}

        this.certification.userId = this.userId;
        console.log('---->this.certification', this.certification)
        // if (this.certification.validFrom && this.certification.validFor) {
        //   if (this.certification.validFrom < this.certification.validFor) {
        //     DefaultNotify.notifyDanger('تاریخ شروع اعتبار باید قبل تر از تاریخ پایان اعتبار باشد.');
        //     this.waiting = false;
        //     this.certification.validFrom = null;
        //     this.certification.validFor = null;
        //     return;
        //   }
        // }
        this.certificationService.create(this.certification)
            .pipe(takeUntilDestroyed(this)).subscribe(res => {
            if (res) {
                DefaultNotify.notifySuccess('با موفقیت انجام شد.', '', NotiConfig.notifyConfig);
                this.certification = new UserDto.Certification();
                ModalUtil.hideModal(this.modalIdActionCertification);
                this.waiting = false;
                form.reset();
                this.getAllCertification();
            }
        });
    }

    getAllCertification() {
        this.certificationGetAllList = [];
        this.loading = true;

        this.certificationService.getAllByUserId({userId: this.userId})
            .pipe(takeUntilDestroyed(this)).subscribe(res => {
            this.loading = false;
            if (res) {
                console.log('get-all-user-certification-res', res)
                this.certificationGetAllList = res;
            }
        });
    }

    getOneCertification(certification) {
        // alert(this.userId);
        this.certification = new UserDto.Certification();

        this.certificationService.getOne({certificationId: certification.id})
            .pipe(takeUntilDestroyed(this)).subscribe(res => {
            console.log('getAllRes', res);
            if (res) {
                this.certification = res;
                // this.setDataSetting();
                if (!isNullOrUndefined(this.certification.validFor)) {
                    const t = new Date(res.validFor);
                    this.timeValidFor = (Toolkit2.Common.En2Fa(this.myMoment.convertIsoToJDate(t.toISOString())));
                }
                if (!isNullOrUndefined(this.certification.validFrom)) {
                    const t = new Date(res.validFrom);
                    this.timeValidFrom = (Toolkit2.Common.En2Fa(this.myMoment.convertIsoToJDate(t.toISOString())));
                }

            }
        });
    }


    /////////////////////////////// Upload Image ////////////////////////////
    onChangeUploader(input) {
        console.log('input.files.length', input.files.length);
        if (input.files.length > 0) {
            this.files = [];
            const fe = input.files[0].name.split('.').pop();
            if (this.ext.includes(fe) === false) {
                DefaultNotify.notifyDanger('نوع فایل انتخابی مورد قبول نمی باشد', '', NotiConfig.notifyConfig);
                return;
            }
            for (const i of input.files) {
                console.log(i.size);
                if (i.size < 10000000) {
                    const file: FileModel = new FileModel();
                    const f = i.type.split('/');
                    file.name = i.name;
                    file.type = f[0];
                    file.lastModified = i.lastModified;
                    this.fileModel.push(file);
                    this.onUploadFile(i);
                } else {
                    DefaultNotify.notifyWarning('حجم فایل ' + i.name + 'نباید بیشتر از ۱۰ مگابایت باشد.', '', NotiConfig.notifyConfig);
                }
            }
            if (this.files.length > 0) {
            }
        }
    }

    onUploadFile(file) {
        const formData = new FormData();
        formData.append('file', file);
        this.loadingUpload = true;
        this.uploadService.uploadFile(formData).pipe(takeUntilDestroyed(this))
            .subscribe((data: any) => {
                this.loadingUpload = false;
                if (data) {
                    this.certification.certificateDocumentList.push(data);
                    this.loadingUpload = false;
                    console.log('userInformation documents => ', this.certification.certificateDocumentList);
                }
            });
    }

    deleteImage(index) {
        if (confirm('از حذف فایل بارگذاری شده اطمینان دارید؟')) {
            this.certification.certificateDocumentList.splice(index, 1);
            this.files = [];
        }
    }

    //////////////////////////////////////////////////////////////

    showModalActioncertification() {
        this.mode = this.actionMode.ADD;

        ModalUtil.showModal(this.modalIdActionCertification);
        this.FormCertification.reset();
        this.certification = new UserDto.Certification();
        this.timeValidFor = null;
        this.timeValidFrom = null;

    }

    deleteItem(item: any) {
        this.certificationService.delete({id: item.id})
            .pipe(takeUntilDestroyed(this)).subscribe((res: boolean) => {
            if (res) {
                console.log('certificationGetAllList', this.certificationGetAllList);
                const index = this.certificationGetAllList.findIndex(e => e.id === item.id);
                if (!isNullOrUndefined(index)) {
                    this.certificationGetAllList.splice(index, 1);
                }
            }
        });
    }

    chooseSelectedItemForEdit(certification: UserDto.Certification, i: number) {
        this.mode = this.actionMode.EDIT;
        this.FormCertification.reset();
        this.certification = new UserDto.Certification();
        this.getOneCertification(certification);
        ModalUtil.showModal(this.modalIdActionCertification);

    }

    chooseSelectedItemForView(certification: UserDto.Certification, i: number) {
        this.mode = this.actionMode.VIEW;
        this.certification = new UserDto.Certification();
        this.getOneCertification(certification);
        ModalUtil.showModal(this.modalIdActionCertification);
        setTimeout(() => {
            $('.input').disable();
        }, 50);

    }

    downloadFile(item: DocumentFile) {
        this.downloadService.downloadFile({documentId: item.id}).pipe(takeUntilDestroyed(this))
            .subscribe((res: any) => {
                
                if (!isNullOrUndefined(res)) {
                    FileSaver.saveAs(res, item.fileName);
                }
            });
    }

    setDataSetting() {
        const mthis = this;
        $('#validFrom').azPersianDateTimePicker({
            Placement: 'left', // default is 'bottom'
            Trigger: 'focus', // default is 'focus',
            enableTimePicker: false, // default is true,
            TargetSelector: '', // default is empty,
            GroupId: '', // default is empty,
            ToDate: false, // default is false,
            FromDate: false, // default is false,
            targetTextSelector: $('#validFrom'),
            disableAfterToday: false,
        }).on('change', (e) => {
            console.log($(e.currentTarget).val());
            mthis.certification.validFrom =
                mthis.myMoment.convertJaliliToIsoDate($(e.currentTarget).val());
        });
        $('#validFor').azPersianDateTimePicker({
            Placement: 'left', // default is 'bottom'
            Trigger: 'focus', // default is 'focus',
            enableTimePicker: false, // default is true,
            TargetSelector: '', // default is empty,
            GroupId: '', // default is empty,
            ToDate: false, // default is false,
            FromDate: false, // default is false,
            targetTextSelector: $('#validFor'),
            disableAfterToday: false,
        }).on('change', (e) => {
            console.log($(e.currentTarget).val());
            mthis.certification.validFor =
                mthis.myMoment.convertJaliliToIsoDate($(e.currentTarget).val());
        });
        this.getAllCertification();
    }

    trimTitle() {
        this.certification.name = this.certification.name.trim();
    }

    findMode() {
        let disable: boolean;
        if (this.mode === this.actionMode.VIEW) {
            disable = true;
        } else {
            disable = false;
        }
        return disable;
    }

    ngAfterViewInit(): void {
        this.notValidDate = false;
        const mthis = this;
        $('#validFrom').azPersianDateTimePicker({
            Placement: 'left', // default is 'bottom'
            Trigger: 'focus', // default is 'focus',
            enableTimePicker: false, // default is true,
            TargetSelector: '', // default is empty,
            GroupId: '', // default is empty,
            ToDate: false, // default is false,
            FromDate: false, // default is false,
            targetTextSelector: $('#validFrom'),
            disableAfterToday: false
        }).on('change', (e) => {
            console.log('$(e.currentTarget).val()', $(e.currentTarget).val());
            // mthis.certification.validFrom =
            //   mthis.myMoment.convertJaliliToIsoDate($(e.currentTarget).val());


            try {
                mthis.certification.validFrom =
                    mthis.myMoment.convertJaliliToIsoDate($(e.currentTarget).val());
                mthis.notValidDate = false;

                if (mthis.certification.validFrom &&
                    mthis.certification.validFor) {
                    if (mthis.certification.validFor < mthis.certification.validFrom) {
                        DefaultNotify.notifyDanger('تاریخ شروع نمی تواند جلوتر از تاریخ پایان باشد.', '', NotiConfig.notifyConfig);
                        mthis.notValidDate = true;

                        return;
                    }
                }
            } catch (e) {
                DefaultNotify.notifyDanger('تاریخ وارد شده صحیح نمی باشد.', '', NotiConfig.notifyConfig);
            }


        });
        $('#validFor').azPersianDateTimePicker({
            Placement: 'left', // default is 'bottom'
            Trigger: 'focus', // default is 'focus',
            enableTimePicker: false, // default is true,
            TargetSelector: '', // default is empty,
            GroupId: '', // default is empty,
            ToDate: false, // default is false,
            FromDate: false, // default is false,
            targetTextSelector: $('#validFor'),
            disableAfterToday: false
        }).on('change', (e) => {
            console.log($(e.currentTarget).val());
            // mthis.certification.validFor =
            //   mthis.myMoment.convertJaliliToIsoDate($(e.currentTarget).val());

            try {
                mthis.certification.validFor =
                    mthis.myMoment.convertJaliliToIsoDate($(e.currentTarget).val());
                mthis.notValidDate = false;

                if (mthis.certification.validFrom &&
                    mthis.certification.validFor) {

                    if (mthis.certification.validFor < mthis.certification.validFrom) {
                        DefaultNotify.notifyDanger('تاریخ شروع نمی تواند جلوتر از تاریخ پایان باشد.', '', NotiConfig.notifyConfig);
                        mthis.notValidDate = true;
                        return;
                    }
                }
            } catch (e) {
                DefaultNotify.notifyDanger('تاریخ وارد شده صحیح نمی باشد.', '', NotiConfig.notifyConfig);
            }

        });

    }

}
