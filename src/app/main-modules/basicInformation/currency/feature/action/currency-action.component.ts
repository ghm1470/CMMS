import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActionMode, DefaultNotify} from '@angular-boot/util';
import {Currency} from '../../model/dto/currency';
import {MyPattern} from '../../../../../shared/shared/tools/myPattern';
import {CurrencyService} from '../../endpoint/currency.service';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {isNullOrUndefined} from 'util';
import {takeUntilDestroyed} from '@angular-boot/core';
import {NotiConfig} from "../../../../../shared/tools/notifyConfig";

declare var $: any;

@Component({
    selector: 'app-currency-action',
    templateUrl: './currency-action.component.html',
    styleUrls: ['./currency-action.component.scss']
})
export class CurrencyActionComponent implements OnInit, OnDestroy {

    mode: ActionMode = ActionMode.ADD;
    actionMode = ActionMode;
    currency = new Currency();
    currencyCopy = new Currency();
    currencyId: string;
    myPattern = MyPattern;
    doSave = false;
    loadingGetOne = false;
    loading = false;
    invalid = false;
    addSpaceFirstTime = false;
    disabledButton = false;

    constructor(
        public location: Location,
        public currencyService: CurrencyService,
        private activatedRoute: ActivatedRoute,
    ) {
        this.mode = this.activatedRoute.snapshot.queryParams.mode;
        this.currencyId = this.activatedRoute.snapshot.queryParams.currencyId;
    }

    ngOnInit() {
        if (this.mode === ActionMode.EDIT) {
            if (!isNullOrUndefined(this.currencyId)) {
                this.getOne();
            }
        }
    }

    getOne() {
        this.loadingGetOne = true;
        this.currencyService.getOne({currencyId: this.currencyId})
            .pipe(takeUntilDestroyed(this)).subscribe((res: Currency) => {
            this.loadingGetOne = false;
            if (res) {
                this.currency = res;
                this.currencyCopy = JSON.parse(JSON.stringify(res));
            }
        });
    }

    checkIfTitleAndIsoCodeExist(form) {
        if (this.loading === true) {
            return;
        }
        if (JSON.stringify(this.currency) === JSON.stringify(this.currencyCopy) && this.mode === ActionMode.EDIT) {
            DefaultNotify.notifyDanger('شما هیچ ویرایشی انجام نداده اید', '', NotiConfig.notifyConfig);
            return;
        }
        this.loading = true;
        this.doSave = true;
        this.currency.isoCode ? this.currency.isoCode = this.currency.isoCode.trim() : '';
        this.currency.title ? this.currency.title = this.currency.title.trim() : '';
        if ($('#form').hasClass('ng-invalid')) {
            DefaultNotify.notifyDanger('ورودی‌ها را بررسی کنید.', '', NotiConfig.notifyConfig);
            this.loading = false;
            this.disabledButton = false;
            return;
        }
        if (form.invalid) {
            DefaultNotify.notifyDanger('ورودی‌ها را بررسی کنید.', '', NotiConfig.notifyConfig);
            this.loading = false;
            this.disabledButton = false;
            return;
        }
        const dto = {
            isoCode: this.currency.isoCode,
            title: this.currency.title
        };
        //TODO
        // چک شود سرویس از سمت سرور درست باشد
        this.currencyService.checkIfTitleAndIsoCodeExist(dto).subscribe((res: any) => {
            if (res) {
                DefaultNotify.notifyDanger('آیتمی با این عنوان و نماد موجود میباشد.', '', NotiConfig.notifyConfig);
                this.loading = false;
                this.disabledButton = false;
                return;
            } else {
                this.action(form);
            }
        }, error => {
            this.loading = false;
            this.doSave = false;
            this.disabledButton = false;

        });
    }

    action(form) {

        if (this.mode === ActionMode.ADD) {
            this.currencyService.create(this.currency)
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
                this.disabledButton = false;
                if (error.status === 302) {

                    DefaultNotify.notifyDanger('مقدار عنوان واحد پول تکراری است.', '', NotiConfig.notifyConfig);
                }
            });
        } else if (this.mode === ActionMode.EDIT) {
            if (JSON.stringify(this.currency) === JSON.stringify(this.currencyCopy)) {
                DefaultNotify.notifyDanger('شما هیچ ویرایشی انجام نداده اید', '', NotiConfig.notifyConfig);
                this.loading = false;
                this.disabledButton = false;
            } else {
                this.currencyService.update(this.currency, {currencyId: this.currencyId})
                    .pipe(takeUntilDestroyed(this)).subscribe(res => {
                    this.loading = false;
                    this.disabledButton = false;
                    if (res) {
                        DefaultNotify.notifySuccess('ویرایش با موفقیت انجام شد.', '', NotiConfig.notifyConfig);
                        this.cancel();
                    }
                }, error => {
                    this.loading = false;
                    this.disabledButton = false;
                    if (error.status === 302) {

                        DefaultNotify.notifyDanger('مقدار عنوان واحد پول تکراری است.', '', NotiConfig.notifyConfig);
                    }
                });
            }
        }
    }

    cancel() {
        this.location.back();
    }

    ngOnDestroy(): void {
    }

    trim() {
        this.currency.title = this.currency.title.trim();

    }

}
