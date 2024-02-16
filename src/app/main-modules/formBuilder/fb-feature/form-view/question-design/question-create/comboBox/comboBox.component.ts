/**
 * Created by Zar on 1/29/2017.
 */
import {Component, Input, Output, EventEmitter, Renderer2, OnChanges, } from '@angular/core';
import {CacheService} from '../../../../../shared/cache-service/cache.service';
import {CacheType} from '../../../../../shared/cache-service/cache-type.enum';
import {Form} from '../../../../../fb-model/form/form';
import {LanguageService} from '../../../../../shared/language-data-service/language.service';
import {ImageStatus} from '../../../../../shared/model/ImageStatus';

@Component({
  selector: 'ComboBoxComponent',
  templateUrl: './comboBox.component.html'
})

export class ComboBoxComponent implements OnChanges {

  @Input() index: number;
  @Output() onDelete = new EventEmitter();
  @Output() onUpdate = new EventEmitter();
  @Output() onDuplicate = new EventEmitter();
  @Output() onUpElement = new EventEmitter();
  @Output() onDownElement = new EventEmitter();
  form = new Form();
  item: any;
  listLength: number;
  data: any = null;
  MyImageStatus = ImageStatus;

  constructor(private cacheService: CacheService,
              private languageDataService: LanguageService,
              renderer: Renderer2) {
    languageDataService.renderer = renderer;
  }

  ngOnChanges() {
    this.languageDataService.getLanguageData().subscribe(res => {
      this.data = res;
    });
    this.cacheService.getItem('form', CacheType.SESSION_STORAGE).subscribe(res => {
      this.form = res;
      this.item = null;
      this.item = this.form.elementList[this.index];
      this.listLength = this.form.elementList.length;
    });
  }

  edit() {
    this.onUpdate.emit(this.index);
  }

  delete() {
    this.onDelete.emit(this.index);
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
