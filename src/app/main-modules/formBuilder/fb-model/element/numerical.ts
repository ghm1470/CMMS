import {BasicElement} from './basic-element';

export class Numerical extends BasicElement {
  minLength: number;
  maxLength: number;
  step: number;
  beginLabel: string;
  endLabel: string;
}

