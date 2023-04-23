<template></template>

<script setup>
import * as PIXI from 'pixi.js';
import * as TWEEDLE from 'tweedle.js';
import BgContainer from './BgContainer';
import Basket from './Basket';
import CoolSprite from '../util/CoolSprite';

// application ------------------------------
const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  background: '#1099bb',
})
document.body.appendChild(app.view);

// tween ----------------------------------
app.ticker.add(() => TWEEDLE.Group.shared.update());

// bgLine --------------------------------------
const bgContainer = new BgContainer(app);
bgContainer.buildBgLine();

// backet --------------------------------------
const basket = new Basket(app, 300);
basket.init();

// container ------------------------------
const container = new PIXI.Container();
app.stage.addChild(container);

// bunny
// const bunny = PIXI.Sprite.from("bunny.png");
const bunny = CoolSprite.from("bunny.png");
bunny.preprocss(container, function (that) {
  that.x = app.screen.width / 2;
  that.y = app.screen.height / 2;

  app.ticker.add((delta) => {
    that.rotation += 0.05;
  });
});


bunny.on("pointerdown", onDragStart, bunny);

let dragTarget;
function onDragStart() {
  this.alpha = 0.5;
  dragTarget = this;
  app.stage.on('pointermove', onDragMove);
}

function onDragMove(event) {
  if (dragTarget) {
    dragTarget.parent.toLocal(event.global, null, dragTarget.position);
    if (basket.isCollidingWithBasket(dragTarget)) {
      dragTarget.position.copyFrom(dragTarget.lastPosition);
    }
    dragTarget.lastPosition.copyFrom(dragTarget.position);
  }
}

app.stage.interactive = true;
app.stage.hitArea = app.screen;
app.stage.on('pointerup', onDragEnd);
app.stage.on('pointerupoutside', onDragEnd);

function onDragEnd() {
  if (dragTarget) {
    app.stage.off('pointermove', onDragMove);
    dragTarget.alpha = 1;
    dragTarget = null;
  }
}


function resize() {
  app.renderer.resize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", resize);

</script>

<style lang="less" scoped></style>
