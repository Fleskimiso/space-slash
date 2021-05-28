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


export default {
  name: "Game",
  setup() {
    onMounted(() => {
      const pixiCanvas = document.getElementById("pixiCanvas");
      const appWidth = 1200;
      const appHeight = 600
      const pixiApp = new PIXI.Application({
        width: appWidth,
        height: appHeight,
        antialias: true,
        view: pixiCanvas,
        backgroundAlpha: true
      });
      const loader = new PIXI.Loader();

      let Earth = new PIXI.Sprite();
      let SpaceShip = new PIXI.Sprite();

      let absolutePositionMessage = new PIXI.Text("Hello world");
      pixiApp.stage.addChild(absolutePositionMessage);
      absolutePositionMessage.position.set(appWidth - 400, 30);
      absolutePositionMessage.style.fill = "white";
      let relativePositionMessage = new PIXI.Text("Hello you mortal!");
      pixiApp.stage.addChild(relativePositionMessage);
      relativePositionMessage.position.set(appWidth - 400, 60);
      relativePositionMessage.style.fill = "white";
      let spaceshipPositionMessage = new PIXI.Text("posss")
      pixiApp.stage.addChild(spaceshipPositionMessage)
      spaceshipPositionMessage.style.fill = "white";
      spaceshipPositionMessage.position.set(appWidth -400, 90);

      let shipEarthRay = 0;

      //music 
      let mainAudioTrack = null

      loader.add("earth",earthPath)
      .add("spaceship",spaceshipPath)
      .add("maintrack", lastAngelSoundTrackPath)
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

      shipEarthRay = SpaceShip.height/2 + Earth.height/2;

      mainAudioTrack = new window.Audio(lastAngelSoundTrackPath);
      mainAudioTrack.play();
      mainAudioTrack.loop = true;

      pixiApp.ticker.maxFPS = 20;
      pixiApp.ticker.add(delta => gameLoop(delta));

      });
      let lastmouseX = 500;
      let lastmouseY = 500;

      function gameLoop(delta) {
        const mousePosition = pixiApp.renderer.plugins.interaction.mouse.global;
        // text info about positions
        absolutePositionMessage.text = "Absolute x: " + mousePosition.x + " y: " + mousePosition.y;
        relativePositionMessage.text = "Relative x: " + (mousePosition.x - appWidth/2) + " y: " + (-mousePosition.y + appHeight/2);
        spaceshipPositionMessage.text = (Math.abs(-mousePosition.y + appHeight/2) < Earth.height/2 && Math.abs(mousePosition.x - appWidth/2) < Earth.height/2) ;
        
      
           //rotating to cursor ray should take 2s and getting to position aswell
        const tgA = Number( -mousePosition.y+appHeight/2-(appHeight/2-SpaceShip.y))
        /Number(mousePosition.x-appWidth/2-(SpaceShip.x-appWidth/2));
        let alfaRot = Math.atan(tgA);
        if(mousePosition.x -appWidth/2 < 0){
          alfaRot = -Math.PI + alfaRot;
        }
        alfaRot = -(alfaRot - Math.PI/2) 
        
        // that much code was not very nessecary, might as well just left it for the allowed ranges of rotations
        // that is right difference between old and new ROT, so that there is no bug
        // ~~ for now outside earthshipray rotating seems ok
        if(-mousePosition.y+ appHeight/2 < 0 && alfaRot < (3/2) * Math.PI) {
          if( Math.abs(SpaceShip.rotation - alfaRot) > Math.PI/25 && Math.abs(SpaceShip.rotation - alfaRot) < Math.PI/3 ||  Math.abs(SpaceShip.rotation - alfaRot) > 3*Math.PI/2  ){
          SpaceShip.rotation = alfaRot;
        }
        }else if (-mousePosition.y+ appHeight/2 > 0 &&
         ( (alfaRot> 0 &&  alfaRot < (1/2) * Math.PI)
          || (alfaRot > (3/2) * Math.PI && alfaRot < 2 * Math.PI ) ) ) {
          if( Math.abs(SpaceShip.rotation - alfaRot) > Math.PI/25 && Math.abs(SpaceShip.rotation - alfaRot) < Math.PI/3 ||  Math.abs(SpaceShip.rotation - alfaRot) > 3*Math.PI/2  ){
          SpaceShip.rotation = alfaRot;
        }
        }
        
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



      };
          
    });
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
