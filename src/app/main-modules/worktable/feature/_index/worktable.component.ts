import {Component, OnInit} from '@angular/core';
import {ActionMode} from '@angular-boot/util';

@Component({
  selector: 'app-worktable',
  templateUrl: './worktable.component.html',
  styleUrls: ['./worktable.component.scss']
})
export class WorktableComponent implements OnInit {

  actionMode = ActionMode;
  mode: ActionMode = ActionMode.ADD;
  pillsHistory = false;
  openSearchBox = false;
  active = true;
  history = false;

  ngOnInit() {
  }



  changeMode(item) {
    // نماد سرچ را برای هر قسمت یکتا میکند
    if (item === 'active') {
      this.history = false;
      this.active = true;
    }
    if (item === 'active') {
      this.pillsHistory = true;
      this.history = true;
      this.active = false;
    }
  }
}
