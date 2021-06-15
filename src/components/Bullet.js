import * as PIXI from "pixi.js";

export class Bullet {
    sprite = new PIXI.Sprite();
    speed = 3000; 
    rotationSinus = 0;
    rotationCosinus = 0;
    lifetime = 10000;

    constructor(loader,type,x_pos,y_pos, rotation) {
        if(type == "beam") {
            this.sprite = new PIXI.Sprite(loader.resources["beam1"].texture);
        }
        this.sprite.position.x = x_pos;
        this.sprite.position.y = y_pos;
        this.sprite.rotation = rotation;
        rotation = rotation - Math.PI/2;
        this.rotationSinus = Math.sin(rotation);
        this.rotationCosinus = Math.cos(rotation);
    }

    move(delta) {
        this.sprite.position.x += this.speed * delta * this.rotationCosinus;
        this.sprite.position.y += this.speed * delta * this.rotationSinus;
        this.lifetime -= delta * 1000;
    }
}