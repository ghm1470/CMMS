import {Direction} from "./direction.enum";

export class Sort {
  direction?: Direction;
  filedName?: string;

  constructor(direction: Direction,
              filedName: string) {
    this.direction = direction;
    this.filedName = filedName;
  }
}
