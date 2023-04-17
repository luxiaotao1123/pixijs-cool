import * as PIXI from 'pixi.js';

let lineDefaultAlpha = .6;
let lineDefaultColor = 0xFFFFFF;

class BgContainer {

  #container;

  constructor(app) {
    this.#container = new PIXI.Container({
    });
    app.stage.addChild(this.#container);
  }

  buildBgLine() {
    const inte = 50;
    this.#buildXLine(inte);
    this.#buildYLine(inte);
  }

  #buildXLine(inte) {
    for (let i = 0; i < window.innerWidth / inte; i++) {
      const graphics = new PIXI.Graphics();
      graphics.lineStyle(1.5, lineDefaultColor, lineDefaultAlpha);
      graphics.beginFill(lineDefaultColor);
      graphics.moveTo(i * inte, 0);
      graphics.lineTo(i * inte, window.innerHeight);
      graphics.endFill();
      
      graphics.interactive = true;
      graphics.hitArea = graphics.getBounds();
      graphics.on("pointermove", onDragMove, graphics);
      graphics.on("pointerout", onDragOut, graphics);
      this.#container.addChild(graphics);
    }
  }

  #buildYLine(inte) {
    for (let i = 0; i < window.innerWidth / inte; i++) {
      const graphics = new PIXI.Graphics();
      graphics.lineStyle(1.5, lineDefaultColor, lineDefaultAlpha);
      graphics.beginFill(lineDefaultColor);
      graphics.moveTo(0, i * inte);
      graphics.lineTo(window.innerWidth, i * inte);
      graphics.endFill();

      graphics.interactive = true;
      graphics.hitArea = graphics.getBounds();
      graphics.on("pointermove", onDragMove, graphics);
      graphics.on("pointerout", onDragOut, graphics);
      this.#container.addChild(graphics);
      this.#container.addChild(graphics);
    }
  }

}

function onDragMove(event) {
  this.tint = 0xFF0033;
  this.alpha = 1;
}

function onDragOut(event) {
  this.tint = lineDefaultColor;
  this.alpha = lineDefaultAlpha;
}

export default BgContainer;
