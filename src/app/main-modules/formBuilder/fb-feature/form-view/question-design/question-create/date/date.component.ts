import {Component, Input, Output, EventEmitter, Renderer2, OnChanges} from '@angular/core';
import {Form} from '../../../../../fb-model/form/form';
import {CacheService} from '../../../../../shared/cache-service/cache.service';
import {LanguageService} from '../../../../../shared/language-data-service/language.service';
import {CacheType} from '../../../../../shared/cache-service/cache-type.enum';
import {FORM} from '../../../../../fb-model/constants/storage-keys';
import {ImageStatus} from '../../../../../shared/model/ImageStatus';

@Component({
  selector: 'DateComponent',
  templateUrl: './date.component.html',
})
export class DateComponent implements OnChanges {

  @Input() index: number;
  @Output() onDelete = new EventEmitter();
  @Output() onUpdate = new EventEmitter();
  @Output() onDuplicate = new EventEmitter();
  @Output() onUpElement = new EventEmitter();
  @Output() onDownElement = new EventEmitter();
  form = new Form();
  item: any;
  listLength: number;
  data: any;
  MyImageStatus = ImageStatus;

  constructor(private cacheService: CacheService,
              private languageDataService: LanguageService,
              renderer: Renderer2) {
    languageDataService.renderer = renderer;
  }

  ngOnChanges(): void {
    this.languageDataService.getLanguageData().subscribe(res => {
      this.data = res;
    });
    this.cacheService.getItem(FORM, CacheType.SESSION_STORAGE).subscribe(res => {
      this.form = res;
      this.item = null;
      this.item = this.form.elementList[this.index];
      this.listLength = this.form.elementList.length;
    });
  }

  delete() {
    this.onDelete.emit(this.index);
  }

  edit() {
    this.onUpdate.emit(this.index);
  }

  duplicate() {
    this.onDuplicate.emit(this.index);
  }

  upElement() {
    this.onUpElement.emit(this.index);
  }

  downElement() {
    this.onDownElement.emit(this.index);
  }

}
