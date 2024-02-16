import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActionMode, DefaultNotify, EnumHandle, isNullOrUndefined} from "@angular-boot/util";
import {AssetDto} from "../../model/dto/assetDto";
import {Location} from "@angular/common";
import {CategoryDto} from "../../../category/model/dto/categoryDto";
import {MyPattern} from "../../../../shared/shared/tools/myPattern";
import {AssetTemplateDto} from "../../../assetTemplate/model/dto/assetTemplateDto";
import {UserDto} from "../../../user/model/dto/user-dto";
import {Asset} from "../tree-action/tree-action.component";
import {AssetService} from "../../endpoint/asset.service";
import {UploadService} from "../../../../shared/service/upload.service";
import {AssetTemplateService} from "../../../assetTemplate/endpoint/asset-template.service";
import {ActivatedRoute} from "@angular/router";
import {takeUntilDestroyed} from "@angular-boot/core";
import CategoryType = CategoryDto.CategoryType;
import {ActivityService} from "../../../activity/service/activity.service";

declare var $: any;

@Component({
    selector: 'app-tree-view-complete',
    templateUrl: './tree-view-complete.component.html',
    styleUrls: ['./tree-view-complete.component.scss']
})
export class TreeViewCompleteComponent implements OnInit, OnDestroy {
    mode: ActionMode = ActionMode.ADD;
    actionMode = ActionMode;
    asset = new AssetDto.CreateAsset();
    assetCopy = new AssetDto.CreateAsset();
    activityList: any[] = [];

    assetId: string;
    myPattern = MyPattern;
    files: Array<File> = [];
    fileModel: Array<any> = [];
    doSave = false;
    assetTemplateList: AssetTemplateDto.Create[] = [];
    selectedUser: UserDto.Create = new UserDto.Create();
    menuStatus = false;
    showPartList = false;
    showPropertyList = false;
    showUserList = false;
    showCompanyList = false;
    showDocumentList = false;
    showMeteringList = false;
    showWarrantyList = false;
    assetList: AssetDto.CreateAsset[] = [];
    categoryTypeList: any[] = [];
    showInput = false;
    sendTypeGetAll: string;
    rootBuilding = false;
    hasParent = false;
    hasBuildingParentForFacility = false;
    hasFacilityParentForFacility = false;
    hasBuildingParentForTools = false;
    hasFacilityParentForTools = false;
    parentAssetB = new Asset();
    parentAssetBCopy = new Asset();
    // parentAssetF = new Asset();
    // parentAssetT = new Asset();
    modeOfCategoryType: string;
    CategoryType = CategoryDto.CategoryType;

    constructor(public location: Location,
                public assetService: AssetService,
                public uploadService: UploadService,
                public assetTemplateService: AssetTemplateService,
                public activityService: ActivityService,
                private activatedRoute: ActivatedRoute) {
        this.asset.assetTemplateId = '-1';
        this.selectedUser.id = '-1';
        this.assetId = this.activatedRoute.snapshot.queryParams.entityId;
        this.categoryTypeList = EnumHandle.getAsValueTitleList(CategoryDto.CategoryType);
    }

    ngOnInit() {
        this.activityList = [];
        this.getAllActivity();
        if (!isNullOrUndefined(this.assetId)) {
            this.getOne();
            this.menuStatus = true;
        }
    }

    getAllActivity() {
        this.activityService.getAllActivity().subscribe(res => {
            if (!isNullOrUndefined(res)) {
                this.activityList = res;

            }
        });
    }

    ngOnDestroy(): void {
    }

    getOne() {
        this.assetService.getOneTow({assetId: this.assetId})
            .pipe(takeUntilDestroyed(this)).subscribe((res: AssetDto.GetOneAsset) => {
            if (res) {
                this.asset = res.mainAsset;
                this.assetCopy = JSON.parse(JSON.stringify(res.mainAsset));
                if (res.parentAsset) {
                    this.parentAssetB.id = res.parentAsset.id;
                    this.parentAssetB.isPartOfAsset = res.parentAsset.isPartOfAsset;
                    this.parentAssetB.hasChild = res.parentAsset.hasChild;
                    this.parentAssetB.code = res.parentAsset.code;
                    this.parentAssetB.name = res.parentAsset.name;
                    this.parentAssetB.status = res.parentAsset.status;
                    this.parentAssetB.categoryType = res.parentAsset.categoryType;
                    this.parentAssetBCopy = JSON.parse(JSON.stringify(res.parentAsset));
                }
                this.getAllAssetTemplate();
            }
        });
    }


    getAllAssetTemplate() {
        this.assetTemplateService.getAllAssetTemplate({categoryTypeValue: this.asset.categoryType}).pipe(takeUntilDestroyed(this))
            .subscribe((res: AssetTemplateDto.Create[]) => {
                if (res && res.length) {
                    this.assetTemplateList = res;
                }
            });
    }

    next() {
        $('#assetCreate').carousel('next');
    }

    prev() {
        $('#assetCreate').carousel('prev');
    }

    //
    //
    //
    //
    // otherAssetSubset(event) {
    //   if (event.target.checked === false) {
    //     // =======================================================
    //     if (this.modeOfCategoryType === 'B') {
    //       this.rootBuilding = false;
    //       if (this.hasParent === false) {
    //         $('#hasParent').click();
    //       }
    //     }
    //     // ==========================================================
    //     if (this.modeOfCategoryType === 'F') {
    //       this.hasBuildingParentForFacility = false;
    //       this.asset.isPartOfAsset = '';
    //       // if (this.hasFacilityParentForFacility === false) {
    //       //   $('#hasFacilityParentForFacility').click();
    //       // }
    //     }
    //     // ==========================================================
    //     if (this.modeOfCategoryType === 'T') {
    //       this.hasBuildingParentForTools = false;
    //       this.asset.isPartOfAsset = '';
    //       // if (this.hasFacilityParentForTools === false) {
    //       //   $('#hasFacilityParentForTools').click();
    //       // }
    //     }
    //     // ==========================================================
    //   } else {
    //     if (this.modeOfCategoryType === 'B') {
    //       this.rootBuilding = true;
    //       if (this.hasParent === true) {
    //         $('#hasParent').click();
    //       }
    //     }
    //     // ==========================================================
    //     if (this.modeOfCategoryType === 'F') {
    //       this.hasBuildingParentForFacility = true;
    //       this.sendTypeGetAll = 'B';
    //       if (this.hasFacilityParentForFacility === true) {
    //         $('#hasFacilityParentForFacility').click();
    //       }
    //     }
    //     // ==========================================================
    //     if (this.modeOfCategoryType === 'T') {
    //       this.hasBuildingParentForTools = true;
    //       this.sendTypeGetAll = 'B';
    //       if (this.hasFacilityParentForTools === true) {
    //         $('#hasFacilityParentForTools').click();
    //       }
    //     }
    //   }
    //   // ==========================================================
    //   // if (event.target.checked === false) {
    //   //   this.rootBuilding = false;
    //   //   if (this.hasParent === false) {
    //   //     $('#hasParent').click();
    //   //   }
    //   // } else {
    //   //   this.rootBuilding = true;
    //   //   if (this.hasParent === true) {
    //   //     $('#hasParent').click();
    //   //   }
    //   // }
    // }
    //
    // hasParents(event) {
    //   if (event.target.checked) {
    //     if (this.modeOfCategoryType === 'B') {
    //       this.hasParent = true;
    //       this.sendTypeGetAll = 'B';
    //       if (this.rootBuilding === true) {
    //         $('#rootBuilding').click();
    //       }
    //     }
    //     // ==========================================================
    //     if (this.modeOfCategoryType === 'F') {
    //       this.hasFacilityParentForFacility = true;
    //       this.sendTypeGetAll = 'F';
    //       if (this.hasBuildingParentForFacility === true) {
    //         $('#hasBuildingParentForFacility').click();
    //       }
    //     }
    //     // ==========================================================
    //     if (this.modeOfCategoryType === 'T') {
    //       this.hasFacilityParentForTools = true;
    //       this.sendTypeGetAll = 'T';
    //       if (this.hasBuildingParentForTools === true) {
    //         $('#hasBuildingParentForTools').click();
    //       }
    //     }
    //     // ===========================================================
    //   } else {
    //     if (this.modeOfCategoryType === 'B') {
    //       this.hasParent = false;
    //       if (this.rootBuilding === false) {
    //         $('#rootBuilding').click();
    //       }
    //     }
    //     // ==========================================================
    //     if (this.modeOfCategoryType === 'F') {
    //       this.hasFacilityParentForFacility = false;
    //       // if (this.hasBuildingParentForFacility === false) {
    //       //   $('#hasBuildingParentForFacility').click();
    //       // }
    //     }
    //     // ==========================================================
    //     if (this.modeOfCategoryType === 'T') {
    //       this.hasFacilityParentForTools = false;
    //       // if (this.hasBuildingParentForTools === false) {
    //       //   $('#hasBuildingParentForTools').click();
    //       // }
    //     }
    //   }
    // }


    cancel() {
        this.location.back();
    }
}
