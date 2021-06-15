import * as PIXI from "pixi.js";

export class EnemyShip {
    sprite = new PIXI.Sprite();
    type = 0
    health = 10
    speed = 0
    sinusOfRotation =0 
    cosinusOfRotation = 0
    static healthMultiplier = 1
    static speedMultiplier = 1 
    constructor(loader,type, x,y) {
      if(type === 1){
        this.sprite = new PIXI.Sprite(loader.resources["smallEnemyShip"].texture);
        this.health = 10
        this.speed = 250
        this.sprite.scale.x = 0.5
        this.sprite.scale.y = 0.5
      }else if(type ===2){
        this.sprite = new PIXI.Sprite(loader.resources["bigEnemyShip"].texture);
        this.sprite.scale.x = 0.4
        this.sprite.scale.y = 0.4
        this.health = 25
        this.speed = 200
      }// no default for now
      //default rotation
      this.sprite.rotation = -Math.PI/2;
      this.sprite.position.x = x - this.sprite.width/2;
      this.sprite.position.y = y + this.sprite.height/2;
      this.type = type
    }
    actualizeSinAndCos() {
      this.sinusOfRotation = Math.sin(this.sprite.rotation-Math.PI/2);
      this.cosinusOfRotation =Math.cos(this.sprite.rotation- Math.PI/2);
    }
    move(delta){
      this.sprite.position.x += this.speed * delta * this.cosinusOfRotation;
      this.sprite.position.y += this.speed * delta * this.sinusOfRotation;
    }
}
