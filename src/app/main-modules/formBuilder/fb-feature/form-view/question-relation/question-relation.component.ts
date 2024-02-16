import {Component, Input, OnChanges, OnInit, Renderer2} from '@angular/core';
import {Form} from '../../../fb-model/form/form';
import {BasicElement} from '../../../fb-model/element/basic-element';
import {LanguageService} from '../../../shared/language-data-service/language.service';
import {CacheService} from '../../../shared/cache-service/cache.service';
import {CacheType} from '../../../shared/cache-service/cache-type.enum';
import {NumberTools} from '../../../shared/language-data-service/numberTools';
import {FORM} from '../../../fb-model/constants/storage-keys';
import {ImageStatus} from '../../../shared/model/ImageStatus';
import {Image} from '../../../shared/model/Image';


@Component({
    selector: 'app-question-relation',
    templateUrl: './question-relation.component.html',
    styleUrls: ['./question-relation.component.scss']
})
export class QuestionRelationComponent implements OnInit, OnChanges {

    form = new Form();
    list: Array<BasicElement> = [];
    questionTableShow: number;
    optionTableShow: number;
    data: any = null;
    MyImageStatus = ImageStatus;
    @Input() resetForm: boolean;
    image = new Image();

    constructor(private cacheService: CacheService,
                private languageDataService: LanguageService,
                renderer: Renderer2) {
        languageDataService.renderer = renderer;
    }

    ngOnInit() {
        this.languageDataService.getLanguageData().subscribe(res => {
            this.data = res;
        });
        this.cacheService.getItem(FORM, CacheType.SESSION_STORAGE).subscribe(res => {
            this.form = res;
        });
    }

    ngOnChanges() {
        if (this.resetForm) {
            // یعنی اینکه وارد این کامپوننت شده
            this.cacheService.getItem(FORM, CacheType.SESSION_STORAGE).subscribe(res => {
                this.form = res;
            });
        }
    }

    openTable(questionIndex, optionIndex) {
        if (this.optionTableShow === optionIndex) {
            this.optionTableShow = null;
            return;
        }
        this.questionTableShow = questionIndex;
        this.optionTableShow = optionIndex;
    }

    search(index, j, type: string) {
        // بین فرم های موجود سرچ می کند.
        let searchInput, subQuestionsTable, filter, tr, td0, i;
        if (type === 'check') {
            // فک کنم اینپوت جستجو رو به یکی از اینپوت های لیست پایینیش مرتبط می کند.
            searchInput = document.getElementById('searchInputCheck' + index + '-' + j);

            filter = searchInput.value.toUpperCase();

            subQuestionsTable = document.getElementById('subQuestionsTableCheck' + index + '-' + j);

        }
        if (type === 'radio') {

            searchInput = document.getElementById('searchInputRadio' + index + '-' + j);
            filter = searchInput.value.toUpperCase();
            subQuestionsTable = document.getElementById('subQuestionsTableRadio' + index + '-' + j);
        }
        // و اون tr مربوطه رو پیدا می کنه
        tr = subQuestionsTable.getElementsByTagName('tr');
        for (i = 0; i < tr.length; i++) {
            td0 = tr[i].getElementsByTagName('td')[1];

            if (td0) {
                if (td0.innerHTML.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = '';
                } else {
                    tr[i].style.display = 'none';
                }
            }
        }
    }


    subQuestionSelection(item, question, j) {// q:subQuestion , item:parent questionTitle , j: option index,
        // زیر سوال تخصیص می دهد

        item.optionList[j].subQuestionList.push(question);
        question.parentElement.elementId = item.id;
        question.parentElement.optionId = item.optionList[j].id;
        this.updateQuestions(item);
        this.updateQuestions(question);
    }

    findParent(basicQuestion, question) {
        if (basicQuestion.id === question.id) {
            return false;
        }
        if (question.parentElement.elementId !== '0') {
            return false;
        }
        if (basicQuestion.parentElement.elementId === '0') {
            return true;
        }
        if (basicQuestion.parentElement.elementId !== '0') {
            if (basicQuestion.parentElement.elementId === question.id) {
                return false;
            } else {
                let k;
                for (k = 0; k < this.form.elementList.length; k++) {
                    if (this.form.elementList[k].id === basicQuestion.parentElement.elementId) {
                        break;
                    }
                }
                return this.findParent(this.form.elementList[k], question);
            }
        }
    }

    deleteSubQuestion(subQuestion, basicQuestion, optionAndis) {

        for (let i = 0; i < basicQuestion.optionList[optionAndis].subQuestionList.length; i++) {
            if (basicQuestion.optionList[optionAndis].subQuestionList[i].id === subQuestion.id) {
                basicQuestion.optionList[optionAndis].subQuestionList.splice(i, 1);
                subQuestion.parentElement.elementId = '0';
                subQuestion.parentElement.optionId = '0';
                this.updateQuestions(subQuestion);
                this.updateQuestions(basicQuestion);
            }
        }
        // subQuestion.parentElement.elementId = '0';
        // subQuestion.parentElement.optionId = '0';
        // this.updateQuestions(subQuestion);
        // this.updateQuestions(basicQuestion);
    }

    updateQuestions(item) {
        for (let i = 0; i < this.form.elementList.length; i++) {
            if (this.form.elementList[i].id === item.id) {
                this.form.elementList[i] = item;
                this.saveOnStorage();
                break;
            }
        }
    }

    EnFaSwitch(str) {
        // چرا به این شکل ؟؟
        // فک کنم شمارش اول عنوان ها باشه
        let value: string;
        this.languageDataService.getSelectedLanguage().subscribe(res => {
            value = NumberTools.EnFaSowich(str, res);
        });
        return value;
    }

    saveOnStorage() {
        this.cacheService.setItem(FORM, this.form, CacheType.SESSION_STORAGE);
    }

    saveForm(frm) {
        // this.dataService.setForm(form);
    }
}
