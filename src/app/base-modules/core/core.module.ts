import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CoreRoutingModule} from './core-routing.module';
import {HeaderComponent} from './header/header.component';
import {FooterComponent} from './footer/footer.component';
import {SidebarComponent} from './sidebar/sidebar.component';
import {VerticalMenuComponent} from './vertical-menu/vertical-menu.component';
import {Header2Component} from './header2/header2.component';
import {NavIconComponent} from './nav-icon/nav-icon.component';
import {AuthService} from '../auth/endpoint/auth.service';
import {NgScrollbarModule} from 'ngx-scrollbar';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {NbWidgetsModule} from '@angular-boot/widgets';
import {NbCommonModule} from '@angular-boot/common';
import {UtilModule} from '@angular-boot/util';
import {NbValidationModule} from '@angular-boot/validation';
import {NgSelectModule} from '@ng-select/ng-select';
import {ActivityService} from '../../main-modules/activity/service/activity.service';
import {ShowProfileImageComponent} from './sidebar/show-profile-image/show-profile-image.component';


@NgModule({
    declarations: [HeaderComponent,
        FooterComponent,
        SidebarComponent,
        VerticalMenuComponent,
        Header2Component,
        NavIconComponent,
        ShowProfileImageComponent],
    imports: [
        CommonModule,
        CoreRoutingModule,
        NgScrollbarModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        NbWidgetsModule,
        NbCommonModule,
        UtilModule,
        NbValidationModule,
        NgSelectModule
    ],
    exports: [HeaderComponent, Header2Component, FooterComponent, SidebarComponent, VerticalMenuComponent],
    providers: [AuthService]
})
export class CoreModule {
}
