import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActionMode, DefaultNotify, ModalSize, Toolkit2} from '@angular-boot/util';
import {Location} from '@angular/common';
import {takeUntilDestroyed} from '@angular-boot/core';
import {PartService} from '../../endpoint/part.service';
import { PartDto} from '../../model/dto/part';
import {ActivatedRoute, Router} from '@angular/router';
import {FileModel} from '../../../../shared/model/fileModel';
import {UploadService} from '../../../../shared/service/upload.service';
import {CompanyDto} from '../../../company/model/dto/companyDto';
import {BudgetService} from '../../endpoint/budget.service';
import {Budget} from '../../../basicInformation/budget/model/dto/budget';
import {ChargeDepartmentService} from '../../endpoint/charge-department.service';
import {ChargeDepartment} from '../../../basicInformation/chargeDepartment/model/charge-department';
import {AssetLocationService} from '../../endpoint/asset-location.service';
import {isNullOrUndefined} from 'util';
import DocumentFile = CompanyDto.DocumentFile;
import {ModalUtil} from '@angular-boot/widgets';
import {NotiConfig} from '../../../../shared/tools/notifyConfig';
import {ImageCompressorService} from '../../../../shared/tools/image-compressor.service';
import PartCategory = PartDto.PartCategory;

declare var $: any;

@Component({
    selector: 'app-part-action',
    templateUrl: './part-action.component.html',
    styleUrls: ['./part-action.component.scss']
})
export class PartActionComponent implements OnInit, OnDestroy {

    constructor(public location: Location,
                public router: Router,
                private  partService: PartService,
                private activatedRoute: ActivatedRoute,
                private  budgetService: BudgetService,
                private  assetLocationService: AssetLocationService,
                private  chargeDepartmentService: ChargeDepartmentService,
                private  uploadService: UploadService,
                private imageCompressService: ImageCompressorService
    ) {
        this.partId = this.activatedRoute.snapshot.queryParams.entityId;
        this.mode = this.activatedRoute.snapshot.queryParams.mode;
    }
    actionMode = ActionMode;
    mode: ActionMode = ActionMode.ADD;
    part = new PartDto.GetOnePart();
    partCopy = new PartDto.GetOnePart();
    partId: string;
    budget = new Budget();
    chargeDepartment = new ChargeDepartment();
    valid = false;
    files: File[] = [];
    fileModel: FileModel[] = [];
    doSave = false;
    warrantyB = false;
    documentB = false;
    userB = false;
    bomsB = false;
    inventoryB = false;
    disabledButton = false;
    checkPCode = false;
    ext: string[] = ['jpg', 'jpeg', 'webp', 'psd', 'tiff', 'JPG', 'JPEG', 'webp', 'PSD', 'TIFF'];
    uploadLoading = false;
    checkPartCodeLoading = false;
    loadingGetOne = false;
    partCategoryList = Object.keys(PartCategory);  // تبدیل enum به آرایه
    MyModalSize = ModalSize;

    maxFileSizeInKb = 200;
    threshold = 10;
    loadingUpload = false;

    loading = false;

    ngOnInit() {
        if (this.mode === ActionMode.EDIT) {
            if (!isNullOrUndefined(this.partId)) {
                this.valid = true;
                this.getOne();
            }
        }
        if (this.mode === ActionMode.VIEW) {
            if (!isNullOrUndefined(this.partId)) {
                this.valid = true;
                this.getOne();
                $('.input-c').attr('disabled', 'disabled');
            }
        }
    }

    getOne() {
        this.loadingGetOne = true;
        this.partService.getOne({partId: this.partId})
            .pipe(takeUntilDestroyed(this)).subscribe((res: PartDto.GetOnePart) => {
            this.loadingGetOne = false;
            if (res) {
                this.part = new PartDto.GetOnePart();
                this.part = res;
                this.partCopy = JSON.parse(JSON.stringify(this.part));
                setTimeout(() => {
                    $('#inventory').click();
                }, 200);
            }
        }, error => {
            this.loadingGetOne = false;
        });

    }

    showImageModalAsset() {
        ModalUtil.showModal('showImageModalPart');
    }

    onChangeUploader(input) {
        if (input.files.length > 0) {
            this.files = [];
            const fe = input.files[0].name.split('.').pop();

            if (this.ext.includes(fe) === false) {
                DefaultNotify.notifyDanger('نوع فایل انتخابی مورد قبول نمی باشد', '', NotiConfig.notifyConfig);
                return;
            }
            for (const i of input.files) {
                if (i.size < 100000000) {
                    const file: FileModel = new FileModel();
                    const f = i.type.split('/');
                    file.name = i.name;
                    file.type = f[0];
                    file.lastModified = i.lastModified;
                    this.fileModel.push(file);
                    this.onUploadFile(i);
                } else {
                    DefaultNotify.notifyWarning('حجم فایل ' + i.name + 'نباید بیشتر از ۱۰۰ مگابایت باشد.', '', NotiConfig.notifyConfig);
                }
            }
            if (this.files.length > 0) {
            }
        }
    }

    onUploadFile(file) {
        this.loadingUpload = true;
        const formData = new FormData();
        file.arrayBuffer().then((arrayBuffer) => {
            const blob = new Blob([new Uint8Array(arrayBuffer)], {type: file.type});

            this.getFile(blob, this.maxFileSizeInKb, this.threshold)
                .then((b) => {
                    formData.append('file', b, 'imageName.jpg');
                    this.uploadService.uploadImage(formData).pipe(takeUntilDestroyed(this))
                        .subscribe((data: any) => {
                            this.loadingUpload = false;
                            if (data) {
                                this.part.image = data;
                            }
                        }, error => {
                            this.loadingUpload = true;
                        });
                });
        });

    }
    getFile(blob: any, maxFileSizeInKb: number, threshold: number): Promise<any> {
        return this.imageCompressService.compress(blob, maxFileSizeInKb, threshold);
    }
    deleteImage() {
        this.part.image = new DocumentFile();
        this.files = [];
    }

    cancel() {
        // this.router.navigateByUrl('/panel/part?page=0&size=10');
        this.location.back();
    }

    ngOnDestroy(): void {
    }

    checkPartCode(form) {
        this.doSave = true;
        if (JSON.stringify(this.partCopy) === JSON.stringify(this.part) && this.mode === ActionMode.EDIT) {
            DefaultNotify.notifyDanger('شما هیچ ویرایشی انجام نداده اید', '', NotiConfig.notifyConfig);
            // this.loading = false;
            this.disabledButton = false;
        } else {
            this.checkPartCodeLoading = true;
            this.disabledButton = true;
            this.loading = true;
            this.part.partCode = Toolkit2.Common.Fa2En(this.part.partCode);
            if ((!isNullOrUndefined(this.partCopy.partCode) &&
                this.part.partCode !== this.partCopy.partCode) || isNullOrUndefined(this.partCopy.partCode)) {
                this.partService.checkPartCode({partCode: this.part.partCode}).subscribe(res => {
                    this.loading = false;
                    if (res && res.exist) {
                        DefaultNotify.notifyDanger('کد وارد شده تکراری می باشد.', '', NotiConfig.notifyConfig);
                        if (!isNullOrUndefined(this.part.id)) {
                            this.part.partCode = this.partCopy.partCode;
                        } else {
                            $('#2').addClass('is-invalid');
                        }
                        this.disabledButton = false;
                        this.checkPartCodeLoading = false;
                        return;
                    } else if (res && !res.exist) {
                        $('#2').removeClass('is-invalid');
                        this.action(form);
                        this.checkPartCodeLoading = false;
                    }
                });
            } else {
                this.action(form);
                this.checkPartCodeLoading = false;
            }
        }
    }

    action(form) {
        if (form.invalid) {
            DefaultNotify.notifyDanger('ورودی‌ها را بررسی کنید.', '', NotiConfig.notifyConfig);
            this.disabledButton = false;
            this.loading = false;
            return;
        }
        if (this.mode === ActionMode.ADD) {
            this.partService.create(this.part)
                .pipe(takeUntilDestroyed(this)).subscribe((res: PartDto.GetOnePart) => {
                this.loading = false;
                this.disabledButton = false;
                if (res) {
                    this.part.id = res.id;
                    this.partId = res.id;
                    this.router.navigate([], {
                        queryParams: {mode: 'EDIT', entityId: res.id},
                        relativeTo: this.activatedRoute
                    });
                    DefaultNotify.notifySuccess('با موفقیت افزوده شد.', '', NotiConfig.notifyConfig);
                    this.mode = ActionMode.EDIT;
                    this.valid = true;
                    this.partCopy = JSON.parse(JSON.stringify(this.part));
                }
            }, error => {
                this.loading = false;
            });
        } else if (this.mode === ActionMode.EDIT) {
            if (JSON.stringify(this.partCopy) === JSON.stringify(this.part)) {
                DefaultNotify.notifyDanger('شما هیچ ویرایشی انجام نداده اید', '', NotiConfig.notifyConfig);
                this.loading = false;
                this.disabledButton = false;
                this.disabledButton = false;
            } else {
                this.partService.update(this.part, {partId: this.part.id})
                    .pipe(takeUntilDestroyed(this)).subscribe(res => {
                    this.loading = false;
                    this.disabledButton = true;
                    if (res) {
                        DefaultNotify.notifySuccess('ویرایش با موفقیت انجام شد.', '', NotiConfig.notifyConfig);
                        this.valid = true;
                        this.partCopy = JSON.parse(JSON.stringify(this.part));
                    }
                }, error => {
                    this.loading = false;
                });
            }
        }
        setTimeout(() => {
            $('#inventory').click();
        }, 500);

    }


    next() {
        this.inventoryB = true;
        setTimeout(() => {
            $('#partCreate').carousel('next');
        }, 100);
    }

    prev() {
        $('#partCreate').carousel('prev');
    }

    cancelModal(item) {
        if (item === 'budgetAllocatedModal') {
            ModalUtil.hideModal('budgetAllocatedModal');
        }
        if (item === 'maintenanceOfficerModal') {
            ModalUtil.hideModal('maintenanceOfficerModal');
        }


    }
}
