import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AssetService} from '../../endpoint/asset.service';
import {takeUntilDestroyed} from '@angular-boot/core';
import {CompanyDto} from '../../../company/model/dto/companyDto';
import {CompanyService} from '../../../company/endpoint/company.service';
import {ActionMode, DefaultNotify, isNullOrUndefined, ModalSize, Toolkit2} from '@angular-boot/util';
import {ModalUtil} from '@angular-boot/widgets';
import * as FileSaver from 'file-saver';
import {DownloadService} from '../../../../shared/service/download.service';
import Document = CompanyDto.Document;
import {NotiConfig} from "../../../../shared/tools/notifyConfig";

@Component({
    selector: 'app-company-list-for-asset',
    templateUrl: './company-list-for-asset.component.html',
    styleUrls: ['./company-list-for-asset.component.scss']
})
export class CompanyListForAssetComponent implements OnInit, OnDestroy {

    constructor(public companyService: CompanyService,
                public downloadService: DownloadService,
                public assetService: AssetService) {
        this.selectedCompany.id = '-1';
    }

    @Input() assetId: string;
    companyList: CompanyDto.Create[] = [];
    assetCompanyList: CompanyDto.Create[] = [];
    selectedCompany: CompanyDto.Create = new CompanyDto.Create();

    @Input() mode: ActionMode;
    actionMode = ActionMode;
    loading = false;
    toolKit2 = Toolkit2;
    MyModalSize = ModalSize;
    modalId = ModalUtil.generateModalId();

    selectedCompanyForView = new CompanyDto.Create();
    loadingSelectedCompanyForView = false;

    ngOnInit() {
        if (this.mode !== this.actionMode.VIEW) {
            this.getAllCompany();
        }
        this.getCompanyListByAssetId();
    }

    getCompanyListByAssetId() {
        this.loading = true;
        this.assetService.getCompanyListByAssetId({assetId: this.assetId}).pipe(takeUntilDestroyed(this))

            .subscribe((res: any) => {
                this.loading = false;
                if (res && res.companyList && res.companyList.length) {
                    this.assetCompanyList = res.companyList;
                    this.filterCompanyList();
                }
            });
    }

    getAllCompany() {
        this.companyService.getAll().pipe(takeUntilDestroyed(this))
            .subscribe((res: CompanyDto.Create[]) => {
                if (res && res.length) {
                    this.companyList = res;
                    this.filterCompanyList();
                }
            });
    }

    filterCompanyList() {
        if (this.companyList.length > 0 && this.assetCompanyList.length > 0) {
            for (const item of this.assetCompanyList) {
                this.companyList = this.companyList.filter(company => company.id !== item.id);
            }
        }
    }

    updateAssetCompanyList() {
        const assetCompanyIdList = [];
        for (const company of this.assetCompanyList) {
            assetCompanyIdList.push(company.id);
        }
        this.assetService.updateAssetCompanyList(assetCompanyIdList, {assetId: this.assetId})
            .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
            if (res) {
                DefaultNotify.notifySuccess('عملیات با موفقیت انجام شد.', '', NotiConfig.notifyConfig);
            } else {
                DefaultNotify.notifyDanger('عملیات انجام نشد دوباره تلاش کنید.', '', NotiConfig.notifyConfig);
            }
        });
    }

    ngOnDestroy(): void {
    }

    changeCompany() {
        if (this.selectedCompany.id !== '-1' && this.selectedCompany.id) {
            this.assetCompanyList.push(this.companyList.find(company => company.id === this.selectedCompany.id));
            this.companyList = this.companyList.filter(company => company.id !== this.selectedCompany.id);
            this.selectedCompany = new CompanyDto.Create();
            this.selectedCompany.id = '-1';
        }
    }

    deleteCompany(id: string) {
        this.companyList.push(this.assetCompanyList.find(company => company.id === id));
        this.assetCompanyList = this.assetCompanyList.filter(company => company.id !== id);
    }

    showModalViewCompany(companyId) {
        this.selectedCompanyForView.id = companyId;
        this.loadingSelectedCompanyForView = true;
        this.companyService.getOne({companyId})
            .pipe(takeUntilDestroyed(this)).subscribe((res: CompanyDto.Create) => {
            this.loadingSelectedCompanyForView = false;
            if (res) {
                if (!res.address) {
                    res.address = new CompanyDto.Address();
                }
                this.selectedCompanyForView = res;
                setTimeout(e => {
                    ModalUtil.showModal(this.modalId);
                }, 10);
            }
        }, error => {
            this.loadingSelectedCompanyForView = false;
        });

    }

    fileType(fileName: string) {

        return fileName.split('.').pop();
    }

    downloadFile(item: Document) {
        this.downloadService.downloadFile({documentId: item.id}).pipe(takeUntilDestroyed(this))
            .subscribe((res: any) => {

                if (!isNullOrUndefined(res)) {
                    FileSaver.saveAs(res, item.fileName);
                }
            });
    }

}
