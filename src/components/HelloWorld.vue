<template>
  <div class="hello">Tehere should be pixi</div>
  <canvas id="pixiCanvas"> </canvas>
</template>

<script>
import * as PIXI from "pixi.js";
import { onMounted, ref } from "vue";

export default {
  name: "HelloWorld",
  setup() {
    onMounted(() => {
      const pixiCanvas = document.getElementById("pixiCanvas");
        
      const pixiApp = new PIXI.Application({
        width: 600,
        height: 600,
        antialias: true,
        view: pixiCanvas,
        backgroundAlpha: true
      });

      const graphics = new PIXI.Graphics()

      graphics.lineStyle(8, 0x222222)
      //start
      graphics.moveTo(300, 250)
      //end
      graphics.lineTo(500, 250)

      pixiApp.stage.addChild(graphics)
          
    });
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
