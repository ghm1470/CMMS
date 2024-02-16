import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActionMode, DefaultNotify, Toolkit2} from '@angular-boot/util';
import {Budget} from '../../model/dto/budget';
import {Currency} from '../../../currency/model/dto/currency';
import {ActivatedRoute} from '@angular/router';
import {CurrencyService} from '../../../currency/endpoint/currency.service';
import {BudgetService} from '../../endpoint/budget.service';
import {Location} from '@angular/common';
import {isNullOrUndefined} from 'util';
import {takeUntilDestroyed} from '@angular-boot/core';
import {MyPattern} from '../../../../../shared/shared/tools/myPattern';
import {NotiConfig} from "../../../../../shared/tools/notifyConfig";

declare var $: any;

@Component({
    selector: 'app-budget-action',
    templateUrl: './budget-action.component.html',
    styleUrls: ['./budget-action.component.scss']
})
export class BudgetActionComponent implements OnInit, OnDestroy {

    mode: ActionMode = ActionMode.ADD;
    actionMode = ActionMode;
    budget = new Budget();
    budgetCopy = new Budget();
    budgetId: string;
    myPattern = MyPattern;
    currencyList: Currency[] = [];
    doSave = false;
    loading = false;
    x;
    m: number;
    f = '';
    n;
    disabledButton = false;
    currencyName: string;
    checkBudgetCode = false;

    constructor(
        public location: Location,
        public budgetService: BudgetService,
        public currencyService: CurrencyService,
        private activatedRoute: ActivatedRoute,
    ) {
        // this.budget.currencyId.id = '-1';
        this.mode = this.activatedRoute.snapshot.queryParams.mode;
        this.budgetId = this.activatedRoute.snapshot.queryParams.entityId;
    }

    ngOnInit() {
        this.getAllCurrency();

        if (this.mode === ActionMode.EDIT) {
            if (!isNullOrUndefined(this.budgetId)) {
                this.getOne();
            }
        }
    }

    getAllCurrency() {
        this.currencyService.getAll()
            .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {

            if (!isNullOrUndefined(res)) {
                this.currencyList = res;
                if (this.mode === ActionMode.ADD) {
                    if (this.currencyList.length > 0) {
                        this.budget.currencyId = this.currencyList[0].id;
                    }
                }
            }
        });
    }

    getOne() {
        this.loading = true;
        this.budgetService.getOne({id: this.budgetId})
            .pipe(takeUntilDestroyed(this)).subscribe((res: Budget) => {
            this.loading = false;
            if (res) {
                this.budget = res;
                this.budgetCopy = JSON.parse(JSON.stringify(res));
                // this.budget.currencyId = res.currency.id;
                // this.budgetCopy.currencyId = JSON.parse(JSON.stringify(res.currency.id));

            }
        });
    }

    action(form) {
        this.budget.budgetAmount = Toolkit2.Common.Fa2En(this.budget.budgetAmount);
        if (this.mode === ActionMode.ADD) {
            this.loading = true;
            this.budgetService.create(this.budget)
                .pipe(takeUntilDestroyed(this)).subscribe(res => {
                this.loading = false;
                if (res) {
                    DefaultNotify.notifySuccess('با موفقیت افزوده شد.', '', NotiConfig.notifyConfig);
                    form.reset();
                    this.cancel();
                }
            }, error => {
                if (error.status === 302) {
                    this.loading = false;
                    DefaultNotify.notifyDanger('مقدار عنوان تکراری است.', '', NotiConfig.notifyConfig);
                    this.budget.title = '';
                }
            });
        } else if (this.mode === ActionMode.EDIT) {
            if (JSON.stringify(this.budget) === JSON.stringify(this.budgetCopy)) {
                DefaultNotify.notifyDanger('شما هیچ ویرایشی انجام نداده اید', '', NotiConfig.notifyConfig);
                this.loading = false;
            } else {
                this.loading = true;
                this.budgetService.update(this.budget, {budgetId: this.budgetId})
                    .pipe(takeUntilDestroyed(this)).subscribe(res => {
                    this.loading = false;
                    if (res) {
                        DefaultNotify.notifySuccess('ویرایش با موفقیت انجام شد.', '', NotiConfig.notifyConfig);
                        this.cancel();
                    }
                }, error => {
                    if (error.status === 302) {
                        DefaultNotify.notifyDanger('مقدار عنوان تکراری است.', '', NotiConfig.notifyConfig);
                        this.budget.title = '';
                    }
                    if (error.status === 404) {
                        DefaultNotify.notifyDanger(error.error.message, '', NotiConfig.notifyConfig);
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

    stringLength(value, id) {
        if (!isNullOrUndefined(value)) {
            if (id !== 'budgetAmount' || (value === 0 && id === 'budgetAmount')) {
                if (value === 0 && id === 'budgetAmount') {
                    value = ' ';
                }
                value = value.trim();
                if (value.length === 0) {
                    $('#' + id).addClass('is-invalid').removeClass('is-valid');
                    // $('#' + id).addClass('ng-invalid').removeClass('ng-valid');
                    $('#uForm').addClass('ng-invalid').removeClass('ng-valid');
                    // if (id === 'title2') {
                    //   this.budget.title = '';
                    // }
                    return false;
                } else {
                    $('#' + id).addClass('is-valid').removeClass('is-invalid');
                    // $('#' + id).addClass('ng-valid').removeClass('ng-invalid');
                    $('#uForm').addClass('ng-valid').removeClass('ng-invalid');
                    return true;

                }
            }
        }
    }

    ssss(event) {
        this.f = '';
        this.m = event.target.value;
        while (this.m > 1000) {
            this.n = this.m % 1000;
            this.m = (this.m - this.n) / 1000;
            this.f = this.f + ' , ' + this.n.toString();
        }

        // this.budget.budgetAmount = this.f + ' , ' + this.m ;
        // this.budget.budgetAmount =   this.budget.budgetAmount.split('').reverse().join();
    }

    changeCurrency() {
        for (const item of this.currencyList) {
            if (this.budget.currencyId === item.id) {
                this.currencyName = item.title;
            }
        }
    }


    checkCode(form) {
        if (this.loading) {
            return;
        }
        if (JSON.stringify(this.budget) === JSON.stringify(this.budgetCopy) && this.mode === ActionMode.EDIT) {
            DefaultNotify.notifyDanger('شما هیچ ویرایشی انجام نداده اید', '', NotiConfig.notifyConfig);
            return;
        }
        this.doSave = true;

        if (!this.budget.title || !this.budget.currencyId) {
            DefaultNotify.notifyDanger('ورودی‌ها را بررسی کنید.', '', NotiConfig.notifyConfig);
            return;
        }
        if (form.invalid) {
            DefaultNotify.notifyDanger('ورودی‌ها را بررسی کنید.', '', NotiConfig.notifyConfig);
            return;
        }
        this.budget.code = Toolkit2.Common.Fa2En(this.budget.code);
        this.budget.title = this.budget.title.trim();
        this.checkBudgetCode = true;
        this.loading = true;

        if (this.budget.code === this.budgetCopy.code) {
            this.checkBudgetCode = false;
            this.action(form);
        } else {
            this.budgetService.checkBudgetCode({code: this.budget.code}).subscribe(res => {
                if (res) {
                    DefaultNotify.notifyDanger('کد وارد شده موجود است.', '', NotiConfig.notifyConfig);
                    // this.budget.code = '';
                    this.checkBudgetCode = false;
                    this.loading = false;

                } else {
                    this.checkBudgetCode = false;
                    this.action(form);
                }

            });
        }
    }
}
