import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Form} from '../../model/form';
import {FormService} from '../../service/form.service';
import {ActionMode} from '@angular-boot/util';

@Component({
    selector: 'app-upsert-form',
    templateUrl: './upsert-form.component.html',
    styleUrls: ['./upsert-form.component.scss']
})
export class UpsertFormComponent implements OnInit {
    loadingGetOne = false;
    entityId: string;
    form = new Form();
    formCopy = new Form();
    mode: ActionMode;
    actionMode = ActionMode;

    constructor(public router: Router,
                private entityService: FormService,
                private  activatedRoute: ActivatedRoute) {
        this.entityId = this.activatedRoute.snapshot.queryParams.entityId;
        this.mode = this.activatedRoute.snapshot.queryParams.mode;

    }

    ngOnInit(): void {
        if (this.entityId) {
            this.getOne();
        }
    }


    getOne() {
        this.entityService.getOne({id: this.entityId}).subscribe((res: Form) => {
            this.form = res;
            this.formCopy = JSON.parse(JSON.stringify(res));

        });
    }


}
