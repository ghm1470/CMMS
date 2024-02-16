import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {FormCategory} from '../../main-modules/form-builder2/model/form-category';
import {WorkTableDto} from '../../main-modules/worktable/model/workTable';
import {Person} from '../../main-modules/formBuilder/fb-model/person/Person';

@Injectable({
    providedIn: 'root'
})
export class DataService {


    constructor() {
    }


    // For Id Start
    private idValueSource = new BehaviorSubject<string>(null);
    currentIdValue = this.idValueSource.asObservable();
    // For Id End

    private addCategorySource = new BehaviorSubject<FormCategory>(null);
    currentAddCategoryValue = this.addCategorySource.asObservable();

    private addPersonSource = new BehaviorSubject<Person>(null);
    currentAddPersonValue = this.addPersonSource.asObservable();

    private addPersonListSource = new BehaviorSubject<Person[]>(null);
    currentAddPersonListValue = this.addPersonListSource.asObservable();


    // form complete
    private formRegister = new BehaviorSubject<boolean>(false);
    gettingFormRegister = this.formRegister.asObservable();

    changeIdValue(idValue: string) {
        this.idValueSource.next(idValue);
    }

    changeAddCategoryValue(categoryValue: FormCategory) {
        this.addCategorySource.next(categoryValue);
    }

    changeAddPersonValue(personValue: Person) {
        this.addPersonSource.next(personValue);
    }

    changeAddPersonListValue(personValue: Person[]) {
        this.addPersonListSource.next(personValue);
    }

    setFormRegister(set: boolean) {
        this.formRegister.next(set);
    }

    /// countOfWorKOrder
    public static total = new BehaviorSubject<number>(0);
    public static getTotal = DataService.total.asObservable();

    public static setTotal(value: number) {
        localStorage.setItem('Total', value.toString());
        this.total.next(value);
    }

    public static workOrderAndFormRepository = new
    BehaviorSubject<WorkTableDto.ActivitySampleWorkOrderAndFormRepository>(null);
    public static getWAFRepository = DataService.workOrderAndFormRepository.asObservable();

    public static setWAFRepository(value: WorkTableDto.ActivitySampleWorkOrderAndFormRepository) {
        this.workOrderAndFormRepository.next(value);
    }

    public static existedAlreadySaveForWAR = new
    BehaviorSubject<boolean>(false);
    public static getExistedAlreadySaveForWAR = DataService.existedAlreadySaveForWAR.asObservable();

    public static setExistedAlreadySaveForWAR(value: boolean) {
        this.existedAlreadySaveForWAR.next(value);
    }

    // existedAlreadySaveForWAR
    // public static editAccount = new BehaviorSubject<any>(0);
    // public static getEditAccount = DataService.editAccount.asObservable();
    //
    // public static setEditAccount(value: any) {
    // DataService.editAccount.next(value);
    // }
    ///!!! total


}
