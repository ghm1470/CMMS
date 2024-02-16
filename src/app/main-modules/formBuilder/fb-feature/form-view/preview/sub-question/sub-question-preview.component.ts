import {Component, Input, OnInit, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ElementType} from '../../../../fb-model/enumeration/element-type';
import {Matrix} from '../../../../fb-model/element/matrix';
import {FormData, MatrixAnswer, QuestionAnswer} from '../../../../fb-model/form/form-data';
import {UploadService} from '../../../../shared/services/upload-service/upload.service';
import {ImageStatus} from '../../../../shared/model/ImageStatus';
import {Image} from '../../../../shared/model/Image';


declare var $: any;

@Component({
    selector: 'app-sub-question-preview',
    templateUrl: './sub-question-preview.component.html',
    styleUrls: ['./sub-question-preview.component.css']
})
export class SubQuestionPreviewComponent implements OnInit {

    @Input() subList: Array<any>;
    @Input() list: Array<any>;
    @Input() formData: FormData;
    @Output() onAnswer = new EventEmitter();
    formComplete: FormGroup;
    formDataInternal: FormData;
    check: Array<any> = [];
    combo: Array<any> = [];
    slider: Array<any> = [];
    matrix: Array<any> = [];
    public mask = [/\d/, /\d/, ':', /\d/, /\d/];
    MyImageStatus = ImageStatus;
    image = new Image();
    subIndex: number;

    ngOnInit() {
        this.subIndex = this.list.findIndex(s => s.id === this.subList[0].id)
        for (let i = 0; i < this.subList.length; i++) {
            this.check[i] = [];
            this.slider[i] = '';
            if (this.list[i].elementType === ElementType.MATRIX) {
                let matrixElement = new Matrix();
                matrixElement = this.list[i] as Matrix;
                const matrixValues2: Array<any> = [];
                for (let j = 0; j < matrixElement.matrixQuestionList.length; j++) {
                    matrixValues2[j] = new MatrixAnswer();
                }
                this.matrix[i] = matrixValues2;
            }
        }
        this.formDataInternal = this.formData;
    }

    constructor(fb: FormBuilder,
                private uploadService: UploadService) {
        this.formComplete = fb.group({
            textField: [null, Validators.required],
            radio: [null, Validators.required],
            textArea: [null, Validators.required],
            combo: [null, Validators.required],
            checkBox: [null, Validators.required],
            content: [null, Validators.required],
            date: [null, Validators.required],
            time: [null, Validators.required],
            slider: [null, Validators.required]
        });
    }

    showDate(i) {
        $(document).ready(function () {
            $('#date' + i).azPersianDateTimePicker({
                Placement: 'left',
                Trigger: 'click',
                EnableTimePicker: false,
                TargetSelector: '#inputDate' + i,
                GroupId: '',
                ToDate: false,
                FromDate: false,
                DisableBeforeToday: false,
                Disabled: false,
                Format: 'yyyy/MM/dd',
                IsGregorian: false,

            });
        });
    }

    onChangeCheckRelated(event: string, item, i) {
        const answerCheck = new QuestionAnswer();
        answerCheck.questionId = item.id;
        answerCheck.questionElementType = item.elementType;
        const k = this.findIndex(item);
        const index = this.check[i].indexOf(event);
        // Is currently selected
        if (index > -1) {
            this.check[i].splice(index, 1);
        } else {
            this.check[i].push(event);
        }
        answerCheck.answerIdList = this.check[i];
        this.formDataInternal.answerList[k] = answerCheck;
        this.onAnswer.emit({index: k, returnAnswer: answerCheck});
    }

    onChangeRadioRelated(event: string, item) {
        const answerRadio = new QuestionAnswer();
        const k = this.findIndex(item);
        answerRadio.questionId = item.id;
        answerRadio.questionElementType = item.elementType;
        answerRadio.answerIdList[0] = event;
        this.formDataInternal.answerList[k] = answerRadio;
        this.onAnswer.emit({index: k, returnAnswer: answerRadio});
    }

    findIndex(item) {
        let k;
        for (k = 0; k < this.list.length; k++) {
            if (this.list[k].id === item.id) {
                break;
            }
        }
        return k;
    }

    hideCollapse(questionId, option) {
        let k;
        let found = false;
        for (k = 0; k < this.list.length; k++) {
            if (this.list[k].id === questionId) {
                break;
            }
        }
        if (this.formDataInternal.answerList[k] != null) {
            for (const item of this.formDataInternal.answerList[k].answerIdList) {
                if (item === option.id) {
                    found = true;
                    break;
                } else {
                    found = false;
                }
            }
            if (found === true) {
                return true;
            }
            if (found === false) {
                return false;
            }
        } else {
            return false;
        }
    }

}
