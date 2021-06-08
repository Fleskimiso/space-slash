import * as PIXI from "pixi.js";

export class EnemyShip {
    sprite = new PIXI.Sprite();
    type = 0
    constructor(loader,type, x,y) {
      if(type === 1){
        this.sprite = new PIXI.Sprite(loader.resources["smallEnemyShip"].texture);
      }else if(type ===2){
        this.sprite = new PIXI.Sprite(loader.resources["bigEnemyShip"].texture);
      }// no default for now
      //default rotation
      this.sprite.rotation = -Math.PI/2;
      this.sprite.position.x = x;
      this.sprite.position.y = y;
      this.type = type
    }
}
