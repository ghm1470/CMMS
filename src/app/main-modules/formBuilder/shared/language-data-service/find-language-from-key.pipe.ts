import { Pipe, PipeTransform } from '@angular/core';
import {languages} from './language.details';

@Pipe({name: 'findLanguageFromKey'})
export class FindLanguageFromKeyPipe implements PipeTransform {
    transform(lang: string): string {
      return languages[lang].name;
    }
    isRTL(lang: string): boolean {
        return languages[lang].rtl;
    }
}
