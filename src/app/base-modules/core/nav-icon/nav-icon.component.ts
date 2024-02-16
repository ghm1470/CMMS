import {Component, OnInit} from '@angular/core';

declare var $: any;

@Component({
    selector: 'app-nav-icon',
    templateUrl: './nav-icon.component.html',
    styleUrls: ['./nav-icon.component.scss']
})
export class NavIconComponent implements OnInit {

    constructor() {
    }

    ngOnInit() {
    }

    openCloseNav() {
        if ($('#sidebar').hasClass('active')) {
            $('#sidebar').removeClass('active');
        } else {
            $('#sidebar').addClass('active');
                const menuitem1 = sessionStorage.getItem('menuitem1');
                if (menuitem1) {
                    // this.menuitem1 = menuitem1;
                    setTimeout(e => {
                        $('#' + menuitem1).click();
                    }, 500);
                    const menuitem2 = sessionStorage.getItem('menuitem2');
                    if (menuitem2) {
                        // this.menuitem2 = menuitem2;
                        setTimeout(e => {
                            $('#' + menuitem2).click();
                        }, 100);
                        const menuitem3 = sessionStorage.getItem('menuitem3');
                        if (menuitem3) {
                            // this.menuitem3 = menuitem3;
                            setTimeout(e => {
                                $('#' + menuitem3).click();
                            }, 100);
                        }
                    }
                }

        }
    }
}
