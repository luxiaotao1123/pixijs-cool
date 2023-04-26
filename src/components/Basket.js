import * as PIXI from 'pixi.js';
import * as TWEEDLE from 'tweedle.js'
import IconLoader from './IconLoader';

class Basket {

    #container;
    #box;
    #offset;

    constructor(app, offset) {
        this.#container = new PIXI.Container({
        });
        app.stage.addChild(this.#container);
        this.#offset = offset;
    }

    init() {
        // box
        this.#box = new PIXI.Graphics();
        this.#box.name = "bg";
        this.#box.beginFill(0x38404E);
        this.#box.drawRoundedRect(0, 0, this.#offset, window.innerHeight, 3);
        this.#box.endFill();
        this.#container.addChild(this.#box);

        // line
        // let inte = 50;
        // const graphics = new PIXI.Graphics();
        // for (let i = 0; i < this.#offset / inte; i++) {
        //     graphics.lineStyle(1, 0xEEEEEE, .3);
        //     graphics.beginFill(0xEEEEEE);
        //     graphics.moveTo(i * inte -this.#offset, 0);
        //     graphics.lineTo(i * inte -this.#offset, window.innerHeight);
        //     graphics.endFill();
        // }
        // this.#container.addChild(graphics);

        // this.runAnimation();

        return this.#container;
    }

    isCollidingWithBasket(sprite) {
        const spriteBounds = sprite.getBounds();
        const basketBounds = this.#box.getBounds();
        return spriteBounds.x + spriteBounds.width > basketBounds.x &&
            spriteBounds.x < basketBounds.x + basketBounds.width &&
            spriteBounds.y + spriteBounds.height > basketBounds.y &&
            spriteBounds.y < basketBounds.y + basketBounds.height;
    }

    runAnimation() {
        new TWEEDLE.Tween(this.#container).to({ x: this.#offset }, 1000)
        // .repeat(1)
        // .repeat(Infinity)
        .yoyo(true)
        .start();
    }


}

export default Basket;