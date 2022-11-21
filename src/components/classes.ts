import { AnimatedSprite } from "pixi.js";
import { v4 as uuidv4 } from 'uuid';

export class Enemy extends AnimatedSprite{
  model: string;
  id: string;
  constructor(model : string, texturesArray : any) {
    super(texturesArray[`${model}`].animations[`${model}`]);
    this.id = uuidv4();
  }
}