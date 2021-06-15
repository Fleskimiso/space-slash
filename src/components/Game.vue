<template>
  <div class="title">Space-Slash</div>
  <canvas id="pixiCanvas"> </canvas>
</template>

<script>
import * as PIXI from "pixi.js";
import { onMounted, ref } from "vue";
import earthPath from "../assets/graphics/specific/EarthPlanet.png";
import spaceshipPath from "../assets/graphics/specific/SpaceShip.png";
import  lastAngelSoundTrackPath from "../assets/music/fato_shadow_-_last_angel.mp3";
import smallShipPath from "../assets/graphics/specific/EnemyShip1.png";
import bigShipPath from "../assets/graphics/specific/EnemyShip2.png";
import beam1Path from "../assets/graphics/specific/beam1.png";
import { EnemyShip } from "./EnemyShip"; 
import { Bullet } from "./Bullet";

export default {
  name: "Game",
  setup() {
    onMounted(() => {
      const pixiCanvas = document.getElementById("pixiCanvas");
      const appWidth = 1200;
      const appHeight = 600;
      const pixiApp = new PIXI.Application({
        width: appWidth,
        height: appHeight,
        antialias: true,
        view: pixiCanvas,
        backgroundAlpha: true
      });
      const loader = new PIXI.Loader();

      let Earth = new PIXI.Sprite();
      let earthHealth = 100;
      let score = 0;
      let damage = 10; 
      let SpaceShip = new PIXI.Sprite();
      let enemyShipsArray = [];
      let bulletArray = [];

      function calculateRotationForEnemies(vessel){
        let ves_x = vessel.sprite.position.x;
        let ves_y = vessel.sprite.position.y;
        ves_x -= appWidth/2;
        ves_y = -(ves_y - appHeight/2)
        let angle = Math.atan2(ves_x,ves_y)
        return angle+Math.PI
      }

      let messageHealth = new PIXI.Text( "Planet Health: " + String(earthHealth));
      pixiApp.stage.addChild(messageHealth);
      messageHealth.position.set(appWidth - 400, 30);
      messageHealth.style.fill = "white";
      let messagescore = new PIXI.Text("Score: "+ String(score));
      pixiApp.stage.addChild(messagescore);
      messagescore.position.set(appWidth - 400, 60);
      messagescore.style.fill = "white";
    

      let shipEarthRay = 0;

      //music 
      let mainAudioTrack = null

      loader.add("earth",earthPath)
      .add("spaceship",spaceshipPath)
      .add("maintrack", lastAngelSoundTrackPath)
      .add("smallEnemyShip", smallShipPath)
      .add("bigEnemyShip", bigShipPath)
      .add("beam1",beam1Path)
      .load((smth, resour) =>{
      Earth = new PIXI.Sprite(loader.resources["earth"].texture);
      Earth.pivot.x = Earth.width/2;
      Earth.pivot.y = Earth.height/2;
      Earth.scale.x = 0.4;
      Earth.scale.y = 0.4;
      Earth.position.set(appWidth/2,appHeight/2)
      pixiApp.stage.addChild(Earth);

      SpaceShip = new PIXI.Sprite(loader.resources["spaceship"].texture);
      pixiApp.stage.addChild(SpaceShip);
      SpaceShip.pivot.x = SpaceShip.width/2;
      SpaceShip.pivot.y = SpaceShip.height/2;
      SpaceShip.scale.x = 0.5;
      SpaceShip.scale.y = 0.5;
      SpaceShip.position.x = appWidth/2;
      SpaceShip.position.y = appHeight/2 - Earth.height/2 - SpaceShip.height/2;

      // dummy ships for testing purposes
      for(let i=0; i<15; i++){
        let side_probability = Math.random();
        let x_pos = 0;
        let y_pos = 0;
        let type = 1;
        if( side_probability >= 0 &&  side_probability < 0.25) { //right side
            x_pos = appWidth;
            y_pos = appHeight * Math.random();
        }else if (side_probability >=0.25 && side_probability < 0.5){ //up side
            x_pos = appWidth * Math.random();
        }else if( side_probability>= 0.5 && side_probability <0.75){ //left side
            y_pos  = appHeight * Math.random();          
        }else if (side_probability >= 0.75 && side_probability <=1){ //bottom side
            y_pos = appHeight;
            x_pos = appWidth * Math.random();
        }
        let type_probability = Math.random();
        if(type_probability > 0.3){
          type = 1; //small ship
        }else {
          type =2; //big ship
        }
        enemyShipsArray.push(new EnemyShip(loader,type,x_pos,y_pos))
      }
      enemyShipsArray.forEach(enemyVessel => {
        pixiApp.stage.addChild(enemyVessel.sprite);
        enemyVessel.sprite.rotation = calculateRotationForEnemies(enemyVessel);
        enemyVessel.actualizeSinAndCos();
      })


      shipEarthRay = SpaceShip.height/2 + Earth.height/2;

      mainAudioTrack = new window.Audio(lastAngelSoundTrackPath);
      mainAudioTrack.play();
      mainAudioTrack.loop = true;

      pixiApp.ticker.maxFPS = 20;
      pixiApp.ticker.add(delta => gameLoop(delta));

      });
      let lastmouseX = 500;
      let lastmouseY = 500;

      
      //on click shoot beam
      pixiCanvas.addEventListener("click", () =>{
        console.log("click");
            bulletArray.push(new Bullet(loader,"beam",SpaceShip.position.x,SpaceShip.position.y,SpaceShip.rotation));
            pixiApp.stage.addChild(bulletArray[bulletArray.length-1].sprite);
            bulletArray.push(new Bullet(loader,"beam",SpaceShip.position.x,SpaceShip.position.y,SpaceShip.rotation + Math.PI/12));
            pixiApp.stage.addChild(bulletArray[bulletArray.length-1].sprite);
            bulletArray.push(new Bullet(loader,"beam",SpaceShip.position.x,SpaceShip.position.y,SpaceShip.rotation - Math.PI/12));
            pixiApp.stage.addChild(bulletArray[bulletArray.length-1].sprite);
            if(score > 500) {
              bulletArray.push(new Bullet(loader,"beam",SpaceShip.position.x,SpaceShip.position.y,SpaceShip.rotation + Math.PI/6));
            pixiApp.stage.addChild(bulletArray[bulletArray.length-1].sprite);
            bulletArray.push(new Bullet(loader,"beam",SpaceShip.position.x,SpaceShip.position.y,SpaceShip.rotation - Math.PI/6));
            pixiApp.stage.addChild(bulletArray[bulletArray.length-1].sprite);
            damage = 20;
            }
            if(score > 1000){
              damage = 40;
            }
      })

      function gameLoop(delta) {
        const mousePosition = pixiApp.renderer.plugins.interaction.mouse.global;
        // text info about positions
        messageHealth.text = "Planet Health: " + String(earthHealth);
        messagescore.text = "Score: " + String(score);
        
      
        let rotX = (mousePosition.x - appWidth/2) - (SpaceShip.position.x - appWidth/2);
        let rotY = (-mousePosition.y + appHeight/2) - (-SpaceShip.position.y + appHeight/2);
        SpaceShip.rotation = Math.atan2(rotX,rotY);
        
        // calculating angle
        const tgAlfaPos = Number( -mousePosition.y+appHeight/2) /Number(mousePosition.x-appWidth/2);
        let alfaPos = Math.atan(tgAlfaPos);
        if(mousePosition.x -appWidth/2 < 0){
          alfaPos = +Math.PI + alfaPos;
        }
      // setting position according to angle
        SpaceShip.position.x = Math.floor(shipEarthRay * Math.cos(alfaPos) + appWidth/2,);
        SpaceShip.position.y = Math.floor( -shipEarthRay * Math.sin(alfaPos) + appHeight/2);
        // unnessecary code for now
        lastmouseX = mousePosition.x + appWidth/2
        lastmouseY = -mousePosition.y + appHeight/2
        // TODO shooting or something like that
        
        //steering 
        // enemyshipmovements
        let recalibratedDelta = delta/1000
        enemyShipsArray.forEach(vessel =>{
          vessel.move(recalibratedDelta);
        })
        // if within planet range, decrease health
        enemyShipsArray.forEach(vessel =>{
          if(Earth.containsPoint( new PIXI.Point(vessel.sprite.position.x,vessel.sprite.position.y)) ){
              earthHealth = earthHealth - 10;
              console.log("fulfilled should disappear");
              pixiApp.stage.removeChild(vessel.sprite);
              enemyShipsArray = enemyShipsArray.filter( vessel2 => vessel !== vessel2);
           }
        })
        // move bullets
        if(bulletArray !== undefined){
          bulletArray.forEach(bullet =>{
          bullet.move(recalibratedDelta);
          if(bullet.lifetime < 0 ){
            pixiApp.stage.removeChild(bullet.sprite);
            bulletArray = bulletArray.filter(otherBulltet => otherBulltet !== bullet);
          }
          enemyShipsArray.forEach(vessel =>{
            if(vessel.sprite.containsPoint( new PIXI.Point(bullet.sprite.position.x,bullet.sprite.position.y))){
              vessel.health -= damage;
              pixiApp.stage.removeChild(bullet.sprite);
              bulletArray = bulletArray.filter(otherBulltet => otherBulltet !== bullet);
              if(vessel.health <= 0){
                 if(vessel.type == 1){
                score += 10;
              }else {
                score += 30;
              }
              //add two new faster healther ship at randomized position
              EnemyShip.healthMultiplier += 0.04;
              EnemyShip.speedMultiplier += 0.01;
              let shiptype = vessel.type;
              let radious = 800;
              let angle1 = Math.random() * 2 *Math.PI;
              let angle2 = Math.random() * 2 *Math.PI
              enemyShipsArray.push(new EnemyShip(loader,shiptype,radious*Math.cos(angle1) + appWidth/2,
              radious*Math.sin(angle1) + appHeight/2 ));
              pixiApp.stage.addChild(enemyShipsArray[enemyShipsArray.length-1].sprite);
              enemyShipsArray[enemyShipsArray.length-1].sprite.rotation = calculateRotationForEnemies(enemyShipsArray[enemyShipsArray.length-1]);
              enemyShipsArray[enemyShipsArray.length-1].actualizeSinAndCos();
              enemyShipsArray[enemyShipsArray.length-1].health *= EnemyShip.healthMultiplier;
              enemyShipsArray[enemyShipsArray.length-1].speed *= EnemyShip.speedMultiplier;

                enemyShipsArray.push(new EnemyShip(loader,shiptype,radious*Math.cos(angle2) + appWidth/2,
              radious*Math.sin(angle2) + appHeight/2 ));
              pixiApp.stage.addChild(enemyShipsArray[enemyShipsArray.length-1].sprite);
                 enemyShipsArray[enemyShipsArray.length-1].sprite.rotation = calculateRotationForEnemies(enemyShipsArray[enemyShipsArray.length-1]);
              enemyShipsArray[enemyShipsArray.length-1].actualizeSinAndCos();
                 enemyShipsArray[enemyShipsArray.length-1].health *= EnemyShip.healthMultiplier;
              enemyShipsArray[enemyShipsArray.length-1].speed *= EnemyShip.speedMultiplier;

               pixiApp.stage.removeChild(vessel.sprite);
              enemyShipsArray = enemyShipsArray.filter(vessel2 => vessel2 !== vessel);
              }
            }
          });
        });
        }
        //after bullets 
      // keeping enemy count to maximally 60 
      while(enemyShipsArray.length > 60){
        pixiApp.stage.removeChild(enemyShipsArray[enemyShipsArray.length-1].sprite)
        enemyShipsArray.pop();
      }


      };
    
          
    });
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
