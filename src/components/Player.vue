<template></template>

<script setup>
import * as PIXI from 'pixi.js';
import * as TWEEDLE from 'tweedle.js';
import BgContainer from './BgContainer';
import Basket from './Basket';
import IconLoader from './IconLoader';
import CoolSprite from '../util/CoolSprite';
import LinePainter from '../util/LinePainter';
import CoolGpt from '../util/CoolGpt';

const props = defineProps({
  title: {
    type: String,
  }
})
console.info(props.title);

// application ------------------------------
const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  background: '#1099bb',
  antialias: true,
})

app.stage.interactive = true;
app.stage.hitArea = app.screen;

globalThis.__PIXI_APP__ = app;

document.body.appendChild(app.view);

// tween ----------------------------------
app.ticker.add(() => TWEEDLE.Group.shared.update());

// bgLine --------------------------------------
const bgContainer = new BgContainer(app);
bgContainer.buildBgLine();

// mapContainer ------------------------------
const mapContainer = new PIXI.Container();
app.stage.addChild(mapContainer);

// backet --------------------------------------
const basketWidth = 300;
const basket = new Basket(app, basketWidth);
const basketContainer = basket.init();

// iconLoader ------------------------------
const iconLoader = new IconLoader(basketContainer, mapContainer, basket);
iconLoader.load();

// linePainter ------------------------------
const linePainter = new LinePainter(app);
setTimeout(() => {
  linePainter.draw(mapContainer);
}, 2000)


// bunny
const bunny = CoolSprite.from("bunny.png").setBasket(basket);
bunny.preprocss(mapContainer, function (that) {
  that.x = app.screen.width / 2;
  that.y = app.screen.height / 2;

  app.ticker.add((delta) => {
    that.rotation += 0.05;
  });
});

// resize
function resize() {
  app.renderer.resize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", resize);

// openapi

// CoolGpt.ask("hello rebot").then(res => {
//   console.log(res);
// });

const res = await CoolGpt.ask('Hello');
console.log(res);
</script>

<style lang="less" scoped></style>
