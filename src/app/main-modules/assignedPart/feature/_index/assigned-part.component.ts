import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActionMode} from '@angular-boot/util';
import {UserDto} from '../../../user/model/dto/user-dto';
import {UserService} from '../../../user/endpoint/user.service';
import {takeUntilDestroyed} from '@angular-boot/core';

@Component({
  selector: 'app-assigned-part',
  templateUrl: './assigned-part.component.html',
  styleUrls: ['./assigned-part.component.scss']
})
export class AssignedPartComponent implements OnInit , OnDestroy {
  actionMode = ActionMode;
  userId: string;
  userList: UserDto.Create[] = [];
  constructor(private userService: UserService) { }

  ngOnInit() {
    // this.getAllUser();
  }
  getAllUser() {
    const parentUser = JSON.parse(sessionStorage.getItem('user'));
    this.userService.getAllUserForAssignedWorkOrder({userId: parentUser.id}).pipe(takeUntilDestroyed(this))
      .subscribe( (res: any) => {
        if (res && res.length) {
          this.userList = res;
          this.userId = this.userList[0].id;
        }
      });
  }

  ngOnDestroy(): void {
  }
}
