import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output} from '@angular/core';
import {PropertyDto} from '../../../basicInformation/property/model/dto/propertyDto';
import {AssetService} from '../../endpoint/asset.service';
import {PropertyService} from '../../../basicInformation/property/endpoint/property.service';
import {takeUntilDestroyed} from '@angular-boot/core';
import {ActionMode, DefaultNotify, Toolkit2} from '@angular-boot/util';
import {PropertyCategoryDto} from '../../../basicInformation/propertyCategory/model/dto/property-category-dto';
import {PropertyCategoryService} from '../../../basicInformation/propertyCategory/endpoint/property-category.service';
import ValueType = PropertyDto.ValueType;
import {NotiConfig} from "../../../../shared/tools/notifyConfig";

declare var $: any;

@Component({
    selector: 'app-property-list-for-asset',
    templateUrl: './property-list-for-asset.component.html',
    styleUrls: ['./property-list-for-asset.component.scss']
})
export class PropertyListForAssetComponent implements OnInit, OnDestroy, OnChanges {


    @Input() assetId: string;
    selectedProperty: PropertyDto.Create = new PropertyDto.Create();
    selectedPropertyId: string;
    assetPropertyList: PropertyDto.Create[] = [];
    @Input() assetPropertyListIn: PropertyDto.Create[];
    propertyList: PropertyDto.Create[] = [];
    propertyType = PropertyDto.PropertyType;
    valueOfKay: string;
    valueType = ValueType;
    @Input() mode: ActionMode;
    actionMode = ActionMode;
    loading = false;
    selectedPropertyCategory: any;
    propertyCategoryList: PropertyCategoryDto.Create [] = [];
    toolKit2 = Toolkit2;
    @Output() assetPropertyListOut = new EventEmitter<any>();

    constructor(public assetService: AssetService,
                private propertyCategoryService: PropertyCategoryService,
                public propertyService: PropertyService) {
        this.selectedProperty.id = '-1';
    }

    ngOnInit() {

        this.getPropertyListByAssetId();
        // if (this.mode !== this.actionMode.VIEW) {
        this.getPropertyCategory();
        // }

    }

    ngOnChanges(): void {
        this.assetPropertyList = this.assetPropertyListIn;
    }

    getPropertyCategory() {
        this.propertyCategoryService.getAllPropertyCategoryTitle().subscribe(res => {
            if (res) {
                this.propertyCategoryList = res;
            }
        });
    }

    getAllProperty() {
        this.propertyService.getAll().pipe(takeUntilDestroyed(this)).subscribe((res: PropertyDto.Create[]) => {
            if (res && res.length) {
                this.propertyList = res;
                this.filterPropertyList();
            }
        });
    }

    getPropertyListByAssetId() {
        this.loading = true;
        this.assetService.getPropertyListByAssetId({assetId: this.assetId})
            .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
            this.loading = false;
            if (res.propertyList && res.propertyList.length > 0) {

                this.assetPropertyList = res.propertyList;
                this.filterPropertyList();
            } else {
                this.getAssetTemplatePropertyByAssetId();
            }
        });
    }

    getAssetTemplatePropertyByAssetId() {
        this.assetService.getAssetTemplatePropertyListByAssetId({assetId: this.assetId})
            .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
            if (res && res.propertyList && res.propertyList.length) {
                this.assetPropertyList = res.propertyList;
                this.filterPropertyList();
            }
        });
    }

    update() {
        this.assetService.updateAssetPropertyList(this.assetPropertyList, {assetId: this.assetId})
            .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
            if (res) {
                DefaultNotify.notifySuccess('عملیات با موفقیت انجام شد.', '', NotiConfig.notifyConfig);
                this.assetPropertyListOut.emit(this.assetPropertyList);
            } else {
                DefaultNotify.notifyDanger('عملیات انجام نشد دوباره تلاش کنید.', '', NotiConfig.notifyConfig);
            }
        });
    }

    filterPropertyList() {
        // const length = this.assetPropertyList.length - 1;
        // for (let i = 0; i <= length; i++) {
        // this.propertyList = this.propertyList.filter(property => property.id !== this.assetPropertyList[i].id);
        // }
    }

    deleteProperty(id) {
        // this.propertyList.push(this.assetPropertyList.find(property => property.id === id));
        this.assetPropertyList = this.assetPropertyList.filter(property => property.id !== id);
        // this.selectedProperty.id = '-1';
    }

    previousData: Array<string> = [];
    propertyMode = ActionMode.ADD;

    editProperty(item: PropertyDto.Create) {
        // $('#selectedPropertyCategory').val(item.propertyCategoryId).trigger('change');
        this.selectedPropertyCategory = item.propertyCategoryId;
        this.changePropertyCategory();
        this.selectedProperty = new PropertyDto.Create();
        this.selectedProperty = item;
        // this.selectedPropertyId = item.id;
        setTimeout(e => {
            this.selectedPropertyId = item.id;
            //     this.selectedProperty = item;
            if (this.selectedProperty.type === this.propertyType[this.propertyType.keyValue.toString()] &&
                this.selectedProperty.data && this.selectedProperty.data.length === 1) {
                this.valueOfKay = this.selectedProperty.data[0];
            }
        }, 100);
        // this.propertyList = this.propertyList.filter(property => property.id !== this.selectedProperty.id);
        this.previousData = JSON.parse(JSON.stringify(this.selectedProperty.data));

        this.propertyMode = ActionMode.EDIT;
    }

    addProperty1() {
        if (this.selectedProperty.type === this.propertyType[this.propertyType.keyValue.toString()]) {
            if (!this.valueOfKay) {
                DefaultNotify.notifyDanger('ابتدا مقدار را وارد کنید!', '', NotiConfig.notifyConfig);
                return;
            }
            this.selectedProperty.data.push(this.valueOfKay);
            this.valueOfKay = null;
        }
        if (!this.selectedProperty.data.length) {
            DefaultNotify.notifyDanger('ابتدا انتخاب کنید!', '', NotiConfig.notifyConfig);
            return;
        }
        // this.propertyList = this.propertyList.filter(property => property.id !== this.selectedProperty.id);
        this.assetPropertyList.push(this.selectedProperty);
        this.selectedProperty = new PropertyDto.Create();
        this.selectedProperty.id = '-1';

    }

    addProperty() {
        this.selectedProperty.parentCategoryId = null;

        if (this.propertyMode === ActionMode.EDIT) {

            if (this.selectedProperty.type === this.propertyType[this.propertyType.keyValue.toString()]) {
                if (!this.valueOfKay) {
                    DefaultNotify.notifyDanger('ابتدا مقدار وارد گردد!', '', NotiConfig.notifyConfig);
                    return;
                }

                this.selectedProperty.data = [];
                this.selectedProperty.data.push(this.valueOfKay);
            }
            if (!this.selectedProperty.data.length) {
                DefaultNotify.notifyDanger('ابتدا مقدار انتخاب گردد!', '', NotiConfig.notifyConfig);
                return;
            }
            //     property.id === this.selectedProperty.id));
            //     property.id === this.selectedProperty.id)]);
            if (!this.selectedProperty.data.length) {
                DefaultNotify.notifyDanger('ابتدا مقدار انتخاب گردد!', '', NotiConfig.notifyConfig);
                return;
            }
            this.assetPropertyList[this.assetPropertyList.findIndex(property => property.id
                === this.selectedProperty.id)] = this.selectedProperty;


        } else if (this.propertyMode === ActionMode.ADD) {
            const index = this.assetPropertyList.findIndex(e => e.id === this.selectedProperty.id);

            if (this.selectedProperty.type === this.propertyType[this.propertyType.keyValue.toString()]) {
                if (!this.valueOfKay) {
                    DefaultNotify.notifyDanger('ابتدا مقدار وارد گردد!', '', NotiConfig.notifyConfig);
                    return;
                }
                this.selectedProperty.data = [];
                this.selectedProperty.data.push(this.valueOfKay);
            }
            if (!this.selectedProperty.data.length) {
                DefaultNotify.notifyDanger('ابتدا مقدار انتخاب گردد!', '', NotiConfig.notifyConfig);
                return;
            }
            if (index !== -1) {
                this.assetPropertyList.splice(index, 1);
            }
            this.assetPropertyList.push(this.selectedProperty);
        }

        // this.propertyList = this.propertyList.filter(property => property.id !== this.selectedProperty.id);

        this.valueOfKay = null;
        this.selectedPropertyId = null;
        this.selectedProperty = new PropertyDto.Create();
        this.propertyMode = ActionMode.ADD;
        this.selectedProperty.id = '-1';

    }

    addOrRemoveData(item: string) {
        if (this.selectedProperty.data.find(d => d === item)) {
            this.selectedProperty.data = this.selectedProperty.data.filter(d => d !== item);
        } else {
            this.selectedProperty.data.push(item);
        }
    }

    addValueInData(item: string) {
        this.selectedProperty.data = [];
        this.selectedProperty.data.push(item);
    }

    changePropertyCategory() {
        this.propertyList = [];
        setTimeout(e => {
            this.selectedPropertyId = null;
            this.valueOfKay = null;
        }, 10);
        this.propertyService.getPropertyByPropertyCategoryId({propertyCategoryId: this.selectedPropertyCategory}).subscribe(res => {
            if (res) {
                if (this.assetPropertyList) {
                    if (this.assetPropertyList.length > 0) {
                        for (const item of res) {
                            // if (!this.checkHasProperty(item.id)) {
                            this.propertyList.push(item);
                            // }
                        }
                    } else {
                        this.propertyList = res;
                    }
                } else {
                    this.propertyList = res;
                }
            }
        });
    }

    changeProperty(selectedPropertyId) {
        if (this.assetPropertyList.some(p => p.id === selectedPropertyId)) {
            DefaultNotify.notifyDanger('این مشخصه قبلا انتخاب شده است.', '', NotiConfig.notifyConfig);
            setTimeout(e => {
                this.selectedPropertyId = null;
            }, 10);
            return;
        }

        if (selectedPropertyId) {
            this.selectedProperty = this.propertyList.find(p => p.id === selectedPropertyId);
        }
        setTimeout(e => {
            this.valueOfKay = null;
        }, 10);
    }


    checkHasProperty(id) {
        return this.assetPropertyList.find(item => {
            return item.id === id;
        });
    }


    ngOnDestroy(): void {
    }

}
