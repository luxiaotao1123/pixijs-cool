<template>
</template>

<script setup>
import * as PIXI from 'pixi.js';

// application ------------------------------
const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    background: '#1099bb'
})
document.body.appendChild(app.view);

// container ------------------------------
const container = new PIXI.Container({ 
});
// container.width = 300;
// container.height = 500;
// container.position.set(100, 100);
app.stage.addChild(container);

// bunny
const bunny = PIXI.Sprite.from("bunny.png");
bunny.anchor.set(0.5);
bunny.x = app.screen.width / 2;
bunny.y = app.screen.height / 2;
bunny.interactive = true;
bunny.cursor = 'pointer';
container.addChild(bunny);

app.ticker.add((delta) => {
    bunny.rotation += 0.05;
});

bunny.on("pointerdown", onDragStart, bunny);

let dragTarget;
function onDragStart() {
    this.alpha = 0.5;
    dragTarget = this;
    app.stage.on('pointermove', onDragMove);
}

function onDragMove(event) {
    if(dragTarget) {
        dragTarget.parent.toLocal(event.global, null, dragTarget.position)
    }
}

app.stage.interactive = true;
app.stage.hitArea = app.screen;
app.stage.on('pointerup', onDragEnd);
app.stage.on('pointerupoutside', onDragEnd);

function onDragEnd() {
    if(dragTarget) {
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

<style lang="less" scoped>
</style>
