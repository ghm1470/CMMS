import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActionMode, DefaultNotify, isNullOrUndefined, ModalSize} from '@angular-boot/util';
import {MyPattern} from '../../../../shared/shared/tools/myPattern';
import {Province} from '../../../dashboard/model/dto/province';
import {Location} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {takeUntilDestroyed} from '@angular-boot/core';
import {LatLngLiteral} from '@agm/core';
import {CompanyService} from '../../endpoint/company.service';
import {CompanyDto} from '../../model/dto/companyDto';
import {CityService} from '../../../basicInformation/city/endpoint/city.service';
import {City} from '../../../basicInformation/city/model/city';
import {Currency} from '../../../basicInformation/currency/model/dto/currency';
import {CurrencyService} from '../../../basicInformation/currency/endpoint/currency.service';
import {FileModel} from '../../../../shared/model/fileModel';
import {UploadService} from '../../../../shared/service/upload.service';
import {ProvinceService} from '../../../basicInformation/province/endpoint/province.service';
import * as FileSaver from 'file-saver';
import {DownloadService} from '../../../../shared/service/download.service';
import {ModalUtil} from '@angular-boot/widgets';
import {NgForm} from '@angular/forms';
import Document = CompanyDto.Document;
import {NotiConfig} from "../../../../shared/tools/notifyConfig";

declare var $: any;

@Component({
    selector: 'app-company-action',
    templateUrl: './company-action.component.html',
    styleUrls: ['./company-action.component.scss']
})
export class CompanyActionComponent implements OnInit, OnDestroy {
    @ViewChild('showNameForm', {static: false}) showNameForm: NgForm;
    lat = 35.6970118;
    lng = 51.4899051;
    zoom = 7;
    locationSelected = false;
    lastCenter = {
        lat: this.lat,
        lng: this.lng
    };

    mode: ActionMode = ActionMode.ADD;
    actionMode = ActionMode;
    company = new CompanyDto.Create();
    companyCopy = new CompanyDto.Create();
    companyId: string;
    myPattern = MyPattern;
    provinceList: Province[] = [];
    cityList: City[] = [];
    currencyList: Currency[] = [];
    files: Array<File> = [];
    fileModel: Array<FileModel> = [];
    doSave = false;
    loading = false;
    disabledButton = false;
    uploadLoading = false;
    codeCheck;
    modalId = ModalUtil.generateModalId();
    MyModalSize = ModalSize;
    showName: string;
    ext: string[] = ['zip', 'rar', 'tar'
        , 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf',
        'odt', 'fodt', 'ZIP', 'RAR', 'TAR', '7ZIP'
        , 'DOC', 'DOCX', 'XLS', 'XLSX', 'PPT', 'PPTX', 'PDF', 'ODT', 'FODT',
        'png', 'PNG', 'jpg', 'jpeg', 'JPG', 'JPEG',
    ];


    constructor(
        public location: Location,
        public companyService: CompanyService,
        public provinceService: ProvinceService,
        public currencyService: CurrencyService,
        public downloadService: DownloadService,
        public uploadService: UploadService,
        public cityService: CityService,
        private activatedRoute: ActivatedRoute,
    ) {
        // this.company.address.provinceId = '-1';
        // this.company.address.cityId = '-1';
        // this.company.currencyId = '-1';
        this.mode = this.activatedRoute.snapshot.queryParams.mode;
        this.companyId = this.activatedRoute.snapshot.queryParams.entityId;
    }

    ngOnInit() {
        if (this.mode !== ActionMode.ADD) {
            if (!isNullOrUndefined(this.companyId)) {
                this.getOne();
            }
        }
        this.getAllProvince();
        this.getAllCurrency();
    }

    getAllProvince() {
        this.provinceService.getAll().pipe(takeUntilDestroyed(this))
            .subscribe((res: any) => {

                if (!isNullOrUndefined(res)) {
                    this.provinceList = res;
                }

            });
    }

    getAllCurrency() {
        this.currencyService.getAll()
            .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {

            if (!isNullOrUndefined(res)) {
                this.currencyList = res;
            }
        });
    }

    getOne() {
        this.companyService.getOne({companyId: this.companyId})
            .pipe(takeUntilDestroyed(this)).subscribe((res: CompanyDto.Create) => {
            if (res) {
                if (!res.address) {
                    res.address = new CompanyDto.Address();
                }
                this.company = res;
                this.companyCopy = JSON.parse(JSON.stringify(res));
                // this.lat = this.company.address.location.lat;
                // this.lng = this.company.address.location.lng;
                // this.lastCenter.lat = this.lat;
                // this.lastCenter.lng = this.lng;
                this.locationSelected = true;
                this.getCityList();
            }
        });
    }

    action(form) {
        if (this.mode === ActionMode.ADD) {
            this.companyService.create(this.company)
                .pipe(takeUntilDestroyed(this)).subscribe(res => {
                this.loading = false;
                this.disabledButton = false;
                if (res) {
                    DefaultNotify.notifySuccess('با موفقیت افزوده شد.', '', NotiConfig.notifyConfig);
                    form.reset();
                    this.cancel();
                }
            }, error => {
                this.loading = false;
            });
        } else if (this.mode === ActionMode.EDIT) {
            this.companyService.update(this.company, {companyId: this.companyId})
                .pipe(takeUntilDestroyed(this)).subscribe(res => {
                this.loading = false;
                this.disabledButton = false;
                if (res) {
                    DefaultNotify.notifySuccess('ویرایش با موفقیت انجام شد.', '', NotiConfig.notifyConfig);
                    this.cancel();
                }
            }, error => {
                this.loading = false;
            });
        }
    }

    cancel() {
        this.location.back();
    }

    ngOnDestroy(): void {
    }

    stringLength(value, id) {
        if (!isNullOrUndefined(value)) {
            value = value.trim();
            if (value.length === 0) {
                $('#' + id).addClass('is-invalid').removeClass('is-valid');
                $('#form').addClass('ng-invalid').removeClass('ng-valid');
                // this.disabledButton = true;
                return false;
            } else {
                $('#' + id).addClass('is-valid').removeClass('is-invalid');
                $('#form').addClass('ng-valid').removeClass('ng-invalid');
                // this.disabledButton = false;

                return true;

            }
        } else if (isNullOrUndefined(value)) {
            $('#' + id).addClass('is-invalid').removeClass('is-valid');
            $('#form').addClass('ng-invalid').removeClass('ng-valid');
            // this.disabledButton = false;

            // return false;
            return true;
        }
    }

    doSetCompanyMarker() {
        this.locationSelected = true;
        this.company.address.location.lat = this.lastCenter.lat;
        this.company.address.location.lng = this.lastCenter.lng;
    }

    changeLocation() {
        this.locationSelected = false;
        this.company.address.location.lat = null;
        this.company.address.location.lng = null;
    }

    centerChange(event: LatLngLiteral) {
        this.lastCenter.lat = event.lat;
        this.lastCenter.lng = event.lng;
    }

    getCityLoading = false;

    getCityList(doChangeSelectedCity?: boolean) {
        if (!this.company.address.provinceId) {
            this.company.address.provinceId = null;
            this.company.address.cityId = null;
        } else {
            this.getCityLoading = true;
            this.cityList = [];
            if (doChangeSelectedCity) {
                this.company.address.cityId = null;
                // this.company.address.provinceId.name = this.provinceList.find(p =>
                // p.id === this.company.address.provinceId.id).name;
                // this.company.address.provinceId.location = this.provinceList.find(p =>
                // p.id === this.company.address.provinceId.id).location;
                // this.lat = this.company.address.provinceId.location.lat;
                // this.lng = this.company.address.provinceId.location.lng;
                this.lastCenter.lat = this.lat;
                this.lastCenter.lng = this.lng;
                this.zoom = 9;
            }
            this.cityService.getAllByProvinceId({provinceId: this.company.address.provinceId})
                .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
                if (!isNullOrUndefined(res)) {
                    this.getCityLoading = false;
                    this.cityList = res;
                    if (this.cityList.length === 0) {
                        this.company.address.cityId = null;

                    }
                } else {
                    this.company.address.cityId = null;
                }
            },error => {
                this.getCityLoading = false;
            });
        }
    }

    fileType(fileName: string) {

        return fileName.split('.').pop();
    }

    changeCurrency() {
        this.company.currencyId = this.currencyList.find(c => c.id === this.company.currencyId).id;
    }

    changeCity() {
        // this.company.address.cityId.name = this.cityList.find(p => p.id === this.company.address.cityId.id).name;
        // this.company.address.cityId.location = this.cityList.find(p => p.id === this.company.address.cityId.id).location;
        // this.lat = this.company.address.cityId.location.lat;
        // this.lng = this.company.address.cityId.location.lng;
        this.lastCenter.lat = this.lat;
        this.lastCenter.lng = this.lng;
        this.zoom = 12;
    }

    onChangeUploader(input) {
        if (input.files.length > 0) {
            this.files = [];
            const fe = input.files[0].name.split('.').pop();
            if (this.ext.includes(fe) === false) {
                DefaultNotify.notifyDanger('نوع فایل انتخابی مورد قبول نمی باشد', '', NotiConfig.notifyConfig);
                return;
            }
        }
        if (input.files.length > 0) {
            this.files = [];
            for (const i of input.files) {
                if (i.size < 100000000) {
                    const file: FileModel = new FileModel();
                    const f = i.type.split('/');
                    file.name = i.name;
                    file.type = f[0];
                    file.lastModified = i.lastModified;
                    this.fileModel.push(file);
                    this.onUploadFile(i);
                    ModalUtil.hideModal(this.modalId);
                } else {
                    DefaultNotify.notifyWarning('حجم فایل ' + i.name + 'نباید بیشتر از ۱۰۰ مگابایت باشد.', '', NotiConfig.notifyConfig);
                }
            }
            if (this.files.length > 0) {
            }
        }
    }

    onUploadFile(file) {
        const formData = new FormData();
        formData.append('file', file);
        this.uploadLoading = true;
        this.uploadService.uploadFileWithExtraId(formData, this.showName).pipe(takeUntilDestroyed(this))
            .subscribe((data: any) => {
                this.uploadLoading = false;
                if (data) {
                    DefaultNotify.notifySuccess('با موفقیت آپلود شد.', '', NotiConfig.notifyConfig);
                    this.company.documents.push(data);
                } else {
                    DefaultNotify.notifyDanger('آپلود انجام نشد,دوباره تلاش کنید.', '', NotiConfig.notifyConfig);
                }
            });
    }

    // ========================================


    deleteItem(id: string) {
        this.company.documents = this.company.documents.filter(doc => doc.id !== id);
    }

    downloadFile(item: Document) {
        this.downloadService.downloadFile({documentId: item.id}).pipe(takeUntilDestroyed(this))
            .subscribe((res: any) => {

                if (!isNullOrUndefined(res)) {
                    FileSaver.saveAs(res, item.fileName);
                }
            });
    }

    checkCodeExist(form) {
        if (this.loading) {
            return;
        }
        this.doSave = true;
        if (form.invalid) {
            DefaultNotify.notifyDanger('ورودی‌ها را بررسی کنید.', '', NotiConfig.notifyConfig);
            return;
        }
        this.disabledButton = true;
        this.loading = true;
        if (this.company.code === this.companyCopy.code) {
            this.action(form);
        } else {
            this.companyService.checkCodeExist({code: this.company.code})
                .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
                if (res) {
                    DefaultNotify.notifyDanger('کد وارد شده موجود است.', '', NotiConfig.notifyConfig);
                    this.loading = false;
                    return;
                } else {
                    this.action(form);
                }
            });
        }
    }


    trimName() {
        this.showName = this.showName.trim();
    }

    showModalAddFile() {
        this.showName = '';
        this.showNameForm.reset();
        ModalUtil.showModal(this.modalId);
    }

}

