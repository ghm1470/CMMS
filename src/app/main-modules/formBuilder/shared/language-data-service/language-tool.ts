import {FindLanguageFromKeyPipe} from './find-language-from-key.pipe';
import {Renderer2} from '@angular/core';

export class LanguageTool {

  constructor(private renderer: Renderer2,
              private findLanguageFromKeyPipe: FindLanguageFromKeyPipe) {}

  updatePageDirection(selectedLanguage: string) {
    this.renderer.setAttribute(document.querySelector('html'), 'dir'
      , this.findLanguageFromKeyPipe.isRTL(selectedLanguage) ? 'rtl' : 'ltr');
    this.renderer.setAttribute(document.querySelector('html'), 'lang', selectedLanguage);
  }
}
