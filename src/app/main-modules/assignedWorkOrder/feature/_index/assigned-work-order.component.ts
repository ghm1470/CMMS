import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActionMode} from '@angular-boot/util';
import {UserDto} from '../../../user/model/dto/user-dto';
import {UserService} from '../../../user/endpoint/user.service';
import {takeUntilDestroyed} from '@angular-boot/core';


@Component({
  selector: 'app-assigned-work-order',
  templateUrl: './assigned-work-order.component.html',
  styleUrls: ['./assigned-work-order.component.scss']
})
export class AssignedWorkOrderComponent implements OnInit, OnDestroy {
  actionMode = ActionMode;
  userId: string;
  userList: UserDto.Create[] = [];
  dontUser = false;
  constructor(private userService: UserService) { }

  ngOnInit() {
    this.getAllUser();
  }
  getAllUser() {
    const parentUser: UserDto.Create  = JSON.parse(sessionStorage.getItem('user'));
    this.userService.getAllUserForAssignedWorkOrder({userId: parentUser.id}).pipe(takeUntilDestroyed(this))
    .subscribe( (res: UserDto.Create[]) => {
      if (res && res.length) {
        this.userList = res;
        // parentUser.name = 'من';
        // parentUser.family = '';
        // this.userList.push(parentUser);
        this.userId =  this.userList[0].id;
      } else  if (!res || res.length === 0) {
        this.dontUser = true;
        // parentUser.name = 'من';
        // parentUser.family = '';
        // this.userList[0] = parentUser;
      }
      // this.userId = parentUser.id;
    });

  }

  ngOnDestroy(): void {
  }

}
