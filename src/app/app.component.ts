import {Component, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router} from "@angular/router";

declare var $: any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    htmlForm: FormGroup;
    n = '۲۳۴۲۳۴۳۴';
    msgInput: string = 'lorem ipsum';
    loading: boolean;

    constructor(private router: Router) {
        this.router.events.subscribe((event) => {
            switch (true) {
                case event instanceof NavigationStart: {
                    this.loading = true;
                    break;
                }

                case event instanceof NavigationEnd:
                case event instanceof NavigationCancel:
                case event instanceof NavigationError: {
                    this.loading = false;
                    break;
                }
                default: {
                    break;
                }
            }
        });
    }


    ngOnInit(): void {
        // const x = [1, 2, 3, 4, 5];
        // x.map(e => {
        //     const res = x.some(e2 => e2 + e === 10)
        //     console.log(res);
        // })
        // const user = {
        //     fname: 'ghasem',
        //     lname: 'mohammadi'
        // };
        // console.log(user['fname'])


    }


    test() {


    }

    // copyTextToClipboard(text) {
    //     const elem = document.createElement('textarea');
    //     elem.value = text;
    //     document.body.appendChild(elem);
    //     elem.select();
    //     document.execCommand('copy');
    //     document.body.removeChild(elem);
    // }


// @HostBinding('style.backgroundColor') backgroundColor: string = 'transparent';
//
// constructor(private elRef: ElementRef, private renderer: Renderer2) {
// }

// @HostListener('mouseenter') mouseover(eventData: Event) {
//     // this.renderer.setStyle(this.elRef.nativeElement, 'background-color', 'orange')
//     this.backgroundColor = 'orange'
// }
//
// @HostListener('mouseleave') mouseleave(eventData: Event) {
//     // this.renderer.setStyle(this.elRef.nativeElement, 'background-color', 'transparent')
//     this.backgroundColor = 'transparent'
//
// }
}


// ng s --port 5050
