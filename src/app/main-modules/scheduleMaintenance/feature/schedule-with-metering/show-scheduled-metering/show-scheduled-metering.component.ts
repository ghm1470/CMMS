import {Component, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {ModalSize} from '@angular-boot/util';
import {DateViewMode} from '../../../../../shared/tools/date-view-mode.enum';
import {ScheduleMaintenanceDto} from '../../../model/dto/scheduleMaintenanceDto';
import NextLaunchMetering = ScheduleMaintenanceDto.NextLaunchMetering;
import {isNullOrUndefined} from 'util';
import {takeUntilDestroyed} from '@angular-boot/core';
import {ScheduleMaintenanceService} from '../../../endpoint/schedule-maintenance.service';
import {ActionMode} from '../../../../formBuilder/fb-model/enumeration/enum/ActionMode';

@Component({
  selector: 'app-show-scheduled-metering',
  templateUrl: './show-scheduled-metering.component.html',
  styleUrls: ['./show-scheduled-metering.component.scss']
})
export class ShowScheduledMeteringComponent implements OnInit, OnDestroy, OnChanges {
  @Input() scheduleWithTimeAndMetering = new ScheduleMaintenanceDto.ScheduledMeteringCycleDTO();
  @Input() view;
  @Input() mode;
  @Input() readService;
  MyModalSize = ModalSize;
  dateViewMode = DateViewMode;
  NextLaunchMeteringLis: any[] = [];


  constructor(public scheduleMaintenanceService: ScheduleMaintenanceService) {
  }

  ngOnInit() {
  }
  ngOnChanges(): void {
    if (this.readService && this.scheduleWithTimeAndMetering) {
      this.getListSelf();
    }
  }
  getListSelf() {
    if (!isNullOrUndefined(this.scheduleWithTimeAndMetering.per)) {
      this.scheduleMaintenanceService.getAllFutureMeteringOfScheduleMaintenance({
        per: this.scheduleWithTimeAndMetering.per,
        startDistance: this.scheduleWithTimeAndMetering.startDistance,
        endDistance: this.scheduleWithTimeAndMetering.endDistance
      }).pipe(takeUntilDestroyed(this)).subscribe((res) => {
        this.NextLaunchMeteringLis = res;
      });
    }
  }

  chooseSelectedItemForEdit(item: NextLaunchMetering) {
    // this.router.navigate(['action'], {
    //   queryParams: {mode: ActionMode.EDIT, inventoryId: item.inventoryId},
    //   relativeTo: this.activatedRoute
    // });
  }

  chooseSelectedItemForView(item: NextLaunchMetering) {
    // this.router.navigate([item.inventoryId, ActionMode.VIEW], {
    //   relativeTo: this.activatedRoute
    // });
  }

  deleteItem(item: NextLaunchMetering) {
    // alert(1)
    // this.inventoryLocation.inventoryLocation = item.inventoryLocation;
    // this.inventoryLocation.partId = item.partId;
    // this.inventoryLocation.warehouse = item.warehouse;
    // this.inventoryLocation.corridor = item.corridor;
    // this.inventoryLocation.row = item.row;
    //
    // // if (confirm('از حذف این '))
    // this.inventoryService.deleteInventory(this.inventoryLocation)
    //   .pipe(takeUntilDestroyed(this)).subscribe((res) => {
    //   if (res === true) {
    //     this.NextLaunchMeteringLis.itemPage.content = this.NextLaunchMeteringLis.itemPage.content
    //       .filter((e) => {
    //         return e.inventoryId !== item.inventoryId;
    //       });
    //     this.processPage();
    //   }
    // });
  }

  ngOnDestroy(): void {
  }




}


