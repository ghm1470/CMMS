import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {ActionMode} from '@angular-boot/util';
import {UserDto} from '../../../user/model/dto/user-dto';
import {UserService} from '../../../user/endpoint/user.service';
import {takeUntilDestroyed} from '@angular-boot/core';
declare  var $: any;
@Component({
  selector: 'app-assigned-asset',
  templateUrl: './assigned-asset.component.html',
  styleUrls: ['./assigned-asset.component.scss']
})
export class AssignedAssetComponent implements OnInit , OnDestroy {
  actionMode = ActionMode;
  userId: string;
  userList: UserDto.Create[] = [];
  constructor(private userService: UserService) { }

  ngOnInit() {
    this.getAllUser();
  }
  getAllUser() {
    const parentUser = JSON.parse(sessionStorage.getItem('user'));
    this.userService.getAllSubUsersOfUserByUserId({userId: parentUser.id}).pipe(takeUntilDestroyed(this))
      .subscribe( (res: UserDto.Create[]) => {

        if (res && res.length) {
      this.userList = res;
      parentUser.name = 'من';
      parentUser.family = '';
      this.userList.push(parentUser);
    } else  if (!res || res.length === 0) {
      parentUser.name = 'من';
      parentUser.family = '';
      this.userList[0] = parentUser;
    }
    this.userId = parentUser.id;
  });
  }

  ngOnDestroy(): void {
  }
}
