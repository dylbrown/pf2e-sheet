<style scoped>
#container {
  z-index: 2;
  position: absolute;
  left: 0;
  top: 0;
  transition: all 1s ease 0s;
  margin: auto;
  background-color: none;
  display: inline-flex;
  justify-content: space-around;
  align-items: center;
  align-content: space-around;
  height: 100vh;
  width: 100%;
  flex-wrap: wrap;
}
.tile {
  position: relative;
  display: inline-block;
  background-color: blue;
  /*border:1px solid #ccc;*/
  height: 50vh;
  width: 25%;
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  transition: all 0.3s ease 0s;
}
.tile:hover {
  opacity: 0.6;
  filter: alpha(opacity=60);
}
.tile:active {
  opacity: 1;
  filter: alpha(opacity=100);
}
#t-info {
  background-color: hsla(204, 70%, 53%, 1);
}
#t-stats {
  background-color: hsla(145, 63%, 49%, 1);
}
#t-inv {
  background-color: hsla(210, 29%, 29%, 1);
}
#t-battle {
  background-color: hsla(48, 89%, 50%, 1);
}
#t-skills {
  background-color: hsla(168, 76%, 36%, 1);
}
#t-qual {
  background-color: hsla(6, 63%, 46%, 1);
}
#t-Sspell {
  background-color: hsla(282, 44%, 47%, 1);
}
#t-Aspell {
  background-color: hsla(28, 80%, 52%, 1);
}

#t-info:active {
  background-color: hsla(204, 70%, 21%, 1);
}
#t-stats:active {
  background-color: hsla(145, 63%, 24%, 1);
}
#t-inv:active {
  background-color: hsla(210, 29%, 14%, 1);
}
#t-battle:active {
  background-color: hsla(48, 89%, 25%, 1);
}
#t-skills:active {
  background-color: hsla(168, 76%, 18%, 1);
}
#t-qual:active {
  background-color: hsla(6, 63%, 23%, 1);
}
#t-Sspell:active {
  background-color: hsla(282, 44%, 23%, 1);
}
#t-Aspell:active {
  background-color: hsla(28, 80%, 26%, 1);
}
.icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 7rem;
  text-shadow: 0.4vw 0.4vw 0px rgba(0, 0, 0, 0.2);
  color: #fff;
}
.title {
  font-family: Helvetica;
  text-shadow: 0.25vw 0.25vw 0px rgba(0, 0, 0, 0.2);
  position: absolute;
  bottom: 5%;
  left: 5%;
  transform: translate(0, -100%);
  font-size: 1.1rem;
  color: white;
  vertical-align: baseline;
  user-select: none;
}
</style>
<template>
  <div id="container">
    <div id="t-info" class="tile">
      <div class="icon"><i class="ra ra-player"></i></div>
      <div class="title">Info</div>
    </div>
    <div id="t-stats" class="tile">
      <div class="icon"><i class="ra ra-dice-three"></i></div>
      <div class="title">Stats</div>
    </div>
    <div id="t-inv" class="tile">
      <div class="icon"><i class="ra ra-ammo-bag"></i></div>
      <div class="title">Stuff</div>
    </div>
    <div id="t-battle" class="tile">
      <div class="icon"><i class="ra ra-relic-blade"></i></div>
      <div class="title">Battle</div>
    </div>
    <div id="t-skills" class="tile">
      <div class="icon"><i class="ra ra-hammer"></i></div>
      <div class="title">Skills</div>
    </div>
    <div id="t-qual" class="tile">
      <div class="icon"><i class="ra ra-wooden-sign"></i></div>
      <div class="title">Abilities</div>
    </div>
    <div id="t-Sspell" class="tile">
      <div class="icon"><i class="ra ra-crystal-wand"></i></div>
      <div class="title">Spells</div>
    </div>
    <div id="t-Aspell" class="tile">
      <div class="icon"><i class="ra ra-scroll-unfurled"></i></div>
      <div class="title">Prepping</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import Character from 'src/character/character';
defineProps<{
  character: Character;
}>();
</script>
