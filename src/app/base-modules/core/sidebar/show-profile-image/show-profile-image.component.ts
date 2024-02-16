import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {ModalSize} from "@angular-boot/util";
import {UserDto} from "../../../../main-modules/user/model/dto/user-dto";

@Component({
    selector: 'app-show-profile-image',
    templateUrl: './show-profile-image.component.html',
    styleUrls: ['./show-profile-image.component.scss']
})
export class ShowProfileImageComponent implements OnInit {
    MyModalSize = ModalSize;
    @Input() user: UserDto.Create;

    constructor() {
    }

    ngOnInit(): void {
    }

}
