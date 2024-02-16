import {Component, Input, OnInit, EventEmitter, Output, AfterViewInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ElementType} from '../../../fb-model/enumeration/element-type';
import {Matrix} from '../../../fb-model/element/matrix';
import {FormData, MatrixAnswer, QuestionAnswer} from '../../../fb-model/form/form-data';
import {UploadService} from '../../../shared/services/upload-service/upload.service';
// import {IStarRatingOnRatingChangeEven} from 'angular-star-rating/dist/src/star-rating-struct';
import {ImageStatus} from '../../../shared/model/ImageStatus';
import {Toolkit} from '../../../shared/utility/toolkit';
import {FormService} from '../../../fb-service/form.service';
import {Toolkit2} from "@angular-boot/util";
import {MyPattern} from "../../../../../shared/shared/tools/myPattern";
import {TimeModel} from "../../../fb-model/element/time";

declare var $: any;

@Component({
    selector: 'app-sub-question-display',
    templateUrl: './sub-question-display.component.html',
    styleUrls: ['./sub-question-display.component.css']
})
export class SubQuestionDisplayComponent implements OnInit, AfterViewInit {

    @Input() finalLevel: any;
    @Input() formStatus: any;
    @Input() isView: any;
    @Input() enableItems: any;

    @Input() subList: Array<any>;
    @Input() list: Array<any>;
    @Input() formData: FormData;
    @Output() onAnswer = new EventEmitter();
    subIndex: number;
    formComplete: FormGroup;
    formDataInternal: FormData;
    check: Array<any> = [];
    combo: Array<any> = [];
    slider: Array<any> = [];
    matrix: Array<any> = [];
    public mask = [/\d/, /\d/, ':', /\d/, /\d/];
    url = '';
    MyImageStatus = ImageStatus;
    image = new Image();
    MyToolkit = Toolkit;
    myPattern = MyPattern;

    ngOnInit() {
        this.subIndex = this.list.findIndex(e => e.id === this.subList[0].id)
        console.log('this.subList', this.subList)
        console.log('this.list', this.list)
        console.log('this.formData', this.formData)
        for (let i = 0; i < this.subList.length; i++) {
            const index = this.findIndex(this.subList[i]);
            this.subList[i].index = index;
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
                public formService: FormService,
                private uploadService: UploadService) {
        this.formComplete = fb.group({
            textField: [null, Validators.required],
            email: [null, Validators.required],
            number: [null, Validators.required],
            password: [null, Validators.required],
            radio: [null, Validators.required],
            textArea: [null, Validators.required],
            combo: [null, Validators.required],
            checkBox: [null, Validators.required],
            content: [null, Validators.required],
            date: [null, Validators.required],
            time: [null, Validators.required],
            slider: [null, Validators.required]
        });
        this.url = this.formService._ServiceConfig.getUrl();
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

    findIndex(item) {
        let k;
        for (k = 0; k < this.list.length; k++) {
            if (this.list[k].id === item.id) {
                break;
            }
        }
        return k;
    }

    onChangeTextFieldRelated(event, item) {
        // debugger;
        const answerTextField = new QuestionAnswer();
        answerTextField.questionId = item.id;
        answerTextField.questionElementType = item.elementType;
        answerTextField.answerIdList[0] = event;
        this.formDataInternal.answerList[item.index] = answerTextField;
        setTimeout(e => {
            // $('#textField' + item.id).val().trigger('change');
            this.onAnswer.emit({index: item.index, returnAnswer: answerTextField});
            console.log('answerTextField', answerTextField);
            console.log('this.formDataInternal.answerList', this.formDataInternal.answerList);

        }, 100);
    }

    onChangeRadioRelated(event: string, item) {
        console.log('change radio');
        console.log('item', item);
        const answerRadio = new QuestionAnswer();
        answerRadio.questionId = item.id;
        answerRadio.questionElementType = item.elementType;
        answerRadio.answerIdList[0] = event;
        this.formDataInternal.answerList[item.index] = answerRadio;
        this.onAnswer.emit({index: item.index, returnAnswer: answerRadio});
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

    onChangeComboMultiRelated(item, i) {
        const answerCombo = new QuestionAnswer();
        answerCombo.questionId = item.id;
        answerCombo.questionElementType = item.elementType;
        answerCombo.answerIdList = this.combo[i];
        this.formDataInternal.answerList[item.index] = answerCombo;
        this.onAnswer.emit({index: item.index, returnAnswer: answerCombo});
    }

    onChangeComboSingleRelated(value, item, i) {
        const answerCombo = new QuestionAnswer();
        answerCombo.questionId = item.id;
        answerCombo.questionElementType = item.elementType;
        this.combo[i] = value;
        answerCombo.answerIdList[0] = value;
        this.formDataInternal.answerList[item.index] = answerCombo;
        this.onAnswer.emit({index: item.index, returnAnswer: answerCombo});
    }

    onChangeTextAreaRelated(event: string, item) {
        const answerTextArea = new QuestionAnswer();
        answerTextArea.questionId = item.id;
        answerTextArea.questionElementType = item.elementType;
        answerTextArea.answerIdList[0] = event;
        this.formDataInternal.answerList[item.index] = answerTextArea;
        this.onAnswer.emit({index: item.index, returnAnswer: answerTextArea});
    }

    onChangeDateRelated(value, item, index) {
        const answerDate = new QuestionAnswer();
        answerDate.questionId = item.id;
        answerDate.questionElementType = item.elementType;
        const splitDate = value.split('/');
        const date = new Date();
        // date.year = splitDate[0];
        // date.month = splitDate[1];
        // date.day = splitDate[2];
        answerDate.answerIdList[0] = date;
        this.formDataInternal.answerList[index] = answerDate;
        this.onAnswer.emit({index, returnAnswer: answerDate});
    }

    onChangeTimeRelated(value, item) {

        const answerTime = new QuestionAnswer();
        answerTime.questionId = item.id;
        answerTime.questionElementType = item.elementType;
        const splitTime = value.split(':');
        const getTime = new TimeModel();
        getTime.hour = parseInt(splitTime[0]);
        getTime.minute = parseInt(splitTime[1]);
        answerTime.answerIdList[0] = getTime;
        this.formDataInternal.answerList[item.index] = answerTime;
        this.formData.answerList[item.index] = answerTime;
        this.onAnswer.emit({index: item.index, returnAnswer: answerTime});
    }

    onChangeSliderRelated(item, i) {
        const answerNumerical = new QuestionAnswer();
        const k = this.findIndex(item);
        answerNumerical.questionId = item.id;
        answerNumerical.questionElementType = item.elementType;
        answerNumerical.answerIdList[0] = this.slider[i];
        this.formDataInternal.answerList[k] = answerNumerical;
        this.onAnswer.emit({index: k, returnAnswer: answerNumerical});
    }

    // onChangeStarRatingRelated = ($event: IStarRatingOnRatingChangeEven, item) => {
    //   const answerStar = new QuestionAnswer();
    //   answerStar.questionId = item.id;
    //   answerStar.questionElementType = item.elementType;
    //   answerStar.answerIdList[0] = $event.rating;
    //   this.formDataInternal.answerList[item.index] = answerStar;
    //   this.onAnswer.emit({index: item.index, returnAnswer: answerStar});
    // }

    onChangeMatrixRelated(value, item, itemIndex, qIndex, multiSelect, question) {
        const answerMatrix = new QuestionAnswer();
        answerMatrix.questionId = item.id;
        answerMatrix.questionElementType = item.elementType;
        let array: Array<any> = [];
        for (let j = 0; j < item.matrixQuestionList.length; j++) {
            array[j] = new MatrixAnswer();
        }
        array = this.matrix[itemIndex];
        let array2: Array<string> = [];
        array2 = array[qIndex].matrixValueList;
        if (multiSelect === true) {
            array[qIndex].question = question;
            const index = array2.indexOf(value);
            // Is currently selected
            if (index > -1) {
                // let array2 = array[qIndex];
                array2.splice(index, 1);
                array[qIndex].matrixValues = array2;

            } else {
                array2.push(value);
                array[qIndex].matrixValues = array2;
            }
        } else {
            array[qIndex].question = question;
            array[qIndex].matrixValueList[0] = value;
        }
        this.matrix[itemIndex] = array;
        answerMatrix.answerIdList = this.matrix[itemIndex];
        this.formDataInternal.answerList[itemIndex] = answerMatrix;
        this.onAnswer.emit({index: itemIndex, returnAnswer: answerMatrix});
    }

    setAttachments(event, item, index) {
        const answerAttach = new QuestionAnswer();
        answerAttach.questionId = item.id;
        answerAttach.questionElementType = item.elementType;
        answerAttach.answerIdList = event;
        this.formDataInternal.answerList[index] = answerAttach;
        this.onAnswer.emit({index, returnAnswer: answerAttach});
    }

    setImage(event, item, index) {
        const answerImage = new QuestionAnswer();
        answerImage.questionId = item.id;
        answerImage.questionElementType = item.elementType;
        console.log(item.fileCountLimitation);
        if (item.fileCountLimitation === 1) {
            answerImage.answerIdList[0] = event;
        } else {
            answerImage.answerIdList = event;
        }
        this.formDataInternal.answerList[index] = answerImage;
        this.onAnswer.emit({index, returnAnswer: answerImage});
    }

    fillAnswer(event) {
        this.onAnswer.emit(event);
    }

    hideCollapse(questionId, option, collapseId) {
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
                $('#' + collapseId).addClass('show');
                return true;
            }
            if (found === false) {
                return false;
            }
        } else {
            return false;
        }
    }

    changeCheck() {
        // alert('change');
    }

    getChecked(item, ch) {

        // console.log('-----------------------------------------------------------')
        // console.log('item', item)
        // console.log('item.index', item.index)
        // console.log('ch', ch)
        // console.log('this.formData', this.formData)
        // console.log('-----------------------------------------------------------')
        if (this.formData.answerList[item.index]) {
            return this.formData.answerList[item.index].answerIdList.some(e => e === ch.id);
        }

    }

    onChangeCheck(event, id, index, item, collapseId) {

        if (!this.formData.answerList[index]) {
            this.formData.answerList[index] = new QuestionAnswer();
            this.formData.answerList[index].questionId = item.id;
            this.formData.answerList[index].questionElementType = item.elementType;
        }
        // if (!isNullOrUndefined(this.formData.answerList[index])) {
        //     this.incomingFormData = JSON.parse(JSON.stringify(this.formData));
        //     const h = this.incomingFormData.answerList.length;
        //     for (let i = 0; i < h; i++) {
        //         this.answer = new QuestionAnswer();
        //         this.answer = JSON.parse(JSON.stringify(this.formData.answerList[i]));
        //         this.incomingFormData.answerList[i] = JSON.parse(JSON.stringify(this.answer));
        //     }
        // }
        if (event) {
            if (!this.formData.answerList[index].answerIdList.some(e => e === id)) {
                this.formData.answerList[index].answerIdList.push(id);
                $('#' + collapseId).addClass('show');

            }
        } else {
            const index2 = this.formData.answerList[index].answerIdList.findIndex(e => e === id);
            if (index2 !== -1) {
                this.formData.answerList[index].answerIdList.splice(index2, 1);
                $('#' + collapseId).removeClass('show');

            }
        }
        console.log(event);
        console.log(this.formData.answerList);
        console.log(id);

    }

    ngAfterViewInit(): void {
    }

}
