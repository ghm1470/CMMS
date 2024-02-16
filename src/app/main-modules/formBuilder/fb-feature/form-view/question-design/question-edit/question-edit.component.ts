import {Component, Input, OnInit, Output, EventEmitter, Renderer2} from '@angular/core';
import {QuestionEmitterHelper} from '../../../../fb-model/helper/questionEmitterHelper';
import {LanguageService} from '../../../../shared/language-data-service/language.service';

@Component({
  selector: 'app-question-edit',
  templateUrl: './question-edit.component.html',
  styleUrls: ['./question-edit.component.css']
})
export class QuestionEditComponent implements OnInit {

  @Input() editingItem: QuestionEmitterHelper;
  // @Input() resetForm: boolean;
  @Output() onUpdate = new EventEmitter();
  data: any = null;

  constructor(private languageDataService: LanguageService,
              renderer: Renderer2) {
    languageDataService.renderer = renderer;
  }

  ngOnInit() {
    this.languageDataService.getLanguageData().subscribe(res => {
      this.data = res;
    });
  }

  UpdateItem(event: boolean) {
    this.onUpdate.emit('update complete');
  }

}
