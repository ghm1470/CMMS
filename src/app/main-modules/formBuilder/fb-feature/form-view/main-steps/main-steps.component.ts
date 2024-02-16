import {AfterViewInit, Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges} from '@angular/core';
import {LanguageService} from '../../../shared/language-data-service/language.service';
import {Form} from '../../../fb-model/form/form';
import {CacheService} from '../../../shared/cache-service/cache.service';
import {CacheType} from '../../../shared/cache-service/cache-type.enum';
import {FORM} from '../../../fb-model/constants/storage-keys';
import {isNullOrUndefined} from 'util';
import {FormService} from '../../../fb-service/form.service';
import {ActionMode, DefaultNotify, ModalSize} from '@angular-boot/util';
import {ModalUtil} from '@angular-boot/widgets';
import {NotiConfig} from "../../../../../shared/tools/notifyConfig";

declare var $: any;

@Component({
    selector: 'app-main-steps',
    templateUrl: './main-steps.component.html',
    styleUrls: ['./main-steps.component.scss']
})
export class MainStepsComponent implements OnInit, AfterViewInit, OnChanges {
    end = false;
    data: any = null;
    isRtl = false;
    form: Form = new Form();
    formCopy: Form = new Form();
    reset = false;
    MyModalSize = ModalSize;
    keyOfStep = 'firstTabForm';
    disableSave = true;
    showTab = 'firstTabForm';
    @Output() onSubmit = new EventEmitter();
    @Output() edit = new EventEmitter<boolean>();
    @Output() back = new EventEmitter<boolean>();
    @Input() incomingForm: Form;

    // @Input() nextStep1;

    constructor(private languageDataService: LanguageService,
                private formService: FormService,
                private cacheService: CacheService) {
    }

    ngOnInit() {

        if (!isNullOrUndefined(this.incomingForm)) {
            this.form = this.incomingForm;
            this.formCopy = JSON.parse(JSON.stringify(this.incomingForm));
        }
        this.languageDataService.getLanguageData().subscribe(res => {
            this.data = res;
        });
        this.cacheService.setItem(FORM, this.form, CacheType.SESSION_STORAGE);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (!isNullOrUndefined(changes.incomingForm)) {
            this.reset = false;
            if (!isNullOrUndefined(this.incomingForm)) {
                this.reset = true;
                if (this.incomingForm.id != null) {
                    this.formService.getOneForm(this.incomingForm.id).subscribe((res: Form) => {
                        this.form = res;

                        this.cacheService.setItem(FORM, this.form, CacheType.SESSION_STORAGE);
                    });
                } else {
                    this.form = new Form();
                    this.cacheService.setItem(FORM, this.form, CacheType.SESSION_STORAGE);
                }
            }
        }
    }

    formSubmitted(event) {
        this.reset = false;
        this.onSubmit.emit(event);
    }

    ngAfterViewInit() {
        $(document).ready(function () {
            const navListItems = $('ul.setup-panel li a'),
                allWells = $('.setup-content');

            allWells.hide();

            navListItems.click(function (e) {
                e.preventDefault();
                const $target = $($(this).attr('href')),
                    $item = $(this).closest('li');

                if (!$item.hasClass('disabled')) {
                    // navListItems.closest('li').removeClass('active');
                    // $item.addClass('active');
                    allWells.hide();
                    $target.show();
                }
            });

            $('ul.setup-panel li.active a').trigger('click');

            // DEMO ONLY //
            // $('#activate-step-1').on('click', function (e) {
            //   alert('ssss');
            //   $('ul.setup-panel li:eq(0)').removeClass('disabled');
            //   $(this).remove();
            //   $('ul.setup-panel li:eq(0)').addClass('active');
            //   $('ul.setup-panel li:eq(0)').show();
            //
            //   $('ul.setup-panel li:eq(1)').removeClass('active');
            //   $('ul.setup-panel li:eq(2)').removeClass('active');
            //   $('ul.setup-panel li:eq(3)').removeClass('active');
            //   $('ul.setup-panel li:eq(4)').removeClass('active');
            // });

            $('#activate-step-2').on('click', function (e) {
                $('ul.setup-panel li:eq(1)').removeClass('disabled');
                $(this).remove();
                $('ul.setup-panel li:eq(1)').addClass('active');
                $('ul.setup-panel li:eq(1)').show();

                $('ul.setup-panel li:eq(0)').removeClass('active');
            });

            $('#activate-step-3').on('click', function (e) {
                $('ul.setup-panel li:eq(2)').removeClass('disabled');
                $(this).remove();
                $('ul.setup-panel li:eq(2)').addClass('active');
                $('ul.setup-panel li:eq(2)').show();
                $('ul.setup-panel li:eq(1)').removeClass('active');
            });

            $('#activate-step-4').on('click', function (e) {
                $('ul.setup-panel li:eq(3)').removeClass('disabled');
                $(this).remove();
                $('ul.setup-panel li:eq(3)').addClass('active');
                $('ul.setup-panel li:eq(3)').show();
                $('ul.setup-panel li:eq(2)').removeClass('active');
            });

            $('#activate-step-5').on('click', function (e) {
                $('ul.setup-panel li:eq(4)').removeClass('disabled');
                $(this).remove();
                $('ul.setup-panel li:eq(4)').addClass('active');
                $('ul.setup-panel li:eq(4)').show();
                $('ul.setup-panel li:eq(3)').removeClass('active');
            });
        });
    }

    getViewDetail() {
        return false;
    }

    changeEdit(event: boolean) {
        this.edit.emit(event);
    }

    showNoSaveItem() {
        if (this.keyOfStep === 'firstTabForm') {
            ModalUtil.showModal('noSaveMessage');
        }
        if (this.keyOfStep === 'towTabForm') {
            // $('#firstTabForm').click();
            setTimeout(() => {
                this.changeKeyOfStep('firstTabForm');
            }, 20);
        }
        if (this.keyOfStep === 'treeTabForm') {
            // $('#towTabForm').click();
            setTimeout(() => {
                this.changeKeyOfStep('towTabForm');
            }, 20);
        }
        if (this.keyOfStep === 'fourTabForm') {
            // $('#treeTabForm').click();
            setTimeout(() => {
                this.changeKeyOfStep('treeTabForm');
            }, 20);
        }
        if (this.keyOfStep === 'fiveTabForm') {
            // $('#fourTabForm').click();
            setTimeout(() => {
                this.changeKeyOfStep('fourTabForm');
            }, 20);
        }
    }

    cancelCreateForm(item) {
        if (item === true) {
            this.back.emit(true);
            ModalUtil.hideModal('noSaveMessage');
        }
        if (item === false) {
            ModalUtil.hideModal('noSaveMessage');
        }
    }

    changeKeyOfStep(item) {
        if (item === 'towTabForm') {

            if (!this.form.title) {
                DefaultNotify.notifyDanger('عنوان فرم وارد شود.', '', NotiConfig.notifyConfig);
                return;
            }
            if (!this.form.formCategoryId) {
                DefaultNotify.notifyDanger('دسته بندی فرم وارد شود.', '', NotiConfig.notifyConfig);
                return;
            }
            if (this.form.title === this.formCopy.title) {
                this.keyOfStep = item;
            } else {
                this.formService.checkIfTitleIsUnique(this.form.title).subscribe((res: boolean) => {
                    if (res) {
                        DefaultNotify.notifyDanger('عنوان فرم  تکراری است .', '', NotiConfig.notifyConfig);
                        return;
                    } else {
                        this.keyOfStep = item;
                    }
                });
            }
        } else {
            if (item === 'treeTabForm') {
                if (this.form.elementList.length === 0) {
                    DefaultNotify.notifyDanger('حداقل یک مورد  وارد شود.', '', NotiConfig.notifyConfig);
                    return;
                }
            }
            this.keyOfStep = item;
        }
        // this.goToNextStep();
    }

    goToNextStep() {
        if (this.keyOfStep === 'firstTabForm') {
            $('#towTabForm').click();
            setTimeout(() => {
                this.changeKeyOfStep('towTabForm');
            }, 20);
        }
        if (this.keyOfStep === 'towTabForm') {
            // $('#treeTabForm').click();
            setTimeout(() => {
                this.changeKeyOfStep('treeTabForm');
            }, 20);
        }
        if (this.keyOfStep === 'treeTabForm') {
            $('#fourTabForm').click();
            setTimeout(() => {
                this.changeKeyOfStep('fourTabForm');
            }, 20);

        }
        if (this.keyOfStep === 'fourTabForm') {
            $('#fiveTabForm').click();
            setTimeout(() => {
                this.changeKeyOfStep('fiveTabForm');
            }, 20);
        }
        if (this.keyOfStep === 'fiveTabForm') {
            this.end = true;
        }
    }

    receiveApproveTheRules(event: boolean) {
        if (event === true) {
            this.disableSave = false;
        } else if (event === false) {
            this.disableSave = true;
        }
    }
}
