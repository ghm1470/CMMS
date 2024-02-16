import {MatrixQuestion} from './matrix-question';
import {BasicElement} from './basic-element';
import {Image} from '../../shared/model/Image';
export class Matrix extends BasicElement {
  matrixQuestionList: Array<MatrixQuestion>;
  optionList: Array<Image>;
}
