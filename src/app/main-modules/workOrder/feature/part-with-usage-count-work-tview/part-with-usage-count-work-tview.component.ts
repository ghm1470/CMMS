import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {PartWithUsageCount} from '../part-with-usage-count/model/PartWithUsageCount';
import {ActionMode, isNullOrUndefined} from '@angular-boot/util';
import {MyPattern} from '../../../../shared/shared/tools/myPattern';
import {PartDto} from '../../../part/model/dto/part';
import {ActivatedRoute, Router} from '@angular/router';
import {PartService} from '../../../part/endpoint/part.service';
import {WorkOrderRepositoryService} from '../../endpoint/work-order-repository.service';
import {SendInformationNumberOfTabs} from '../../../worktable/feature/show-the-trend-here/show-the-form-of-previous-steps/show-the-form-of-previous-steps.component';

@Component({
  selector: 'app-part-with-usage-count-work-tview',
  templateUrl: './part-with-usage-count-work-tview.component.html',
  styleUrls: ['./part-with-usage-count-work-tview.component.scss']
})
export class PartWithUsageCountWorkTViewComponent implements OnInit, OnDestroy, OnChanges {

  @Input() workOrderId: string;
  @Input() partWithUsageCountList: PartWithUsageCount[] = [];
  @Output() nextCarousel = new EventEmitter<boolean>();
  @Input() sendInformationNumberOfTabs = new SendInformationNumberOfTabs();
  partWithUsageCount: PartWithUsageCount;
  actionMode = ActionMode;
  myPattern = MyPattern;
  partList: PartDto.Create[] = [];

  constructor(public activatedRoute: ActivatedRoute,
              public partService: PartService,
              public workOrderRepositoryService: WorkOrderRepositoryService,
              public router: Router) {
    this.partWithUsageCount = new PartWithUsageCount(this.workOrderId);
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
  }

  nextOrPrev(item) {
    if (item === 'next') {
      this.nextCarousel.emit(true);
    }
    if (item === 'prev') {
      this.nextCarousel.emit(false);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.sendInformationNumberOfTabs) {
    }
    if (changes.partWithUsageCountList) {
      if (isNullOrUndefined(this.partWithUsageCountList)) {
        this.partWithUsageCountList = [];
      }
    }
  }
}



