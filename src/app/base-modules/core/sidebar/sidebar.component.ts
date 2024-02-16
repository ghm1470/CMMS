import {Component, Input, OnInit} from '@angular/core';
import {UserDto} from '../../../main-modules/user/model/dto/user-dto';
import {UserType} from "../../../main-modules/securityManagement/model/userType";
import {ModalSize} from "@angular-boot/util";
import {ModalUtil} from "@angular-boot/widgets";

declare var $: any;

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss', './sidebar.component.rtl.scss']
})
export class SidebarComponent implements OnInit {

    @Input() user: UserDto.Create;
    @Input() userType: UserType;

    constructor() {
    }

    ngOnInit() {
    }

    editProfile() {

    }

    openCloseNav() {
        if ($('#sidebar').hasClass('active')) {
            $('#sidebar').removeClass('active');
        } else {
            $('#sidebar').addClass('active');

        }
    }

    selectedImageForShow() {
        setTimeout(e => {
            ModalUtil.showModal('showImageModal');
        });
    }
}
